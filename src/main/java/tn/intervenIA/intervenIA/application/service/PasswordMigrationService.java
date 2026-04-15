package tn.intervenIA.intervenIA.application.service;
/**
 * ===================================================================
 * PASSWORD RESET SERVICE - ONE-TIME MIGRATION UTILITY
 * ===================================================================
 *
 * PURPOSE:
 * This service was created to resolve password authentication issues that occurred
 * due to inconsistent password hashing in the application's early development.
 *
 * PROBLEM:
 * - Previous password storage used a mix of hashing methods
 * - Some passwords were stored as invalid/malformed BCrypt hashes
 * - This caused "Encoded password does not look like BCrypt" errors during login
 * - 728 users were unable to authenticate properly
 *
 * SOLUTION:
 * This one-time migration resets ALL user passwords to a known default value ("1234")
 * using a properly configured BCryptPasswordEncoder, ensuring consistent and valid
 * password hashing across the entire user database.
 *
 * IMPORTANT NOTES:
 * 1. THIS IS A ONE-TIME MIGRATION - Do NOT run this on every application startup
 * 2. After migration, ALL users must use "1234" as their initial password
 * 3. Users should be prompted to change their password on first login
 * 4. This class should be disabled/removed after successful migration
 *
 * EXECUTION HISTORY:
 * - Date: December 16, 2025
 * - Users affected: 728
 * - Default password set: "1234"
 * - Hashing algorithm: BCrypt with default strength (10)
 *
 * NEXT STEPS:
 * 1. Test login with multiple users to confirm authentication works
 * 2. Notify users about the temporary password "1234"
 * 3. Implement mandatory password change on first login
 * 4. Comment out @Component annotation or remove this class from production
 * 5. Consider implementing password history and expiration policies
 *
 * TO DISABLE:
 * Option 1: Comment out @Component annotation below
 * Option 2: Remove this class entirely after confirmation
 * Option 3: Add @Profile("!prod") to only run in non-production environments
 *
 * WARNING:
 * Keeping this class active will reset all passwords to "1234" on every startup!
 * ===================================================================
 */
// TODO: CONSIDER REMOVING THIS CLASS ENTIRELY FOR PRODUCTION DEPLOYMENT

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.intervenIA.intervenIA.domain.model.user.User;
import tn.intervenIA.intervenIA.domain.repository.UserRepository;

import java.util.List;

//@Component
@RequiredArgsConstructor
public class PasswordMigrationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        resetAllPasswords();
    }

    private void resetAllPasswords() {
        List<User> allUsers = userRepository.findAll();

        if (allUsers.isEmpty()) {
            System.out.println("No users found in database.");
            return;
        }

        System.out.println("\n==========================================");
        System.out.println("RESETTING passwords for " + allUsers.size() + " users to '1234'...");
        System.out.println("==========================================");

        int reset = 0;
        int failed = 0;

        for (User user : allUsers) {
            try {
                System.out.println("Resetting password for: " + user.getEmail());

                // Generate a fresh, valid BCrypt hash
                String newHash = passwordEncoder.encode("1234");
                user.setPassword(newHash);
                userRepository.save(user);
                reset++;

            } catch (Exception e) {
                failed++;
                System.out.println("Error resetting " + user.getEmail() + ": " + e.getMessage());
            }
        }

        System.out.println("\n==========================================");
        System.out.println("Reset Summary:");
        System.out.println("Total users: " + allUsers.size());
        System.out.println("Successfully reset: " + reset);
        System.out.println("Failed: " + failed);
        System.out.println("==========================================");
        System.out.println("\nIMPORTANT: All users can now login with:");
        System.out.println("Email: their original email");
        System.out.println("Password: 1234");
        System.out.println("==========================================\n");
    }
}