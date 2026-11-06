-- Update existing rows to real products (reuse IDs to preserve any references)

-- 1. Smart Ring Pro - Health Tracker ($59)
UPDATE products SET
  name = 'Smart Ring Pro - Health Tracker',
  tagline = '24/7 health tracking in a sleek titanium ring',
  description = 'Track your sleep, heart rate, blood oxygen, steps, and recovery — all from a lightweight titanium smart ring. 7-day battery life, wireless charging, and a companion app with AI health insights. Water resistant to 100m.',
  price = 59,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/35147278/pexels-photo-35147278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Material": "Titanium", "Battery": "7 days", "Sensors": "HR, SpO2, Temp", "Water Resistance": "100m", "Charging": "Wireless", "App": "iOS & Android"}'::jsonb
WHERE id = '7a3ddebe-546c-43c6-84c8-e5bd2b0f9350';

-- 2. 4K Mini Portable Projector ($129)
UPDATE products SET
  name = '4K Mini Portable Projector',
  tagline = 'Cinema-quality projection anywhere you go',
  description = 'Pocket-sized 4K projector with built-in speakers, Wi-Fi screen mirroring, and 6000 lumens brightness. Project up to 200 inches on any wall. Perfect for movies, presentations, and gaming. Connects via HDMI, USB, or wireless.',
  price = 129,
  category = 'Displays',
  image_url = 'https://images.pexels.com/photos/5515482/pexels-photo-5515482.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Resolution": "4K UHD", "Brightness": "6000 lumens", "Screen Size": "Up to 200 inch", "Connectivity": "HDMI, USB, Wi-Fi", "Speakers": "Built-in 5W", "Weight": "420g"}'::jsonb
WHERE id = '2ada257d-12b1-4831-8880-9f364cef3f66';

-- 3. MagSafe 20,000mAh Power Bank ($35)
UPDATE products SET
  name = 'MagSafe 20,000mAh Power Bank',
  tagline = 'Magnetic wireless charging for your phone',
  description = 'Snap-on MagSafe power bank with 20,000mAh capacity. Charges your phone wirelessly at 15W, plus two USB-C ports for wired charging. LED battery indicator. Charges most phones 4-5 times on a single charge.',
  price = 35,
  category = 'Phone Accessories',
  image_url = 'https://images.pexels.com/photos/4072683/pexels-photo-4072683.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Capacity": "20,000mAh", "Output": "15W wireless, 20W USB-C", "Ports": "2x USB-C, 1x USB-A", "Charging": "MagSafe + Wired", "Weight": "280g", "Indicator": "LED"}'::jsonb
WHERE id = '3cb57157-b929-487c-9912-c16458d8892a';

-- 4. AI Translator Earbuds ($79)
UPDATE products SET
  name = 'AI Translator Earbuds',
  tagline = 'Real-time translation in 144 languages',
  description = 'Wireless earbuds with built-in AI real-time translation. Speak and understand 144 languages instantly. Also works as premium Bluetooth earbuds with active noise cancellation and 30-hour battery life with charging case.',
  price = 79,
  category = 'Audio',
  image_url = 'https://images.pexels.com/photos/7989066/pexels-photo-7989066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Languages": "144", "Translation": "Real-time AI", "Battery": "8h + 22h case", "ANC": "Active Noise Cancellation", "Bluetooth": "5.3", "Drivers": "10mm"}'::jsonb
WHERE id = '1c3dc891-d7c3-4353-b8bf-3494d2b42256';

-- 5. Smart Glasses with Camera ($99)
UPDATE products SET
  name = 'Smart Glasses with Camera',
  tagline = 'Capture photos and videos from your glasses',
  description = 'Stylish smart glasses with a built-in 12MP camera. Capture photos and videos hands-free, listen to music with open-ear speakers, and take calls discreetly. Polarized lenses with UV400 protection. 6-hour battery life.',
  price = 99,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/20201999/pexels-photo-20201999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Camera": "12MP", "Video": "1080p", "Storage": "32GB", "Speakers": "Open-ear", "Lenses": "Polarized UV400", "Battery": "6 hours"}'::jsonb
WHERE id = '5453d6b3-c212-4876-8ee2-d46d427d55fa';

-- 6. Transparent Bluetooth Keyboard ($45)
UPDATE products SET
  name = 'Transparent Bluetooth Keyboard',
  tagline = 'Sleek see-through keyboard for all devices',
  description = 'Ultra-slim transparent acrylic Bluetooth keyboard. Connects to phones, tablets, and laptops. Full-size layout with quiet scissor switches. 6-month battery on a single charge. Works with iOS, Android, Windows, and Mac.',
  price = 45,
  category = 'Phone Accessories',
  image_url = 'https://images.pexels.com/photos/34030131/pexels-photo-34030131.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Layout": "Full QWERTY", "Connection": "Bluetooth 5.1", "Battery": "6 months", "Compatibility": "iOS, Android, Win, Mac", "Material": "Acrylic + Aluminum", "Weight": "320g"}'::jsonb
