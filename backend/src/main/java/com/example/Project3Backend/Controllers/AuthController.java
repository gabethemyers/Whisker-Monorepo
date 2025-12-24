package com.example.Project3Backend.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Authentication", description = "Endpoints for OAuth2 authentication")
public class AuthController {

    @GetMapping("/oauth2/authorization/google")
    @Operation(summary = "Login with Google", description = "Initiates the Google OAuth2 login flow.<br/>" +
            "**NOTE:** The 'Try it out' button will fail with a Network Error due to CORS protection on the Google redirect.<br/>"
            +
            "Please click this link to login: <a href='/oauth2/authorization/google'>Login with Google</a>")
    public void loginWithGoogle() {
        // This method is just for Swagger documentation.
        // The request is intercepted by Spring Security's OAuth2 filter chain.
        throw new IllegalStateException("This method should not be called directly.");
    }

    @GetMapping("/oauth2/authorization/github")
    @Operation(summary = "Login with GitHub", description = "Initiates the GitHub OAuth2 login flow.<br/>" +
            "**NOTE:** The 'Try it out' button will fail with a Network Error due to CORS protection on the GitHub redirect.<br/>"
            +
            "Please click this link to login: <a href='/oauth2/authorization/github'>Login with GitHub</a>")
    public void loginWithGithub() {
        // This method is just for Swagger documentation.
        // The request is intercepted by Spring Security's OAuth2 filter chain.
        throw new IllegalStateException("This method should not be called directly.");
    }
}
