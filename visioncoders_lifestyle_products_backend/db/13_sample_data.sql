-- Step 13: Sample Data Seeding (Updated with Lifestyle Products Catalog)
-- This script seeds the database with categories, products, and ImageKit image URLs.

USE lifestyle_products;

-- Temporarily disable foreign key constraints to allow clean truncation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clear Dependent Transactional Data
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM carts;

-- 2. Clear Catalog and Banner Data
DELETE FROM products;
DELETE FROM categories;
DELETE FROM banners;

-- Reset Auto-Increment Values
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE carts AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE banners AUTO_INCREMENT = 1;

-- 3. Seed Roles (Safely Ignore if already present)
INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN');

-- 4. Seed Users (Safely Ignore if already present)
-- Default password: password123 ($2a$10$7Z2v7v9eK7vQo2x7v5uS2.X2g/2g2uGgK9k2t8x7v5uS2.X2g/2g2)
INSERT IGNORE INTO users (id, username, email, password, first_name, last_name, phone_number, enabled, created_at, updated_at) VALUES
(1, 'admin', 'admin@lifestyle.com', '$2a$10$7Z2v7v9eK7vQo2x7v5uS2.X2g/2g2uGgK9k2t8x7v5uS2.X2g/2g2', 'System', 'Administrator', '+15550100', 1, NOW(6), NOW(6)),
(2, 'alice_green', 'alice.green@example.com', '$2a$10$7Z2v7v9eK7vQo2x7v5uS2.X2g/2g2uGgK9k2t8x7v5uS2.X2g/2g2', 'Alice', 'Green', '+15550101', 1, NOW(6), NOW(6)),
(3, 'bob_smith', 'bob.smith@example.com', '$2a$10$7Z2v7v9eK7vQo2x7v5uS2.X2g/2g2uGgK9k2t8x7v5uS2.X2g/2g2', 'Bob', 'Smith', '+15550102', 1, NOW(6), NOW(6)),
(4, 'charlie_brown', 'charlie.brown@example.com', '$2a$10$7Z2v7v9eK7vQo2x7v5uS2.X2g/2g2uGgK9k2t8x7v5uS2.X2g/2g2', 'Charlie', 'Brown', '+15550103', 0, NOW(6), NOW(6));

-- Seed User Roles (Safely Ignore if already present)
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1, 2), -- admin gets ROLE_ADMIN
(2, 1), -- alice_green gets ROLE_USER
(3, 1), -- bob_smith gets ROLE_USER
(4, 1); -- charlie_brown gets ROLE_USER

