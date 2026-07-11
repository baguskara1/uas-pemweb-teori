import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';

const supabaseUrl = 'https://aomcdmeqykiiistciahw.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY environment variable first');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const DIR = '/Users/ryox/Downloads/Asset SUPABASE Teori Pemweb';
const BUCKET = 'camera-images';

async function main() {
  // 1. Update allowed MIME types to include image/avif
  const { error: mimeError } = await supabase.rpc('update_bucket_mime_types', {
    bucket_id: BUCKET,
    mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  });

  if (mimeError) {
    // Fallback: direct SQL via management API
    console.log('Updating MIME types via SQL...');
    const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('query', `
      update storage.buckets
      set allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif']
      where id = '${BUCKET}';
    `);
    if (sqlError) console.log('SQL fallback also failed (expected — exec_sql not public). Continuing...');
  }

  // 2. Upload each file
  const files = readdirSync(DIR).filter((f) => f.endsWith('.avif'));

  for (const file of files) {
    const filePath = join(DIR, file);
    const buffer = readFileSync(filePath);
    const blob = new Blob([buffer], { type: 'image/avif' });
    const fileName = file; // keep original name
    const cleanName = file.replace(/\.avif$/, '');

    console.log(`Uploading ${file}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, blob, {
        contentType: 'image/avif',
        upsert: true,
      });

    if (error) {
      console.error(`  FAILED: ${error.message}`);
      continue;
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    console.log(`  OK → ${publicUrl.publicUrl}`);

    // 3. Update camera record if name matches
    const cameraName = cleanName
      .replace(/^Canon /, '')
      .replace(/^Nikon /, '')
      .replace(/^Sony /, '')
      .replace(/^Fujifilm /, '')
      .replace(/^Fuji/, '')
      .replace(/^GoPro /, '')
      .trim();

    const { data: cameras } = await supabase
      .from('cameras')
      .select('id')
      .ilike('name', `%${cameraName}%`);

    if (cameras && cameras.length > 0) {
      await supabase
        .from('cameras')
        .update({ image_url: publicUrl.publicUrl })
        .eq('id', cameras[0].id);
      console.log(`  Updated camera "${cameraName}" (id: ${cameras[0].id})`);
    } else {
      console.log(`  No camera match for "${cameraName}"`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
