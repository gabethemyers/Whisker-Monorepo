package com.example.Project3Backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.example.Project3Backend.Entities.AppUser;
import com.example.Project3Backend.Services.AppUserService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService userService;

    public AppUserController(AppUserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @AuthenticationPrincipal OAuth2User oauth2User,
            HttpSession session,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        Long userId = null;
        
        // Try to get user ID from JWT token in Authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                // Parse JWT and extract userId
                userId = userService.getUserIdFromToken(token);
            } catch (Exception e) {
                // Token validation failed, fall through
            }
        }
        
        // Fall back to session
        if (userId == null) {
            userId = (Long) session.getAttribute("userId");
        }
        
        if (userId != null) {
            Optional<AppUser> userOpt = userService.findById(userId);
            if (userOpt.isPresent()) {
                AppUser user = userOpt.get();
                return ResponseEntity.ok(Map.of(
                        "userId", user.getId(),
                        "username", user.getUsername() != null ? user.getUsername() : "",
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "provider", user.getProvider() != null ? user.getProvider() : ""));
            }
        }

        // If no user found, return 401
        return ResponseEntity.status(401)
                .body(Map.of("error", "Not authenticated"));
    }

    @PutMapping("/{userId}/username")
    public ResponseEntity<Map<String, Object>> updateUsername(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        try {
            String newUsername = request.get("username");

            AppUser updatedUser = userService.updateUsername(userId, newUsername);

            return ResponseEntity.ok(Map.of(
                    "message", "Username updated successfully",
                    "userId", updatedUser.getId(),
                    "username", updatedUser.getUsername()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppUser>> getAllUsers() {
        List<AppUser> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}