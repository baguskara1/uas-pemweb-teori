-- Update camera image URLs from .webp to .svg (placeholder images)
update cameras
set image_url = replace(image_url, '.webp', '.svg')
where image_url like '%.webp';
