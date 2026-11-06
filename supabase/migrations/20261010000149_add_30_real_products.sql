-- Update existing products to match new catalog

-- 1. Smart Ring Health Tracker ($59)
UPDATE products SET
  name = 'Smart Ring Health Tracker',
  tagline = '24/7 health tracking in a sleek titanium ring',
  description = 'Track your sleep, heart rate, blood oxygen, steps, and recovery — all from a lightweight titanium smart ring. 7-day battery life, wireless charging, and a companion app with AI health insights. Water resistant to 100m.',
  price = 59,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/35147278/pexels-photo-35147278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Material": "Titanium", "Battery": "7 days", "Sensors": "HR, SpO2, Temp", "Water Resistance": "100m", "Charging": "Wireless", "App": "iOS & Android"}'::jsonb
WHERE id = '7a3ddebe-546c-43c6-84c8-e5bd2b0f9350';

-- 2. Portable 4K Mini Projector ($129)
UPDATE products SET
  name = 'Portable 4K Mini Projector',
  tagline = 'Cinema-quality projection anywhere you go',
  description = 'Pocket-sized 4K projector with built-in speakers, Wi-Fi screen mirroring, and 6000 lumens brightness. Project up to 200 inches on any wall. Perfect for movies, presentations, and gaming. Connects via HDMI, USB, or wireless.',
  price = 129,
  category = 'Mobile & Desk',
  image_url = 'https://images.pexels.com/photos/5515482/pexels-photo-5515482.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = false,
  in_stock = true,
  specs = '{"Resolution": "4K UHD", "Brightness": "6000 lumens", "Screen Size": "Up to 200 inch", "Connectivity": "HDMI, USB, Wi-Fi", "Speakers": "Built-in 5W", "Weight": "420g"}'::jsonb
WHERE id = '2ada257d-12b1-4831-8880-9f364cef3f66';

-- 3. MagSafe 20,000mAh Power Bank 22.5W ($35)
UPDATE products SET
  name = 'MagSafe 20,000mAh Power Bank 22.5W',
  tagline = 'Magnetic wireless charging for your phone',
  description = 'Snap-on MagSafe power bank with 20,000mAh capacity. Charges your phone wirelessly at 15W, plus two USB-C ports for wired charging at 22.5W. LED battery indicator. Charges most phones 4-5 times on a single charge.',
  price = 35,
  category = 'Mobile & Desk',
  image_url = 'https://images.pexels.com/photos/4072683/pexels-photo-4072683.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Capacity": "20,000mAh", "Output": "15W wireless, 22.5W USB-C", "Ports": "2x USB-C, 1x USB-A", "Charging": "MagSafe + Wired", "Weight": "280g", "Indicator": "LED"}'::jsonb
WHERE id = '3cb57157-b929-487c-9912-c16458d8892a';

-- 4. Drone Mini 4K with Follow Me ($119)
UPDATE products SET
  name = 'Drone Mini 4K with Follow Me',
  tagline = '4K camera drone with 30-min flight time',
  description = 'Compact foldable drone with 4K camera, 3-axis gimbal stabilization, and 30-minute flight time. GPS return-to-home, follow-me mode, and real-time video transmission to your phone. Range up to 4km. Under 250g — no registration required.',
  price = 119,
  category = 'Gaming & VR',
  image_url = 'https://images.pexels.com/photos/29222704/pexels-photo-29222704.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Camera": "4K UHD", "Gimbal": "3-axis", "Flight Time": "30 min", "Range": "4km", "GPS": "Return-to-home", "Weight": "249g", "Mode": "Follow Me"}'::jsonb
WHERE id = '0d2403fa-4574-43ea-84c9-552d916e2949';

-- 5. Smart Watch Ultra 49mm ($69)
UPDATE products SET
  name = 'Smart Watch Ultra 49mm',
  tagline = 'Premium fitness tracking + notifications on your wrist',
  description = 'Full-color 49mm smartwatch with heart rate, SpO2, sleep tracking, and 100+ sport modes. Receive calls, texts, and app notifications. 10-day battery life. IP68 water resistant. Compatible with iOS and Android.',
  price = 69,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Display": "1.9 inch AMOLED", "Battery": "10 days", "Water Resistance": "IP68", "Sensors": "HR, SpO2, Sleep", "Sport Modes": "100+", "Compatibility": "iOS & Android"}'::jsonb
