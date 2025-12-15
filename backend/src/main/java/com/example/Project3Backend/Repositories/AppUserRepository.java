package com.example.Project3Backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.Project3Backend.Entities.AppUser;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByUsernameIgnoreCase(String username);
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByProviderAndProviderId(String provider, String providerId);
}