WHERE id = 'b013ca26-ab0a-4baf-84fb-073d20845656';

-- 7. VR Headset Pro ($89)
UPDATE products SET
  name = 'VR Headset Pro',
  tagline = 'Immersive virtual reality headset',
  description = 'Standalone VR headset with 4K per-eye display, 120Hz refresh rate, and built-in spatial audio. No phone or PC required. Access 1000+ games and experiences. 3-hour battery life with fast charging.',
  price = 89,
  category = 'Gaming',
  image_url = 'https://images.pexels.com/photos/5207559/pexels-photo-5207559.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Display": "4K per eye", "Refresh Rate": "120Hz", "Audio": "Spatial built-in", "Battery": "3 hours", "Connectivity": "Wi-Fi 6, USB-C", "Controllers": "2 included"}'::jsonb
WHERE id = 'ae357a0e-e394-4571-bb9b-d68342c7e3ae';

-- 8. Drone X1 ($129)
UPDATE products SET
  name = 'Drone X1',
  tagline = '4K camera drone with 30-min flight time',
  description = 'Compact foldable drone with 4K camera, 3-axis gimbal stabilization, and 30-minute flight time. GPS return-to-home, follow-me mode, and real-time video transmission to your phone. Range up to 4km.',
  price = 129,
  category = 'Drones',
  image_url = 'https://images.pexels.com/photos/3823555/pexels-photo-3823555.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Camera": "4K UHD", "Gimbal": "3-axis", "Flight Time": "30 min", "Range": "4km", "GPS": "Return-to-home", "Weight": "249g"}'::jsonb
WHERE id = '0d2403fa-4574-43ea-84c9-552d916e2949';

-- 9. Smart Watch Apex ($59)
UPDATE products SET
  name = 'Smart Watch Apex',
  tagline = 'Fitness tracking + notifications on your wrist',
  description = 'Full-color smartwatch with heart rate, SpO2, sleep tracking, and 100+ sport modes. Receive calls, texts, and app notifications. 10-day battery life. IP68 water resistant. Compatible with iOS and Android.',
  price = 59,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Display": "1.8 inch AMOLED", "Battery": "10 days", "Water Resistance": "IP68", "Sensors": "HR, SpO2, Sleep", "Sport Modes": "100+", "Compatibility": "iOS & Android"}'::jsonb
WHERE id = '41a6872a-8b6e-4b15-b4ea-4e45bec94d25';

-- 10. Wireless Earbuds ($35)
UPDATE products SET
  name = 'Wireless Earbuds',
  tagline = 'Bluetooth 5.3 earbuds with charging case',
  description = 'Premium wireless earbuds with Bluetooth 5.3, active noise cancellation, and 30-hour total battery life with charging case. Touch controls, IPX5 sweat resistance, and low-latency mode for gaming.',
  price = 35,
  category = 'Audio',
  image_url = 'https://images.pexels.com/photos/33797659/pexels-photo-33797659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Bluetooth": "5.3", "Battery": "6h + 24h case", "ANC": "Active Noise Cancellation", "Water Resistance": "IPX5", "Drivers": "10mm", "Charging": "USB-C + Wireless"}'::jsonb
WHERE id = '4732321d-2a2e-4d36-b56c-1bc5b8c332c6';

-- Delete the remaining fake products (AstroBot, cars, HoloDeck, etc.)
DELETE FROM products WHERE id IN (
  '9bce57ed-b2dc-4464-8223-5cdb033a4fc6',
  '7214ec9f-0c68-474d-89e6-4744478349a2',
  'aadd12a0-5128-4b7e-b8af-9036c5372908',
  '6f2f67d0-9691-46eb-baad-3ce04208e631',
  '924f73ee-2f17-4365-a685-423a9fc8736a',
  'd17a52d4-c8ef-4d9f-b6f9-218ca34bb234',
  '18e9acbd-617c-4363-9665-4f75f68b3e4d',
  'f32f3609-402a-47a0-8610-9697e3f3cb1e',
  '78dfd5dd-015c-4730-89b2-b15680174f64',
  '855df133-3e71-4187-ac01-815f87e67426',
  '57a9876a-e1e6-4311-99ef-16944219b8f9',
  'b56e6dd5-4767-43cb-96de-76296ed39d69',
  '90f2e528-fcc0-4c10-97be-fe4a68f2a80c',
  '6f88f298-f2bf-42bf-8303-ba0fbc8d437e',
  'c0cb164a-ce11-4b6a-854c-dff5f97023ee',
  '12810d5f-9e23-4e01-abfb-bf8778d06bc3',
  '6c34ac4e-175e-41a1-a5b9-f1e3b34f742c'
);