WHERE id = '41a6872a-8b6e-4b15-b4ea-4e45bec94d25';

-- 6. AI Translator Earbuds - 144 Languages ($79)
UPDATE products SET
  name = 'AI Translator Earbuds - 144 Languages',
  tagline = 'Real-time translation in 144 languages',
  description = 'Wireless earbuds with built-in AI real-time translation. Speak and understand 144 languages instantly. Also works as premium Bluetooth earbuds with active noise cancellation and 30-hour battery life with charging case.',
  price = 79,
  category = 'Audio',
  image_url = 'https://images.pexels.com/photos/7989066/pexels-photo-7989066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Languages": "144", "Translation": "Real-time AI", "Battery": "8h + 22h case", "ANC": "Active Noise Cancellation", "Bluetooth": "5.3", "Drivers": "10mm"}'::jsonb
WHERE id = '1c3dc891-d7c3-4353-b8bf-3494d2b42256';

-- 7. Smart Glasses with Camera & Audio ($99)
UPDATE products SET
  name = 'Smart Glasses with Camera & Audio',
  tagline = 'Capture photos and videos from your glasses',
  description = 'Stylish smart glasses with a built-in 12MP camera. Capture photos and videos hands-free, listen to music with open-ear speakers, and take calls discreetly. Polarized lenses with UV400 protection. 6-hour battery life.',
  price = 99,
  category = 'Wearables',
  image_url = 'https://images.pexels.com/photos/20201999/pexels-photo-20201999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Camera": "12MP", "Video": "1080p", "Storage": "32GB", "Speakers": "Open-ear", "Lenses": "Polarized UV400", "Battery": "6 hours"}'::jsonb
WHERE id = '5453d6b3-c212-4876-8ee2-d46d427d55fa';

-- 8. VR Headset Pro 3 ($89)
UPDATE products SET
  name = 'VR Headset Pro 3',
  tagline = 'Immersive virtual reality headset',
  description = 'Standalone VR headset with 4K per-eye display, 120Hz refresh rate, and built-in spatial audio. No phone or PC required. Access 1000+ games and experiences. 3-hour battery life with fast charging.',
  price = 89,
  category = 'Gaming & VR',
  image_url = 'https://images.pexels.com/photos/5207559/pexels-photo-5207559.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Display": "4K per eye", "Refresh Rate": "120Hz", "Audio": "Spatial built-in", "Battery": "3 hours", "Connectivity": "Wi-Fi 6, USB-C", "Controllers": "2 included"}'::jsonb
WHERE id = 'ae357a0e-e394-4571-bb9b-d68342c7e3ae';

-- 9. Transparent Magnetic Keyboard + Mouse ($45)
UPDATE products SET
  name = 'Transparent Magnetic Keyboard + Mouse',
  tagline = 'Sleek see-through keyboard and mouse set',
  description = 'Ultra-slim transparent acrylic Bluetooth keyboard and mouse combo. Connects to phones, tablets, and laptops. Full-size layout with quiet magnetic switches. 6-month battery on a single charge. Works with iOS, Android, Windows, and Mac.',
  price = 45,
  category = 'Mobile & Desk',
  image_url = 'https://images.pexels.com/photos/34030132/pexels-photo-34030132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = true,
  in_stock = true,
  specs = '{"Layout": "Full QWERTY", "Connection": "Bluetooth 5.1", "Battery": "6 months", "Compatibility": "iOS, Android, Win, Mac", "Material": "Acrylic + Aluminum", "Weight": "420g"}'::jsonb
WHERE id = 'b013ca26-ab0a-4baf-84fb-073d20845656';

-- 10. Replace old "Wireless Earbuds" with Open-Ear Bone Conduction Headphones ($49)
UPDATE products SET
  name = 'Open-Ear Bone Conduction Headphones',
  tagline = 'Hear your surroundings while listening to music',
  description = 'Bone conduction technology sends sound through your cheekbones, leaving your ears open to hear your surroundings. Perfect for running, cycling, and outdoor activities. IP67 waterproof. 8-hour battery life. Lightweight titanium frame.',
  price = 49,
  category = 'Audio',
  image_url = 'https://images.pexels.com/photos/210927/pexels-photo-210927.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  featured = false,
  in_stock = true,
  specs = '{"Technology": "Bone Conduction", "Battery": "8 hours", "Water Resistance": "IP67", "Bluetooth": "5.3", "Frame": "Titanium", "Weight": "30g"}'::jsonb
