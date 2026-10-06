package com.portfolio.cms;

import com.portfolio.cms.model.User;
import com.portfolio.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Entry point for the Portfolio CMS backend.
 * On first boot, seeds a single admin user if none exists yet,
 * so the admin panel is usable immediately in dev.
 */
@SpringBootApplication
public class CmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CmsApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.seed-email}") String seedEmail,
            @Value("${app.admin.seed-password}") String seedPassword
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setEmail(seedEmail);
                admin.setPasswordHash(passwordEncoder.encode(seedPassword));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Seeded admin user: " + seedEmail);
            }
        };
    }
}
