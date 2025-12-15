package com.example.Project3Backend.Controllers;

import com.example.Project3Backend.Entities.Cat;
import com.example.Project3Backend.Services.CatService;
import com.example.Project3Backend.Services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/cats")
public class CatController {

    @Autowired
    private CatService catService;

    @Autowired
    private ImageService imageService;

    @GetMapping
    public ResponseEntity<List<Cat>> getAllCats() {
        List<Cat> cats = catService.getAllCats();
        return ResponseEntity.ok(cats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable Long id) {
        Cat cat = catService.getCatById(id);
        return ResponseEntity.ok(cat);
    }

    @PostMapping
    public ResponseEntity<Cat> createCat(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "birthdate", required = false) String birthdate) {
        try {
            Cat cat = new Cat();
            cat.setName(name);
            cat.setUserId(userId);
            cat.setBio(bio);
            cat.setCreatedAt(java.time.OffsetDateTime.now());
            
            if (birthdate != null && !birthdate.isEmpty()) {
                cat.setBirthdate(java.time.LocalDate.parse(birthdate));
            }
            
            if (file != null && !file.isEmpty()) {
                String avatarUrl = imageService.uploadImage(file);
                cat.setAvatarUrl(avatarUrl);
            }
            
            Cat createdCat = catService.createCat(cat);
            return new ResponseEntity<>(createdCat, HttpStatus.CREATED);
        } catch (java.io.IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cat>> getCatsByUserId(@PathVariable Long userId) {
        List<Cat> cats = catService.getCatsByUserId(userId);
        return ResponseEntity.ok(cats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable Long id, @RequestBody Cat catDetails) {
        Cat updatedCat = catService.updateCat(id, catDetails);
        return ResponseEntity.ok(updatedCat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable Long id) {
        catService.deleteCat(id);
        return ResponseEntity.noContent().build();
    }
}