WHERE id = '4732321d-2a2e-4d36-b56c-1bc5b8c332c6';

-- Insert 20 new products
INSERT INTO products (name, tagline, description, price, category, image_url, featured, in_stock, specs) VALUES

-- WEARABLES
('AI Posture Corrector Brace', 'Smart vibration feedback for better posture', 'Wearable smart posture corrector that gently vibrates when you slouch. Tracks your posture throughout the day via a companion app. 15-day battery per charge. Adjustable strap fits all body types. Comfortable enough for all-day wear.', 45, 'Wearables', 'https://images.pexels.com/photos/5793649/pexels-photo-5793649.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Smart Brace", "Feedback": "Vibration", "Battery": "15 days", "App": "iOS & Android", "Adjustable": "Universal fit", "Weight": "85g"}'::jsonb),

('Heated Smart Vest Jacket', 'App-controlled heated vest with 6 zones', 'Smart heated vest with 6 heating zones controlled via app or button. 3 heat levels up to 55°C. 8-hour battery life with USB-C charging. Machine washable (remove battery). Lightweight and windproof.', 89, 'Wearables', 'https://images.pexels.com/photos/374593/pexels-photo-374593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Heating Zones": "6", "Heat Levels": "3 (up to 55°C)", "Battery": "8 hours", "Charging": "USB-C", "Washable": "Yes (remove battery)", "Material": "Windproof nylon"}'::jsonb),

-- AUDIO
('Mini Portable Bluetooth Speaker - RGB', 'Punchy bass with RGB light show', 'Compact Bluetooth speaker with 360° sound, deep bass, and customizable RGB lighting. IPX7 waterproof. 12-hour battery life. Pair two speakers for stereo sound. Bluetooth 5.3 with 30m range.', 29, 'Audio', 'https://images.pexels.com/photos/33797083/pexels-photo-33797083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Output": "10W", "Battery": "12 hours", "Waterproof": "IPX7", "Bluetooth": "5.3", "Range": "30m", "RGB": "Customizable"}'::jsonb),

('Wireless Lavalier Mic - 2 Pack', 'Professional clip-on mics for content creators', 'Plug-and-play wireless lavalier microphone set. 2 receivers + 2 mics for dual-person recording. Crystal clear audio with noise reduction. 65ft wireless range. 6-hour battery life. Works with phones, cameras, and laptops.', 35, 'Audio', 'https://images.pexels.com/photos/39934690/pexels-photo-39934690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Wireless Lavalier", "Quantity": "2 mics + 2 receivers", "Range": "65ft (20m)", "Battery": "6 hours", "Noise Reduction": "Active", "Compatibility": "Phone, Camera, Laptop"}'::jsonb),

('Sleep Headband Headphones', 'Comfortable Bluetooth headband for sleeping', 'Soft fabric headband with built-in Bluetooth headphones designed for side sleepers. Ultra-thin speakers won''t press against your ears. 10-hour battery life. Washable fabric. Perfect for music, podcasts, or white noise while sleeping.', 32, 'Audio', 'https://images.pexels.com/photos/6541181/pexels-photo-6541181.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Headband", "Battery": "10 hours", "Bluetooth": "5.2", "Speakers": "Ultra-thin", "Washable": "Yes (remove speakers)", "Material": "Breathable fabric"}'::jsonb),

-- MOBILE / DESK
('3-in-1 MagSafe Charging Station', 'Charge phone, watch, and earbuds at once', 'Sleek 3-in-1 wireless charging station for phone, smartwatch, and earbuds. MagSafe-compatible with 15W fast charging for phones, 5W for watch and earbuds. LED indicator. Non-slip base. One USB-C cable powers everything.', 39, 'Mobile & Desk', 'https://images.pexels.com/photos/37556438/pexels-photo-37556438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Output": "15W phone, 5W watch/earbuds", "Devices": "3 simultaneously", "Charging": "MagSafe wireless", "Input": "USB-C PD", "LED": "Status indicator", "Base": "Non-slip"}'::jsonb),

