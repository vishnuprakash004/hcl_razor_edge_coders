// package com.foodiehub.config;

// import com.foodiehub.entity.Category;
// import com.foodiehub.entity.User;
// import com.foodiehub.repository.CategoryRepository;
// import com.foodiehub.repository.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// public class DatabaseSeeder {

//     @Bean
//     public CommandLineRunner initDatabase(UserRepository userRepository, CategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
//         return args -> {
//             // Seed Categories
//             if (categoryRepository.count() == 0) {
//                 categoryRepository.save(new Category("Pizza"));
//                 categoryRepository.save(new Category("Cool Drinks"));
//                 categoryRepository.save(new Category("Breads"));
//                 categoryRepository.save(new Category("Combo"));
//                 System.out.println(">>> Default Categories Created!");
//             }

//             // Seed Admin User
//             if (userRepository.findByEmail("admin@foodiehub.com").isEmpty()) {
//                 User admin = new User();
//                 admin.setName("System Admin");
//                 admin.setEmail("admin@foodiehub.com");
//                 admin.setPassword(passwordEncoder.encode("admin123"));
//                 admin.setRole(User.Role.ADMIN);
//                 admin.setLoyaltyPoints(999);
//                 userRepository.save(admin);
//                 System.out.println(">>> Default Admin Created: admin@foodiehub.com / admin123");
//             } else {
//                 System.out.println(">>> Admin user already exists. Skipping seeding.");
//             }
//         };
//     }
// }
