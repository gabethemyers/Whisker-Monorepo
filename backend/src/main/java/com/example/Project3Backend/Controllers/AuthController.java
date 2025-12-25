package com.example.Project3Backend.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Authentication", description = "Endpoints for OAuth2 authentication")
public class AuthController {

    @GetMapping("/oauth2/authorization/google")
    @Operation(
    summary = "Get JWT via Google Login", 
    description = "### Authentication Workflow\n" +
                  "Because of browser security (CORS), the **'Try it out'** button below will not work for this endpoint. " +
                  "Follow these steps to authenticate:\n\n" +
                  "1. **Click the Login Link:** [Login with Google](/oauth2/authorization/google) *(Opens in a new tab)*\n" +
                  "2. **Authorize:** Sign in with your Google account.\n" +
                  "3. **Capture Token:** You will be redirected to a page displaying your **JWT Token**. Copy the entire string.\n" +
                  "4. **Apply to Docs:** Scroll back to the top of this page, click the green **Authorize** button, and paste your token.\n\n" +
                  "**Note:** Once authorized, all other API endpoints will use this token automatically."
    )
    public void loginWithGoogle() {
        // This method is just for Swagger documentation.
        // The request is intercepted by Spring Security's OAuth2 filter chain.
        throw new IllegalStateException("This method should not be called directly.");
    }

    @GetMapping("/oauth2/authorization/github")
    @Operation(
    summary = "Get JWT via Github Login", 
    description = "### Authentication Workflow\n" +
                  "Because of browser security (CORS), the **'Try it out'** button below will not work for this endpoint. " +
                  "Follow these steps to authenticate:\n\n" +
                  "1. **Click the Login Link:** [Login with Github](/oauth2/authorization/github) *(Opens in a new tab)*\n" +
                  "2. **Authorize:** Sign in with your Github account.\n" +
                  "3. **Capture Token:** You will be redirected to a page displaying your **JWT Token**. Copy the entire string.\n" +
                  "4. **Apply to Docs:** Scroll back to the top of this page, click the green **Authorize** button, and paste your token.\n\n" +
                  "**Note:** Once authorized, all other API endpoints will use this token automatically."
    )
    public void loginWithGithub() {
        // This method is just for Swagger documentation.
        // The request is intercepted by Spring Security's OAuth2 filter chain.
        throw new IllegalStateException("This method should not be called directly.");
    }
}
