import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const supabaseUrl = 'https://aomcdmeqykiiistciahw.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY environment variable first');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const DIR = '/Users/ryox/Downloads/Asset SUPABASE Teori Pemweb';
const BUCKET = 'camera-images';

const MIME_TYPES = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
};

const CAMERA_NAME_MAP = [
  [/^Canon /i, ''],
  [/^Nikon /i, ''],
  [/^Sony /i, ''],
  [/^Fujifilm /i, ''],
  [/^Fuji/i, ''],
  [/^GoPro /i, ''],
];

async function main() {
  // 1. Upload each image file
  const files = readdirSync(DIR).filter((f) => Object.keys(MIME_TYPES).includes(extname(f).toLowerCase()));

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const mime = MIME_TYPES[ext];
    const filePath = join(DIR, file);
    const buffer = readFileSync(filePath);
    const blob = new Blob([buffer], { type: mime });
    const fileName = file;

    console.log(`Uploading ${file}...`);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, blob, {
        contentType: mime,
        upsert: true,
      });

    if (error) {
      console.error(`  FAILED: ${error.message}`);
      continue;
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    console.log(`  OK → ${publicUrl.publicUrl}`);

    // 2. Try to match to a camera product
    let cleanName = file.replace(ext, '');
    for (const [pattern, replacement] of CAMERA_NAME_MAP) {
      cleanName = cleanName.replace(pattern, replacement);
    }
    cleanName = cleanName.trim();

    // Try matching with ilike
    const { data: cameras } = await supabase
      .from('cameras')
      .select('id')
      .ilike('name', `%${cleanName}%`);

    if (cameras && cameras.length > 0) {
      await supabase
        .from('cameras')
        .update({ image_url: publicUrl.publicUrl })
        .eq('id', cameras[0].id);
      console.log(`  ✓ Updated camera "${cameras[0].id}" (token: "${cleanName}")`);
    } else {
      console.log(`  ✗ No camera match for "${cleanName}"`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
