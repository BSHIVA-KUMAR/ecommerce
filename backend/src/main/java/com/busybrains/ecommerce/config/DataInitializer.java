package com.ecommerce.config;

import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.UserEntity;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    /**
     * Ensures demo accounts always match the documented passwords (fixes DB rows that were
     * created with older seeded passwords before strong-password rules).
     */
    private static UserEntity upsertDemoUser(
            UserRepository userRepository,
            PasswordEncoder encoder,
            String username,
            String email,
            String fullName,
            Role role,
            String rawPassword) {
        UserEntity u = userRepository.findByUsername(username).orElseGet(UserEntity::new);
        u.setUsername(username);
        u.setEmail(email);
        u.setFullName(fullName);
        u.setRole(role);
        u.setPassword(encoder.encode(rawPassword));
        return userRepository.save(u);
    }

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder) {
        return args -> {
            UserEntity adminUser =
                    upsertDemoUser(
                            userRepository,
                            encoder,
                            "admin",
                            "admin@gmail.com",
                            "Platform Admin",
                            Role.ROLE_ADMIN,
                            "Admin@123");
            upsertDemoUser(
                    userRepository,
                    encoder,
                    "user",
                    "user@gmail.com",
                    "Demo User",
                    Role.ROLE_USER,
                    "User@12345");
            upsertDemoUser(
                    userRepository,
                    encoder,
                    "admin2",
                    "admin2@gmail.com",
                    "Second Admin",
                    Role.ROLE_ADMIN,
                    "Admin2@demo");
            if (productRepository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Noise Cancelling Headphones");
                p1.setDescription("Premium wireless headphones with deep bass");
                p1.setPrice(12999.0);
                if (adminUser != null) {
                    p1.setCreatedByUserId(adminUser.getId());
                    p1.setCreatedByUsername(adminUser.getUsername());
                }

                Product p2 = new Product();
                p2.setName("Gaming Keyboard");
                p2.setDescription("RGB mechanical keyboard with blue switches");
                p2.setPrice(3499.0);
                if (adminUser != null) {
                    p2.setCreatedByUserId(adminUser.getId());
                    p2.setCreatedByUsername(adminUser.getUsername());
                }

                Product p3 = new Product();
                p3.setName("Smart Watch");
                p3.setDescription("Fitness tracker with heart-rate and sleep monitoring");
                p3.setPrice(5499.0);
                if (adminUser != null) {
                    p3.setCreatedByUserId(adminUser.getId());
                    p3.setCreatedByUsername(adminUser.getUsername());
                }

                Product p4 = new Product();
                p4.setName("Bluetooth Speaker");
                p4.setDescription("Portable speaker with 12-hour battery life");
                p4.setPrice(2199.0);
                if (adminUser != null) {
                    p4.setCreatedByUserId(adminUser.getId());
                    p4.setCreatedByUsername(adminUser.getUsername());
                }

                Product p5 = new Product();
                p5.setName("4K Monitor");
                p5.setDescription("27-inch UHD monitor with HDR support");
                p5.setPrice(18999.0);
                if (adminUser != null) {
                    p5.setCreatedByUserId(adminUser.getId());
                    p5.setCreatedByUsername(adminUser.getUsername());
                }

                Product p6 = new Product();
                p6.setName("Wireless Mouse");
                p6.setDescription("Ergonomic mouse with silent clicks");
                p6.setPrice(1299.0);
                if (adminUser != null) {
                    p6.setCreatedByUserId(adminUser.getId());
                    p6.setCreatedByUsername(adminUser.getUsername());
                }

                Product p7 = new Product();
                p7.setName("USB-C Hub");
                p7.setDescription("7-in-1 hub with HDMI and card reader");
                p7.setPrice(2499.0);
                if (adminUser != null) {
                    p7.setCreatedByUserId(adminUser.getId());
                    p7.setCreatedByUsername(adminUser.getUsername());
                }

                Product p8 = new Product();
                p8.setName("External SSD 1TB");
                p8.setDescription("High-speed portable SSD with USB 3.2");
                p8.setPrice(7999.0);
                if (adminUser != null) {
                    p8.setCreatedByUserId(adminUser.getId());
                    p8.setCreatedByUsername(adminUser.getUsername());
                }

                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8));
            }
        };
    }
}
