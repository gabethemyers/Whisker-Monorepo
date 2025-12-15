package com.example.Project3Backend.Services;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate;

    public ImageService() {
        this.restTemplate = new RestTemplate();
    }

    public String uploadImage(MultipartFile file) throws IOException {
        // 1. Resize and Compress
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(file.getInputStream())
                .size(1080, 1080)
                .outputFormat("jpg")
                .outputQuality(0.7)
                .toOutputStream(outputStream);

        byte[] compressedImage = outputStream.toByteArray();
        String fileName = UUID.randomUUID().toString() + ".jpg";

        // 2. Upload to Supabase
        String uploadUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, fileName);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);
        headers.setContentType(MediaType.IMAGE_JPEG);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(compressedImage, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // Return public URL
            return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, fileName);
        } else {
            throw new IOException("Failed to upload image to Supabase: " + response.getStatusCode());
        }
    }
}
