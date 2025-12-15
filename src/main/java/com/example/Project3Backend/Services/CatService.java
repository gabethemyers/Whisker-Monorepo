package com.example.Project3Backend.Services;

import com.example.Project3Backend.Entities.Cat;
import com.example.Project3Backend.Repositories.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class CatService {

    @Autowired
    private CatRepository catRepository;

    public List<Cat> getAllCats() {
        return catRepository.findAll();
    }

    public List<Cat> getCatsByUserId(Long userId) {
        return catRepository.findByUserId(userId);
    }

    public Cat getCatById(Long id) {
        return catRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found"));
    }

    public Cat createCat(Cat cat) {
        return catRepository.save(cat);
    }

    public Cat updateCat(Long id, Cat catDetails) {
        Cat existingCat = getCatById(id);
        existingCat.setName(catDetails.getName());
        existingCat.setAvatarUrl(catDetails.getAvatarUrl());
        existingCat.setBio(catDetails.getBio());
        return catRepository.save(existingCat);
    }

    public void deleteCat(Long id) {
        Cat cat = getCatById(id);
        catRepository.delete(cat);
    }
}
