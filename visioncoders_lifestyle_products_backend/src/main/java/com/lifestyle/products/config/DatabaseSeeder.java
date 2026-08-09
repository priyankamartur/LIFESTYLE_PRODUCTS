package com.lifestyle.products.config;

import com.lifestyle.products.entity.*;
import com.lifestyle.products.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BannerRepository bannerRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_USER).build()));
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build()));

        // 1.1 Seed Initial Default Admin Account
        if (!userRepository.existsByUsername("Admin@1") && !userRepository.existsByEmail("lavanya100yadav@gmail.com")) {
            User defaultAdmin = User.builder()
                    .firstName("Lavanya")
                    .username("Admin@1")
                    .email("lavanya100yadav@gmail.com")
                    .password(passwordEncoder.encode("Lavanya@admin"))
                    .roles(java.util.Collections.singleton(adminRole))
                    .enabled(true)
                    .build();
            userRepository.save(defaultAdmin);
        }

        if (!userRepository.existsByUsername("admin") && !userRepository.existsByEmail("admin@lifestyle.com")) {
            User standardAdmin = User.builder()
                    .firstName("Admin")
                    .username("admin")
                    .email("admin@lifestyle.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .roles(java.util.Collections.singleton(adminRole))
                    .enabled(true)
                    .build();
            userRepository.save(standardAdmin);
        }

        // 1.2 Migrate existing users to CUSTOMER (ROLE_USER) by default if they have no role
        userRepository.findAll().forEach(user -> {
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                user.setRoles(java.util.Collections.singleton(userRole));
                userRepository.save(user);
            }
        });

        // 2. Seed Categories (Enforce all 6 Categories: Skincare, Beauty & Makeup, Fashion Accessories, Home Decor, Kitchen Essentials, Bedding & Bath)
        if (categoryRepository.count() == 0) {
            Category skincare = Category.builder()
                    .name("Skincare")
                    .description("Premium organic serums, under-eye creams, and sunscreens.")
                    .imageUrl("https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80")
                    .build();
            Category beauty = Category.builder()
                    .name("Beauty & Makeup")
                    .description("High-coverage foundations, waterproof mascaras, and natural blushes.")
                    .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80")
                    .build();
            Category accessories = Category.builder()
                    .name("Fashion Accessories")
                    .description("Classic wristwatches, leather handbags, and UV sunglasses.")
                    .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80")
                    .build();
            Category homeDecor = Category.builder()
                    .name("Home Decor")
                    .description("Minimalist table lamps, scented candles, and dream catchers.")
                    .imageUrl("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80")
                    .build();
            Category kitchen = Category.builder()
                    .name("Kitchen Essentials")
                    .description("Dinner sets, ceramic coffee mugs, and smart air fryers.")
                    .imageUrl("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80")
                    .build();
            Category beddingBath = Category.builder()
                    .name("Bedding & Bath")
                    .description("Comfortable cotton sheets, pillows, and premium bath robes.")
                    .imageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80")
                    .build();

            categoryRepository.saveAll(Arrays.asList(skincare, beauty, accessories, homeDecor, kitchen, beddingBath));

            // 3. Seed Banners
            if (bannerRepository.count() == 0) {
                Banner banner1 = Banner.builder()
                        .title("Premium Skincare Collection - Up to 40% Off!")
                        .imageUrl("https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&auto=format&fit=crop&q=80")
                        .linkUrl("/catalog?categoryId=1")
                        .displayOrder(1)
                        .build();
                Banner banner2 = Banner.builder()
                        .title("Luxury Bedding & Bath Collection")
                        .imageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&auto=format&fit=crop&q=80")
                        .linkUrl("/catalog?categoryId=6")
                        .displayOrder(2)
                        .build();

                bannerRepository.saveAll(Arrays.asList(banner1, banner2));
            }

            // 4. Seed Products
            if (productRepository.count() == 0) {
                // Category 1: Skincare
                Product p1 = Product.builder().name("Vitamin C Serum").description("Powerful antioxidant serum that brightens skin, reduces dark spots, and improves skin texture.").price(new BigDecimal("599.00")).imageUrl("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80").featured(true).category(skincare).build();
                Product p2 = Product.builder().name("Under Eye Cream").description("Nourishing under-eye cream that targets dark circles and reduces puffiness.").price(new BigDecimal("499.00")).imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80").featured(false).category(skincare).build();
                Product p3 = Product.builder().name("Sunscreen SPF 50").description("Broad-spectrum SPF 50 sunscreen shielding skin from harmful UV rays.").price(new BigDecimal("399.00")).imageUrl("https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80").featured(false).category(skincare).build();
                Product p4 = Product.builder().name("Olay Night Cream").description("Rich anti-aging night cream that deeply nourishes and rejuvenates skin overnight.").price(new BigDecimal("699.00")).imageUrl("https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80").featured(true).category(skincare).build();

                // Category 2: Beauty & Makeup
                Product p5 = Product.builder().name("Foundation").description("Lightweight liquid foundation that provides buildable full coverage.").price(new BigDecimal("549.00")).imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80").featured(true).category(beauty).build();
                Product p6 = Product.builder().name("Lipstick").description("Creamy, highly pigmented matte lipstick with long-lasting finish.").price(new BigDecimal("299.00")).imageUrl("https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80").featured(false).category(beauty).build();
                Product p7 = Product.builder().name("Mascara").description("Waterproof smudge-free mascara adding volume and length to lashes.").price(new BigDecimal("349.00")).imageUrl("https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop&q=80").featured(false).category(beauty).build();

                // Category 3: Fashion Accessories
                Product p8 = Product.builder().name("Wrist Watches").description("Premium analog wrist watch featuring a classic design and quartz movement.").price(new BigDecimal("1999.00")).imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80").featured(true).category(accessories).build();
                Product p9 = Product.builder().name("Handbag").description("Elegant designer handbag crafted from premium vegan leather.").price(new BigDecimal("1299.00")).imageUrl("https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80").featured(true).category(accessories).build();
                Product p10 = Product.builder().name("Sunglasses").description("Classic UV400 protected sunglasses with lightweight durable frame.").price(new BigDecimal("999.00")).imageUrl("https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80").featured(true).category(accessories).build();

                // Category 4: Home Decor
                Product p11 = Product.builder().name("Table Lamp").description("Stylish bedside table lamp with fabric shade providing warm ambient light.").price(new BigDecimal("1499.00")).imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80").featured(true).category(homeDecor).build();
                Product p12 = Product.builder().name("Scented Candle").description("Hand-poured aromatic soy wax scented candle with soothing lavender scent.").price(new BigDecimal("299.00")).imageUrl("https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80").featured(true).category(homeDecor).build();
                Product p13 = Product.builder().name("Decorative Vase").description("Handcrafted ceramic vase that adds artistic charm to mantels and tables.").price(new BigDecimal("699.00")).imageUrl("https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80").featured(false).category(homeDecor).build();

                // Category 5: Kitchen Essentials
                Product p14 = Product.builder().name("Dinner Set").description("Premium 24-piece ceramic dinnerware set, chip-resistant and microwave-safe.").price(new BigDecimal("1499.00")).imageUrl("https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80").featured(true).category(kitchen).build();
                Product p15 = Product.builder().name("Ceramic Mug").description("Durable large ceramic coffee mug with ergonomic handle and rustic finish.").price(new BigDecimal("299.00")).imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80").featured(false).category(kitchen).build();
                Product p16 = Product.builder().name("Air Fryer").description("Digital air fryer using rapid air circulation for healthy low-oil frying.").price(new BigDecimal("3999.00")).imageUrl("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80").featured(true).category(kitchen).build();

                // Category 6: Bedding & Bath
                Product p17 = Product.builder().name("Bed Sheet Set").description("Luxuriously soft and breathable 400 thread count cotton bed sheet set.").price(new BigDecimal("999.00")).imageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80").featured(true).category(beddingBath).build();
                Product p18 = Product.builder().name("Pillow").description("Ergonomic memory foam pillow providing optimal neck support.").price(new BigDecimal("499.00")).imageUrl("https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80").featured(false).category(beddingBath).build();
                Product p19 = Product.builder().name("Bath Robe").description("Plush unisex bathrobe made from 100% absorbent cotton terry cloth.").price(new BigDecimal("999.00")).imageUrl("https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80").featured(true).category(beddingBath).build();

                productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19));
            }
        }
    }
}