-- 5. Seed Categories (Enforce Category IDs 1 to 6)
INSERT INTO categories (id, name, description, image_url, created_at, updated_at) VALUES
(1, 'Skincare', 'Premium organic serums, under-eye creams, and sunscreens.', 'https://ik.imagekit.io/StringstackSahana/Vitamin%20C%20Serum%20Bottle.jpg', NOW(6), NOW(6)),
(2, 'Beauty & Makeup', 'High-coverage foundations, waterproof mascaras, and natural blushes.', 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Foundation.jpg?updatedAt=1785162230793', NOW(6), NOW(6)),
(3, 'Fashion Accessories', 'Classic wristwatches, leather handbags, and UV sunglasses.', 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Handbag.jpg?updatedAt=1785413446124', NOW(6), NOW(6)),
(4, 'Home Decor', 'Minimalist table lamps, scented candles, and dream catchers.', 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Table%20Lamp.jpg?updatedAt=1785415599824', NOW(6), NOW(6)),
(5, 'Kitchen Essentials', 'Dinner sets, ceramic coffee mugs, and smart air fryers.', 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Dinner%20Set.jpg?updatedAt=1785415638424', NOW(6), NOW(6)),
(6, 'Bedding & Bath', 'Comfortable cotton sheets, pillows, and premium bath robes.', 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bed%20Sheet%20Set.jpg?updatedAt=1785413517505', NOW(6), NOW(6));

-- 6. Seed Products (Mapping IDs 1 to 92 to their ImageKit image URLs)
INSERT INTO products (id, name, description, price, image_url, featured, category_id, created_at, updated_at) VALUES
-- Category 1: Skincare (1-15)
(1, 'Vitamin C Serum', 'Powerful antioxidant serum that brightens skin, reduces dark spots, and improves skin texture for a radiant glow.', 599.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQMKzvXM54vs-ea2fNESGZwlJvvRTcBdwFU0qsIAQkhryowN9yojaVQoAU3Iy-vxKQiQux_q74YuPhk3FI-Jf-QZNctGvYa75Csv9791N_rvTQZN3e7zGIq&usqp=CAc', 1, 1, NOW(6), NOW(6)),
(2, 'Under Eye Cream', 'Nourishing under-eye cream that targets dark circles, reduces puffiness, and smooths fine lines.', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLTyLWsodW5RlK1DckZF_-xj3r4xJWmQN58br-gxGsLQ&s=10', 0, 1, NOW(6), NOW(6)),
(3, 'Sunscreen SPF 50', 'Broad-spectrum SPF 50 sunscreen that shields skin from harmful UV rays while keeping it hydrated and non-greasy.', 399.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqBLrDdEHoGpGhUddxpr9CGvYhIeByZtAgmNpTteKkRw&s=10', 0, 1, NOW(6), NOW(6)),
(4, 'Olay Night Cream', 'Rich anti-aging night cream that deeply nourishes, restores elasticity, and rejuvenates skin overnight.', 699.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdEf1eMsV-8Zy9PSKLf_9OpMAkhBEmZhjgc_QVebm4mQ&s', 0, 1, NOW(6), NOW(6)),
(5, 'Micellar Water', 'Gentle micellar water that effortlessly removes makeup, dirt, and impurities without stripping natural moisture.', 299.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jGDI6JO_xTdonPBUFLG2ornX5A3A4I5cYikULf3vhA&s=10', 0, 1, NOW(6), NOW(6)),
(6, 'Makeup Remover Wipes', 'Soft, pre-moistened face wipes that quickly dissolve waterproof makeup and refresh the skin on the go.', 249.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5dYUnoQdDv-cUMD56Vaz4vFUtx-HqbLNcY7tfBvZ-g&s', 0, 1, NOW(6), NOW(6)),
(7, 'Lip Balm', 'Ultra-hydrating lip balm infused with natural oils to keep lips soft, supple, and moisturized all day.', 149.00, 'https://ik.imagekit.io/StringstackSahana/Lip%20Balm.jpg', 0, 1, NOW(6), NOW(6)),
(8, 'Facewash', 'Gentle foaming facewash that deeply cleanses, removes excess oil, and leaves skin feeling fresh and balanced.', 349.00, 'https://ik.imagekit.io/StringstackSahana/Facewash.jpg', 1, 1, NOW(6), NOW(6)),
(9, 'Facial Scrub', 'Exfoliating facial scrub with fine particles that gently remove dead skin cells and reveal a smoother complexion.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Facial%20Scrub.jpg', 0, 1, NOW(6), NOW(6)),
(10, 'Face Toner', 'Alcohol-free face toner that refines pores, balances pH levels, and preps skin for optimal hydration.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Face%20Toner.jpg', 0, 1, NOW(6), NOW(6)),
(11, 'Face Mask', 'Soothing clay face mask that extracts deep-seated impurities, unclogs pores, and revitalizes tired skin.', 249.00, 'https://ik.imagekit.io/StringstackSahana/Face%20Mask.jpg', 0, 1, NOW(6), NOW(6)),
(12, 'Brightening Cream', 'Advanced skin brightening cream designed to even out skin tone, reduce hyperpigmentation, and restore natural glow.', 499.00, 'https://ik.imagekit.io/StringstackSahana/Brightening%20Cream.jpg', 0, 1, NOW(6), NOW(6)),
(13, 'Anti-Acne Gel Combo', 'Fast-acting anti-acne spot treatment gel that visibly reduces blemishes, redness, and prevents future breakouts.', 549.00, 'https://ik.imagekit.io/StringstackSahana/Anti-Acne%20Gel%20Combo.jpg', 0, 1, NOW(6), NOW(6)),
(14, 'Aloe Vera Gel', '100% pure organic aloe vera gel that instantly soothes sunburns, hydrates dry skin, and cools irritation.', 199.00, 'https://ik.imagekit.io/StringstackSahana/Aloe%20Vera%20Gel.jpg', 0, 1, NOW(6), NOW(6)),
(15, 'Cleansing Balm', 'Luxurious melting cleansing balm that breaks down stubborn makeup, dirt, and pollution into a soft milky emulsion.', 449.00, 'https://ik.imagekit.io/StringstackSahana/Cleansing%20Balm.jpg', 0, 1, NOW(6), NOW(6)),
 
-- Category 2: Beauty & Makeup (16-30)
(16, 'Nail Polish', 'Vibrant, long-lasting nail polish available in multiple chip-resistant shades with a high-shine glossy finish.', 199.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU59uvGoNGH5kH5XraCiTTmwcMkS7QdvtE65iJCTbq-g&s=10', 0, 2, NOW(6), NOW(6)),
(17, 'Mascara', 'Waterproof, smudge-free mascara that adds dramatic volume, length, and lift to your lashes.', 349.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8y9T66KitoUfDt2KG6DGXJDSkZ6cFV04lSJCrGDbfSA&s=10', 0, 2, NOW(6), NOW(6)),
(18, 'Makeup Setting Spray', 'Ultra-fine weightless mist that locks in your makeup all day with a fresh, dewy, or matte finish.', 399.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUnBcqQAhqNX-gfeBYQWWqYAEkHw79kASmq3__LLH0Jw&s', 0, 2, NOW(6), NOW(6)),
(19, 'Makeup Brush Set', 'Professional-grade 12-piece makeup brush set with ultra-soft synthetic bristles for flawless application.', 599.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrFii-qLWG3WIIuFENzluAEIaZDamDurnV7Seut5unjQ&s=10', 1, 2, NOW(6), NOW(6)),
(20, 'Lipstick', 'Creamy, highly pigmented matte lipstick that glides on smoothly and stays comfortable for hours.', 299.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vtTZtdYGMa1RX3f2cze7dP7cvXwqzDY0-ERZszfn9w&s=10', 0, 2, NOW(6), NOW(6)),
(21, 'Lip Liner', 'Precision lip liner pencil to define, shape, and prevent lipstick feathering for a perfect pout.', 199.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3j-tPzBvpYfcQ26VY8lfreXhoc95aZRj8j7g7zE2T9Q&s=10', 0, 2, NOW(6), NOW(6)),
(22, 'Highlighter', 'Finely milled shimmering powder highlighter that adds a luminous, buildable glow to the high points of your face.', 399.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Highlighter.jpg?updatedAt=1785162213265', 0, 2, NOW(6), NOW(6)),
(23, 'Blush', 'Silky, blendable powder blush that delivers a natural flush of healthy color to your cheeks.', 349.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Blush.jpg', 0, 2, NOW(6), NOW(6)),
(24, 'Foundation', 'Lightweight liquid foundation that provides buildable full coverage with a seamless, natural skin-like finish.', 549.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Foundation.jpg?updatedAt=1785162230793', 1, 2, NOW(6), NOW(6)),
(25, 'Eyeliner', 'Highly pigmented, smudge-proof liquid eyeliner that delivers precise wing definitions with a matte black finish.', 249.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Eyeliner.jpg?updatedAt=1785162249791', 0, 2, NOW(6), NOW(6)),
(26, 'Contour Palette', 'Curated contour and highlight palette designed to sculpt, define, and enhance your facial features.', 699.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Contour%20Palette.jpg?updatedAt=1785162267693', 0, 2, NOW(6), NOW(6)),
(27, 'Concealer', 'High-coverage liquid concealer that effortlessly hides blemishes, dark circles, and imperfections all day.', 449.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Concealer.jpg?updatedAt=1785162282519', 0, 2, NOW(6), NOW(6)),
(28, 'Compact Powder', 'Finely pressed compact powder that sets makeup, controls shine, and provides a smooth velvet finish.', 299.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Compact%20Powder.jpg?updatedAt=1785162334957', 0, 2, NOW(6), NOW(6)),
(29, 'Blender', 'Teardrop-shaped makeup sponge blender that ensures seamless, streak-free blending of all liquid and cream products.', 149.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/Blender.jpg?updatedAt=1785162335133', 0, 2, NOW(6), NOW(6)),
(30, 'BB Cream', 'Lightweight multi-tasking BB cream that hydrates, protects with SPF, and provides a natural tint of coverage.', 399.00, 'https://ik.imagekit.io/StringstackSahana/beauty%20and%20makeup/BB%20Cream.jpg?updatedAt=1785162335523', 0, 2, NOW(6), NOW(6)),
 
-- Category 3: Fashion Accessories (31-48)
(31, 'Umbrella', 'Stylish and windproof compact umbrella that provides premium protection from both heavy rain and harsh sun.', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxV1sdU33moEU3ksz6fMNPczIUgyFkQfbwkMGPDfHog&s=10', 0, 3, NOW(6), NOW(6)),
(32, 'Bracelet', 'Elegant, hand-crafted silver chain bracelet designed to add a delicate touch of luxury to everyday wear.', 299.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx5_-1TcWwHq07TYggFAxN8JWzx2ToLktekk7Vc8X9RQ&s', 0, 3, NOW(6), NOW(6)),
(33, 'Scarf', 'Luxuriously soft and lightweight scarf woven from premium breathable fabric, perfect for styling in any season.', 399.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRVyK0H0XAF87nFVUH4sfKimsP7x2p64YDixct4-8GHA&s', 0, 3, NOW(6), NOW(6)),
(34, 'Hair Clip Set', 'A chic collection of decorative, strong-hold hair clips designed to complement various hairstyles and outfits.', 199.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcMiLYqDODJ8Ew2lK3yFRkk04ve7Cl_tr0Rw3tgMFOUA&s=10', 0, 3, NOW(6), NOW(6)),
(35, 'Keychain', 'Durable, stylish leather keychain featuring a heavy-duty ring clasp for secure and fashionable key organization.', 149.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECDx5df1vAfti9pWE8MDXe0hlYy8xUqxkghr2EpFyXw&s=10', 0, 3, NOW(6), NOW(6)),
(36, 'Belt', 'Classic genuine leather belt with a polished metal buckle, adjustable for a comfortable and refined fit.', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEwEtJuCxaqkLGoZ_twQKjUrpGhi5-r4KbIVs-UrFrjA&s=10', 0, 3, NOW(6), NOW(6)),
(37, 'Sling Bag', 'Compact and fashionable cross-body sling bag with multiple secure compartments for all your daily essentials.', 899.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1I5VL69h_Xo9UYY0WeibkxWdfyxCDEnWIhSq7m9Fcg&s=10', 0, 3, NOW(6), NOW(6)),
(38, 'Handbag', 'Elegant, spacious designer handbag crafted from premium vegan leather, ideal for work, travel, or shopping.', 1299.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3tY3XP4D3LQg5wHpwu0-NgGNhJJTaLu9teoGdf3Xvg&s', 1, 3, NOW(6), NOW(6)),
(39, 'Cap', 'Breathable, lightweight cotton sports cap with an adjustable strap, offering both sun protection and casual style.', 299.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEdk1_dOGQkZ2Wfv5pK2TotHWbib1Yl4UNokLZBVHwtA&s', 0, 3, NOW(6), NOW(6)),
(40, 'Hair Band', 'Comfortable, non-slip elastic hair band designed to securely keep hair in place during workouts or daily routines.', 149.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Hair%20Band.jpg?updatedAt=1785413446118', 0, 3, NOW(6), NOW(6)),
(41, 'Tote Bag', 'Eco-friendly, highly durable canvas tote bag featuring a spacious interior and comfortable shoulder straps.', 499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Tote%20Bag.jpeg?updatedAt=1785413446221', 0, 3, NOW(6), NOW(6)),
(42, 'Rings', 'A beautiful set of stackable, minimalist rings made from tarnish-resistant metal for everyday elegance.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Rings.jpg?updatedAt=1785413446019', 0, 3, NOW(6), NOW(6)),
(43, 'Backpack', 'Ergonomic, spacious lifestyle backpack equipped with a padded laptop sleeve and multiple utility pockets.', 1499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Backpack.jpg?updatedAt=1785413446023', 0, 3, NOW(6), NOW(6)),
(44, 'Wrist Watches', 'Premium analog wrist watch featuring a classic design, quartz movement, and a durable water-resistant build.', 1999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Wrist%20Watches.jpg?updatedAt=1785413446036', 0, 3, NOW(6), NOW(6)),
(45, 'Anklet', 'Elegant silver anklet decorated with delicate charms, designed to add charm and grace to any outfit.', 249.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Anklet.jpg?updatedAt=1785413445999', 0, 3, NOW(6), NOW(6)),
(46, 'Earrings', 'Stunning, lightweight drop earrings designed to add sophistication and sparkle to casual or formal ensembles.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Earrings.jpg?updatedAt=1785413445956', 0, 3, NOW(6), NOW(6)),
(47, 'Wallet', 'Sleek, minimalist bifold leather wallet featuring multiple card slots and secure cash pockets.', 699.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Wallet.jpg?updatedAt=1785413445846', 0, 3, NOW(6), NOW(6)),
(48, 'Sunglasses', 'Premium UV400 protected classic sunglasses with a durable, lightweight frame for maximum outdoor style.', 999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Sunglasses.jpg?updatedAt=1785413445709', 1, 3, NOW(6), NOW(6)),
 
-- Category 4: Home Decor (49-63)
(49, 'Wall Clock', 'Elegant minimalist wall clock featuring a silent, sweep movement, perfect for contemporary homes.', 799.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa7P64LJP8SPVvGN3Hnwm_YKjhzRGObvsVQttaXVdA4Q&s=10', 0, 4, NOW(6), NOW(6)),
(50, 'Decorative Vase', 'Beautifully hand-crafted ceramic decorative vase that adds a touch of artistic charm to tables and mantels.', 699.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS49yKx4F_T2sIR0whN_XyrxxSbpwzh3EBWhlGB90tbA&s=10', 0, 4, NOW(6), NOW(6)),
(51, 'Artificial Plant', 'Lifelike artificial potted plant that adds fresh, hassle-free greenery to your office or home decor.', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmv_H6gYI9RhYrAXlYNAGZAEy765YUq1IEaPbtA3m1uQ&s=10', 0, 4, NOW(6), NOW(6)),
(52, 'Indoor Plant Pot', 'Modern, sturdy ceramic plant pot equipped with a drainage hole, ideal for keeping indoor houseplants healthy.', 599.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7xKb8lLzxR_YidglTNY1k0x_H4OKPt1vxZW48wZ1nQ&s', 0, 4, NOW(6), NOW(6)),
(53, 'Photo Frame', 'Premium quality wood photo frame designed to preserve and elegantly showcase your cherished memories.', 349.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Photo%20Frame.jpg?updatedAt=1785415599352', 0, 4, NOW(6), NOW(6)),
(54, 'Wall Mirror', 'Chic decorative wall mirror featuring a sleek metal frame, designed to brighten and visually expand any room.', 1299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Wall%20Mirror.jpg?updatedAt=1785415599800', 0, 4, NOW(6), NOW(6)),
(55, 'Scented Candle', 'Aromatic hand-poured soy wax scented candle that fills your space with a calming, long-lasting lavender fragrance.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Scented%20Candle.jpg?updatedAt=1785415599830', 1, 4, NOW(6), NOW(6)),
(56, 'Aroma Diffuser', 'Ultrasonic aroma oil diffuser and humidifier that creates a relaxing, mist-filled atmosphere in your home.', 999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Aroma%20Diffuser.jpg?updatedAt=1785415599446', 0, 4, NOW(6), NOW(6)),
(57, 'Table Lamp', 'Stylish bedside table lamp featuring a fabric shade, providing warm, diffused ambient light for bedrooms.', 1499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Table%20Lamp.jpg?updatedAt=1785415599824', 1, 4, NOW(6), NOW(6)),
(58, 'Floor Lamp', 'Modern tripod floor lamp that stands elegantly, casting bright, comfortable light over your reading corner.', 2499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Floor%20Lamp.jpg?updatedAt=1785415599447', 0, 4, NOW(6), NOW(6)),
(59, 'Cushion Cover', 'Set of soft cushion covers featuring detailed minimalist geometric patterns and hidden zipper closures.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Cushion%20Cover.jpg?updatedAt=1785415599845', 0, 4, NOW(6), NOW(6)),
(60, 'Throw Pillow', 'Plush, ultra-soft decorative throw pillow designed to provide comfortable back support and elevate sofa aesthetics.', 499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Throw%20Pillow.jpg?updatedAt=1785415599759', 0, 4, NOW(6), NOW(6)),
(61, 'Wall Art', 'Premium canvas printed wall art featuring beautiful abstract designs, stretched and ready to hang.', 899.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Wall%20Art.jpg?updatedAt=1785415599501', 0, 4, NOW(6), NOW(6)),
(62, 'Decorative Tray', 'Elegant serving and decorative tray crafted from premium wood, perfect for organizing coffee tables.', 599.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Decorative%20Tray.jpg?updatedAt=1785415599812', 0, 4, NOW(6), NOW(6)),
(63, 'Dream Catcher', 'Traditional handcrafted dream catcher decorated with soft feathers, designed to bring positive vibes and sweet dreams.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Home%20Decor/Dream%20Catcher.jpg?updatedAt=1785415600061', 0, 4, NOW(6), NOW(6)),
 
-- Category 5: Kitchen Essentials (64-77)
(64, 'Dinner Set', 'Premium 24-piece ceramic dinnerware set, chip-resistant and microwave-safe, perfect for elegant dining.', 1499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Dinner%20Set.jpg?updatedAt=1785415638424', 1, 5, NOW(6), NOW(6)),
(65, 'Ceramic Mug', 'Durable, large ceramic coffee mug featuring an ergonomic handle and a beautiful speckled glaze finish.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Ceramic%20Mug.jpg?updatedAt=1785415637953', 0, 5, NOW(6), NOW(6)),
(66, 'Water Bottle', 'Insulated stainless steel water bottle that keeps your beverages ice-cold for 24 hours or hot for 12 hours.', 499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Water%20Bottle.jpg?updatedAt=1785415638735', 0, 5, NOW(6), NOW(6)),
(67, 'Lunch Box', 'Leakproof, multi-compartment bento lunch box made from eco-friendly, food-grade BPA-free materials.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Lunch%20Box.jpg?updatedAt=1785415638581', 0, 5, NOW(6), NOW(6)),
(68, 'Storage Containers', 'Set of airtight glass food storage containers with locking lids, ideal for meal prep and pantry organization.', 699.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Storage%20Containers.jpg?updatedAt=1785415638814', 0, 5, NOW(6), NOW(6)),
(69, 'Non-Stick Frying Pan', 'Heavy-duty aluminum non-stick frying pan with an ergonomic heat-resistant handle for healthy, low-oil cooking.', 999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Non-Stick%20Frying%20Pan.jpg?updatedAt=1785415638742', 0, 5, NOW(6), NOW(6)),
(70, 'Cooking Pot', 'Premium stainless steel cooking pot with a tempered glass lid, featuring a thick tri-ply base for even heating.', 1299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Cooking%20Pot.jpg?updatedAt=1785415638308', 0, 5, NOW(6), NOW(6)),
(71, 'Knife Set', 'Professional 6-piece kitchen knife set forged from high-carbon stainless steel with a matching wooden block.', 899.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Knife%20Set.jpg?updatedAt=1785415638529', 0, 5, NOW(6), NOW(6)),
(72, 'Cutting Board', 'Large, durable bamboo cutting board with built-in juice grooves, gentle on knives and easy to clean.', 349.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Cutting%20Board.jpg?updatedAt=1785415638410', 0, 5, NOW(6), NOW(6)),
(73, 'Measuring Cups', 'Stainless steel measuring cups and spoons set with engraved markings, essential for precise baking.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Measuring%20Cups.jpg?updatedAt=1785415638761', 0, 5, NOW(6), NOW(6)),
(74, 'Wooden Spoon Set', 'Handcrafted non-stick wooden spoon and spatula set, perfect for cooking, stirring, and serving.', 449.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Wooden%20Spoon%20Set.jpg?updatedAt=1785415638809', 0, 5, NOW(6), NOW(6)),
(75, 'Electric Kettle', 'Fast-boiling 1.5L double-wall electric kettle with automatic shut-off and boil-dry protection.', 1499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Electric%20Kettle.jpg?updatedAt=1785415638593', 0, 5, NOW(6), NOW(6)),
(76, 'Mixer Grinder', 'Powerful 750W mixer grinder equipped with three durable stainless steel jars for dry, wet, and chutney grinding.', 2499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Mixer%20Grinder.jpg?updatedAt=1785415638731', 0, 5, NOW(6), NOW(6)),
(77, 'Air Fryer', 'Large 4.5L digital air fryer using rapid air circulation to fry your favorite foods with 85% less oil.', 3999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Kitchen%20Essentials/Air%20Fryer.jpg?updatedAt=1785415637814', 1, 5, NOW(6), NOW(6)),
 
-- Category 6: Bedding & Bath (78-92)
(78, 'Bed Sheet Set', 'Luxuriously soft and breathable 400 thread count cotton bed sheet set, including a flat sheet and pillowcases.', 999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bed%20Sheet%20Set.jpg?updatedAt=1785413517505', 1, 6, NOW(6), NOW(6)),
(79, 'Pillow', 'Ergonomic memory foam pillow designed to provide optimal neck support and ensure a restful night sleep.', 499.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Pillow.jpg?updatedAt=1785413518046', 0, 6, NOW(6), NOW(6)),
(80, 'Comforter Set', 'All-season down-alternative quilted comforter set, offering lightweight warmth and luxurious comfort.', 1999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Comforter%20set.jpg?updatedAt=1785413518011', 0, 6, NOW(6), NOW(6)),
(81, 'Blanket', 'Cozy, lightweight microfiber fleece blanket, exceptionally soft and perfect for layering on cold nights.', 899.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Blanket.jpg?updatedAt=1785413517579', 0, 6, NOW(6), NOW(6)),
(82, 'Mattress Protector', '100% waterproof, breathable mattress protector designed to shield against spills, dust mites, and allergens.', 799.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Mattress%20Protector.jpg?updatedAt=1785413517864', 0, 6, NOW(6), NOW(6)),
(83, 'Hand Towel', 'Set of premium long-staple cotton hand towels, exceptionally thick, soft, and highly absorbent.', 249.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Hand%20Towel.jpg?updatedAt=1785413518035', 0, 6, NOW(6), NOW(6)),
(84, 'Bath Mat', 'Ultra-plush, quick-dry memory foam bath mat featuring a non-slip backing for superior bathroom safety.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bath%20Mat.jpeg?updatedAt=1785413517460', 0, 6, NOW(6), NOW(6)),
(85, 'Shower Curtain', 'Water-repellent, heavy-duty fabric shower curtain featuring rust-resistant metal grommets.', 699.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Shower%20Curtain.jpg?updatedAt=1785413518005', 0, 6, NOW(6), NOW(6)),
(86, 'Laundry Basket', 'Spacious, collapsible laundry basket made from breathable fabric with durable aluminum handles.', 799.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Laundry%20Basket.jpg?updatedAt=1785413517861', 0, 6, NOW(6), NOW(6)),
(87, 'Bathroom Organizer', 'Multi-tier rust-proof metal bathroom organizer shelf, designed to maximize storage over sinks or counters.', 599.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bathroom%20Organizer.jpg?updatedAt=1785413517513', 0, 6, NOW(6), NOW(6)),
(88, 'Soap Dispenser', 'Elegant refillable glass liquid soap dispenser featuring a rust-proof stainless steel pump.', 349.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Soap%20Dispenser.jpg?updatedAt=1785413517986', 0, 6, NOW(6), NOW(6)),
(89, 'Toothbrush Holder', 'Compact, hygienic bathroom toothbrush holder with slots for multiple toothbrushes and toothpaste tubes.', 249.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Toothbrush%20Holder.jpg?updatedAt=1785413518080', 0, 6, NOW(6), NOW(6)),
(90, 'Tissue Box', 'Decorative wooden tissue box cover that fits standard tissue boxes, adding a clean look to countertops.', 299.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Tissue%20Box.jpg?updatedAt=1785413517985', 0, 6, NOW(6), NOW(6)),
(91, 'Bath Robe', 'Luxurious unisex plush bathrobe made from 100% absorbent cotton terry cloth with a cozy shawl collar.', 999.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bath%20Robe.jpg?updatedAt=1785413517587', 1, 6, NOW(6), NOW(6)),
(92, 'Bathroom Slippers', 'Lightweight, quick-drying non-slip EVA slippers designed to keep feet comfortable and safe in wet bathrooms.', 399.00, 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bathroom%20Slippers.jpg?updatedAt=1785413517705', 0, 6, NOW(6), NOW(6));

-- 7. Seed Banners
INSERT INTO banners (id, title, image_url, link_url, display_order, created_at, updated_at) VALUES
(1, 'Premium Skincare Collection', 'https://ik.imagekit.io/StringstackSahana/Vitamin%20C%20Serum%20Bottle.jpg', '/catalog?categoryId=1', 1, NOW(6), NOW(6)),
(2, 'Luxury Bedding & Bath Set', 'https://ik.imagekit.io/StringstackSahana/Fashion%20accesiories/Bedding%20&%20Bath/Bed%20Sheet%20Set.jpg?updatedAt=1785413517505', '/catalog?categoryId=6', 2, NOW(6), NOW(6));

-- Re-enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;
