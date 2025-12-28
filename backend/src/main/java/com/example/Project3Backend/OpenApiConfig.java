package com.example.Project3Backend;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        String testToken = "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imdvb2dsZSIsInVzZXJJZCI6LTEsImVtYWlsIjoidGVzdEB3aGlza2VyLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NjY2NDU0MjYsImV4cCI6NDkyMDI0NTQyNn0.ZiHGLCHFhI0MWVKXVXuZR8nATXwV4DvfuE_pYTSOmAA";
        return new OpenAPI()
                .info(new Info()
                        .title("Whisker Backend API")
                        .version("1.0")
                        .description("### Quick Test Mode\n" +
                         "Use the token below to bypass OAuth Login for testing or login with GitHub or Google below:\n\n" +
                         "**Test Token:** `" + testToken + "`\n\n" +
                         "1. Copy the token.\n" +
                         "2. Click **Authorize** (bottom right).\n" +
                         "3. Paste and click **Authorize**."))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
