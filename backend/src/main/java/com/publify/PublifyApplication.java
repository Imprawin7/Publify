package com.publify;

import com.publify.model.User;
import com.publify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PublifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PublifyApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.seed-email}") String seedEmail,
            @Value("${app.admin.seed-password}") String seedPassword
    ) {
        return args -> {
            String email = seedEmail.trim().toLowerCase();

            if (userRepository.findByEmail(email).isEmpty()) {
                User admin = new User();
                admin.setEmail(email);
                admin.setPasswordHash(passwordEncoder.encode(seedPassword));
                admin.setRole("ADMIN");
                admin.setEnabled(true);

                userRepository.save(admin);

                System.out.println("Seeded admin user: " + email);
            }
        };
    }
}
