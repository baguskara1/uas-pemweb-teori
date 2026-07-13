import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const bucket = 'camera-images';
const downloadsDir = '/Users/ryox/Downloads';

const missingFiles = [
  { file: 'Zhiyun Smooth 5S.jpg', mime: 'image/jpeg', searchName: 'Zhiyun Smooth 5S' },
  { file: 'DJI Osmo Mobile SE.png', mime: 'image/png', searchName: 'DJI Osmo Mobile SE' }
];

async function main() {
  for (const item of missingFiles) {
    const filePath = join(downloadsDir, item.file);
    const buffer = readFileSync(filePath);
    const blob = new Blob([buffer], { type: item.mime });
    
    console.log(`Uploading ${item.file}...`);
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(item.file, blob, {
        contentType: item.mime,
        upsert: true,
      });

    if (uploadError) {
      console.error(`Failed to upload ${item.file}:`, uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(item.file);
    const publicUrl = publicUrlData.publicUrl;
    console.log(`Uploaded! URL: ${publicUrl}`);

    console.log(`Updating database for ${item.searchName}...`);
    const { data: cameras, error: searchError } = await supabase
      .from('cameras')
      .select('id')
      .ilike('name', `%${item.searchName}%`);

    if (searchError) {
      console.error(`Error searching camera:`, searchError);
      continue;
    }

    if (cameras && cameras.length > 0) {
      const { error: updateError } = await supabase
        .from('cameras')
        .update({ image_url: publicUrl })
        .eq('id', cameras[0].id);
        
      if (updateError) {
        console.error(`Error updating camera:`, updateError);
      } else {
        console.log(`✓ Updated camera ${cameras[0].id} with new image!`);
      }
    } else {
      console.log(`✗ Could not find camera matching ${item.searchName}`);
    }
  }
}

main().catch(console.error);
