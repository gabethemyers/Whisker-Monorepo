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
        String testToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOi0xLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QHdoaXNrZXIuY29tIiwicHJvdmlkZXIiOiJnb29nbGUiLCJpYXQiOjE3ODY2NzQwNzQsImV4cCI6OTk5OTk5OTk5OX0.qY3nDNINoAfGkzvkUKFZxiI0iBASyxrWq7TrOjQ8QoI";
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
