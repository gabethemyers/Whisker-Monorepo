package com.example.Project3Backend.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Project3Backend.Entities.AppUser;
import com.example.Project3Backend.Repositories.AppUserRepository;
import java.util.Optional;
import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository userRepo;
    
    @Value("${jwt.secret:default-secret-key-change-this-in-production}")
    private String jwtSecret;

    public AppUserService(AppUserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Transactional
    public AppUser findOrCreateUserFromOAuth(String provider, String providerId, String email, String username) {
        if (provider == null || provider.trim().isEmpty()) {
            throw new IllegalArgumentException("Provider cannot be empty");
        }
        if (providerId == null || providerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Provider ID cannot be empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        // First, try to find user by provider and providerId
        Optional<AppUser> existingUser = userRepo.findByProviderAndProviderId(provider.trim(), providerId.trim());
        if (existingUser.isPresent()) {
            AppUser user = existingUser.get();
            // Update email and username if they've changed
            if (!user.getEmail().equals(email.trim())) {
                user.setEmail(email.trim());
            }
            if (!user.getUsername().equals(username.trim())) {
                // Check if new username is available
                Optional<AppUser> usernameTaken = userRepo.findByUsernameIgnoreCase(username.trim());
                if (usernameTaken.isEmpty() || usernameTaken.get().getId().equals(user.getId())) {
                    user.setUsername(username.trim());
                }
            }
            return userRepo.save(user);
        }

        // If not found by provider+providerId, try to find by email to link account
        Optional<AppUser> existingEmail = userRepo.findByEmail(email.trim());
        if (existingEmail.isPresent()) {
            AppUser user = existingEmail.get();
            // Link this OAuth provider to existing account
            user.setProvider(provider.trim());
            user.setProviderId(providerId.trim());
            // Update username if available
            Optional<AppUser> usernameTaken = userRepo.findByUsernameIgnoreCase(username.trim());
            if (usernameTaken.isEmpty() || usernameTaken.get().getId().equals(user.getId())) {
                user.setUsername(username.trim());
            }
            return userRepo.save(user);
        }

        // Create new user
        Optional<AppUser> existingUsername = userRepo.findByUsernameIgnoreCase(username.trim());
        if (existingUsername.isPresent()) {
            // If username is taken, append a number
            int suffix = 1;
            String baseUsername = username.trim();
            while (userRepo.findByUsernameIgnoreCase(baseUsername + suffix).isPresent()) {
                suffix++;
            }
            username = baseUsername + suffix;
        }

        AppUser newUser = new AppUser();
        newUser.setProvider(provider.trim());
        newUser.setProviderId(providerId.trim());
        newUser.setEmail(email.trim());
        newUser.setUsername(username.trim());
        // Password remains null for OAuth users

        return userRepo.save(newUser);
    }

    @Transactional
    public AppUser updateUsername(Long userId, String newUsername) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (newUsername == null || newUsername.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        Optional<AppUser> user = userRepo.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        // Check if the new username is already taken by another user
        Optional<AppUser> existingUser = userRepo.findByUsernameIgnoreCase(newUsername.trim());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
            throw new IllegalArgumentException("Username already exists");
        }

        AppUser foundUser = user.get();
        foundUser.setUsername(newUsername.trim());

        return userRepo.save(foundUser);
    }

    public List<AppUser> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<AppUser> findById(Long userId) {
        return userRepo.findById(userId);
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
        
        Object userId = claims.get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }
        throw new IllegalArgumentException("Invalid userId in token");
    }
}