package com.example.Project3Backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // This enables WebSocket message handling
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic is for public chats (everyone subscribed)
        // /queue is for private chats (one-to-one)
        registry.enableSimpleBroker("/topic", "/queue");

        // Messages sent to /app/... will be routed to @MessageMapping methods in your controllers.
        registry.setApplicationDestinationPrefixes("/app");

        // This configures the prefix for user-specific destinations.
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the handshake endpoint.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}