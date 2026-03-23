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

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder) {
        return args -> {
            UserEntity adminUser = null;
            if (!userRepository.existsByUsername("admin")) {
                UserEntity admin = new UserEntity();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123"));
                admin.setEmail("admin@demo.com");
                admin.setFullName("Platform Admin");
                admin.setRole(Role.ROLE_ADMIN);
                adminUser = userRepository.save(admin);
            }
            if (adminUser == null) {
                adminUser = userRepository.findByUsername("admin").orElse(null);
            }

            if (!userRepository.existsByUsername("user")) {
                UserEntity user = new UserEntity();
                user.setUsername("user");
                user.setPassword(encoder.encode("user123"));
                user.setEmail("user@demo.com");
                user.setFullName("Demo User");
                user.setRole(Role.ROLE_USER);
                userRepository.save(user);
            }

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

                productRepository.saveAll(List.of(p1, p2, p3));
            }
        };
    }
}
