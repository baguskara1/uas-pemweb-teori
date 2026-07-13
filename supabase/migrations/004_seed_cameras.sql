-- ============================================================================
-- Sewa Kamera Ryox - Seed Data (10 cameras)
-- Migration: 003_seed_cameras.sql
-- ============================================================================

insert into cameras (name, brand, type, description, price_per_day, image_url, stock, is_available) values
  ('Sony A7 IV', 'Sony', 'Mirrorless',
   '33MP full-frame mirrorless with 4K 60p video, real-time eye AF for humans/animals/birds, 5-axis stabilization.',
   250000, '/images/cameras/sony/sony-a7-iv.svg', 5, true),

  ('Sony A7S III', 'Sony', 'Mirrorless',
   'Low-light champion: 12MP BSI sensor, 4K 120p, dual base ISO at 640/16000. Built for video and hybrid shooters.',
   300000, '/images/cameras/sony/sony-a7s-iii.svg', 3, true),

  ('Sony FX3', 'Sony', 'Cinema',
   'Compact full-frame cinema camera, 4K 120p, XAVC S-I, built-in cooling fan. Ideal for run-and-gun filmmaking.',
   450000, '/images/cameras/sony/sony-fx3.svg', 2, true),

  ('Canon EOS R5', 'Canon', 'Mirrorless',
   '45MP full-frame, 8K RAW video, in-body stabilization up to 8 stops. The hybrid flagship for stills and video.',
   350000, '/images/cameras/canon/canon-r5.svg', 4, true),

  ('Canon EOS R6 Mark II', 'Canon', 'Mirrorless',
   '24.2MP, 40fps electronic burst, 6K oversampled 4K 60p. Best-in-class autofocus for sports and wildlife.',
   220000, '/images/cameras/canon/canon-r6-mark-ii.svg', 5, true),

  ('Nikon Z6 II', 'Nikon', 'Mirrorless',
   '24.5MP BSI full-frame, dual EXPEED 6, 4K 60p (cropped), excellent ergonomics for long handheld sessions.',
   200000, '/images/cameras/nikon/nikon-z6-ii.svg', 4, true),

  ('Nikon Z9', 'Nikon', 'Mirrorless',
   '45.7MP stacked sensor, 8K 60p N-RAW, 120fps stills. Pro body with no mechanical shutter.',
   500000, '/images/cameras/nikon/nikon-z9.svg', 1, true),

  ('Fujifilm X-T5', 'Fujifilm', 'Mirrorless',
   '40MP X-Trans 5 HR APS-C, classic dials, 19 film simulations. Perfect for street and travel photography.',
   180000, '/images/cameras/fujifilm/fujifilm-x-t5.svg', 6, true),

  ('Fujifilm X100V', 'Fujifilm', 'Compact',
   '26MP APS-C with fixed 23mm f/2 lens, hybrid viewfinder. The cult favorite for street photographers.',
   150000, '/images/cameras/fujifilm/fujifilm-x100v.svg', 3, true),

  ('GoPro Hero 12 Black', 'GoPro', 'Action Cam',
   '5.3K 60p, HyperSmooth 6.0, waterproof to 10m. The standard for action and POV footage.',
   100000, '/images/cameras/gopro/gopro-hero-12.svg', 10, true);