('Holographic Phone Stand with Speaker', '3D holographic visual + built-in speaker', 'Phone stand with a holographic reflector that creates a 3D floating image from your phone screen. Built-in Bluetooth speaker for immersive audio. Adjustable angle. Works with hologram apps. Great for desk decor and entertainment.', 28, 'Mobile & Desk', 'https://images.pexels.com/photos/13548073/pexels-photo-13548073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Holographic Stand", "Speaker": "Bluetooth built-in", "Angle": "Adjustable", "Compatibility": "All phones", "Material": "Acrylic + ABS", "Bluetooth": "5.0"}'::jsonb),

-- GAMING / VR / DRONE
('PS5 / Mobile Cooling Fan + Controller', 'Keep your device cool during intense gaming', 'Clip-on cooling fan with built-in phone controller. Rapid cooling prevents overheating during long gaming sessions. Adjustable phone clip fits devices up to 7 inches. Ergonomic grip with trigger buttons. Plug and play — no app needed.', 25, 'Gaming & VR', 'https://images.pexels.com/photos/5303957/pexels-photo-5303957.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Cooling Fan + Controller", "Cooling": "Semiconductor + Fan", "Compatibility": "Phones up to 7 inch", "Triggers": "2 shoulder buttons", "Connection": "Plug and play", "Power": "USB-C"}'::jsonb),

('AR Gaming Gun Controller', 'Augmented reality blaster for mobile gaming', 'AR gaming gun controller for mobile FPS games. Connects via Bluetooth. Built-in gyroscope and recoil feedback. Compatible with popular AR and shooting games. Works with phones 4.7-6.5 inches. Realistic trigger and reload action.', 55, 'Gaming & VR', 'https://images.pexels.com/photos/19228376/pexels-photo-19228376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "AR Gun Controller", "Connection": "Bluetooth 5.0", "Features": "Gyroscope + Recoil", "Phone Size": "4.7-6.5 inches", "Triggers": "2 + Reload", "Battery": "40 hours"}'::jsonb),

('LED Gaming Backpack - Anti-Theft', 'Illuminated backpack with USB charging port', 'Futuristic LED backpack with customizable light patterns controlled via app. Anti-theft hidden zippers and cut-resistant material. Built-in USB charging port. Water-resistant. Fits laptops up to 15.6 inches. 20L capacity.', 49, 'Gaming & VR', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"LED": "App-controlled", "Anti-Theft": "Hidden zippers", "USB Port": "Built-in", "Laptop": "Up to 15.6 inch", "Capacity": "20L", "Water Resistant": "Yes"}'::jsonb),

-- SMART HOME / AI
('Smart WiFi Camera Bulb 360°', 'Security camera hidden in a light bulb', '360° panoramic security camera disguised as a standard E27 light bulb. 1080p HD video with night vision. Motion detection alerts to your phone. Two-way audio. No wiring — just screw into any E27 socket. Supports up to 128GB microSD.', 32, 'Smart Home', 'https://images.pexels.com/photos/22610381/pexels-photo-22610381.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Resolution": "1080p HD", "View": "360° panoramic", "Night Vision": "Yes", "Motion Detection": "App alerts", "Audio": "Two-way", "Storage": "Up to 128GB microSD", "Socket": "E27"}'::jsonb),

('AI Robot Vacuum Mini', 'Smart mapping robot vacuum with app control', 'Compact robot vacuum with LiDAR smart mapping, obstacle avoidance, and app control. 2500Pa suction power. 120-minute battery life with auto-recharge. Works on hard floors and carpets. Schedule cleanings and set no-go zones via app.', 149, 'Smart Home', 'https://images.pexels.com/photos/35147280/pexels-photo-35147280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, '{"Suction": "2500Pa", "Battery": "120 minutes", "Navigation": "LiDAR mapping", "Obstacle Avoidance": "Yes", "App Control": "iOS & Android", "Auto-Recharge": "Yes"}'::jsonb),

('Smart LED Strip Lights - App Control', '16 million colors, music sync, voice control', '5m LED strip with 16 million colors and music sync mode. Control via app or voice (Alexa, Google Assistant). Cuttable and flexible for any setup. Strong adhesive backing. 24V safe low voltage. Perfect for room, desk, or gaming setup.', 27, 'Smart Home', 'https://images.pexels.com/photos/34195903/pexels-photo-34195903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Length": "5 meters", "Colors": "16 million", "Music Sync": "Yes", "Voice Control": "Alexa & Google", "Voltage": "24V safe", "Adhesive": "3M backing"}'::jsonb),

('Portable Air Purifier Necklace', 'Wearable air purifier with negative ions', 'Personal wearable air purifier that creates a negative ion shield around you. Removes dust, pollen, smoke, and odors. USB-C rechargeable with 30-hour battery. No filters to replace. Silent operation. Weighs only 40g.', 39, 'Smart Home', 'https://images.pexels.com/photos/39969404/pexels-photo-39969404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Wearable Ion Purifier", "Battery": "30 hours", "Charging": "USB-C", "Filter": "None (ion technology)", "Weight": "40g", "Coverage": "Personal space"}'::jsonb),

('Smart Door Lock - Fingerprint', 'Keyless entry with biometric security', 'Smart door lock with fingerprint, PIN code, RFID card, app, and key access. Stores up to 100 fingerprints. Anti-peep virtual PIN. Weatherproof IP65. Battery lasts 12 months. Real-time unlock alerts to your phone.', 99, 'Smart Home', 'https://images.pexels.com/photos/6689288/pexels-photo-6689288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Unlock Methods": "Fingerprint, PIN, RFID, App, Key", "Fingerprints": "Up to 100", "Weatherproof": "IP65", "Battery": "12 months", "Alerts": "Real-time app", "Material": "Zinc alloy"}'::jsonb),

-- VIRAL FUTURISTIC
('Star Projector Galaxy Light', 'Transform your room into a galaxy', 'Galaxy star projector with 10 color modes, nebula effects, and remote control. Adjustable brightness and speed. Built-in white noise sounds. Timer function. USB-C powered. Perfect for bedrooms, gaming rooms, and parties.', 33, 'Viral Futuristic', 'https://images.pexels.com/photos/7296624/pexels-photo-7296624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, '{"Colors": "10 modes", "Effects": "Nebula + Stars", "Remote": "Yes", "Sounds": "Built-in white noise", "Timer": "Auto-off", "Power": "USB-C"}'::jsonb),

('Levitating Bluetooth Speaker', 'Floating speaker with 360° sound', 'Magnetic levitating Bluetooth speaker that floats above its base. 360° surround sound with deep bass. Wireless charging through the base. LED ambient lighting. 8-hour battery on a single charge. Bluetooth 5.3.', 69, 'Viral Futuristic', 'https://images.pexels.com/photos/8014168/pexels-photo-8014168.png?auto=compress&cs=tinysrgb&h=650&w=940', true, true, '{"Levitation": "Magnetic", "Sound": "360° surround", "Battery": "8 hours", "Charging": "Wireless via base", "LED": "Ambient lighting", "Bluetooth": "5.3"}'::jsonb),

('Electric Lighter Watch', 'Wearable electric arc lighter on your wrist', 'Futuristic wristwatch with built-in electric arc lighter. USB rechargeable — no gas or butane needed. Windproof plasma arc. Also functions as a digital watch with LED display. Adjustable strap. 300+ lights per charge.', 29, 'Viral Futuristic', 'https://images.pexels.com/photos/39853428/pexels-photo-39853428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Type": "Lighter + Watch", "Ignition": "Plasma arc", "Windproof": "Yes", "Charging": "USB", "Lights Per Charge": "300+", "Display": "LED digital"}'::jsonb),

('Heated Coffee Mug Smart', 'App-controlled temperature coffee mug', 'Smart heated mug that maintains your preferred drinking temperature (50-65°C) for up to 4 hours. Control via app or touch base. Auto-sleep when empty. 350ml capacity. USB-C charging coaster included.', 38, 'Viral Futuristic', 'https://images.pexels.com/photos/704744/pexels-photo-704744.png?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Capacity": "350ml", "Temperature": "50-65°C", "Battery": "4 hours", "Control": "App + Touch", "Charging": "USB-C coaster", "Auto-Sleep": "When empty"}'::jsonb),

('Futuristic Cyber Truck Power Bank', 'Cybertruck-inspired power bank with LED display', 'Futuristic stainless-steel power bank with cyber truck design. 10,000mAh capacity with 22.5W fast charging. LED battery percentage display. USB-C and USB-A ports. Supports pass-through charging. Drop-resistant metal body.', 42, 'Viral Futuristic', 'https://images.pexels.com/photos/29356607/pexels-photo-29356607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, '{"Capacity": "10,000mAh", "Output": "22.5W fast charge", "Ports": "USB-C + USB-A", "Display": "LED percentage", "Material": "Stainless steel", "Pass-Through": "Yes"}'::jsonb);
