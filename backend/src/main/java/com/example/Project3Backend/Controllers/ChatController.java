package com.example.Project3Backend.Controllers;

import com.example.Project3Backend.Entities.ChatMessage;
import com.example.Project3Backend.Repositories.MessageRepository;

import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import com.example.Project3Backend.Services.AppUserService;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private AppUserService appUserService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {

        System.out.println("--- MESSAGE RECEIVED ---");
        System.out.println("Sender: " + chatMessage.getSenderId());
        System.out.println("Recipient: " + chatMessage.getRecipientId());

        chatMessage.setTimestamp(OffsetDateTime.now());

        try {
            messageRepository.save(chatMessage);
        } catch (Exception e) {
            System.err.println("Failed to save message: " + e.getMessage());
        }

        String recipientDestination = "/queue/private-" + chatMessage.getRecipientId();
        messagingTemplate.convertAndSend(recipientDestination, chatMessage);
        System.out.println("Message sent to destination: " + recipientDestination);
    }

    @GetMapping("/api/messages/{otherUserId}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@PathVariable Long otherUserId,
            @RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        Long currentUserId = appUserService.getUserIdFromToken(jwt);
        return messageRepository.findChatHistory(currentUserId, otherUserId);
    }

    @GetMapping("/db-check")
    @ResponseBody
    public String checkDatabase() {
        try {
            long count = messageRepository.count();
            return "OK: Connected to Supabase. Found " + count + " messages.";
        } catch (Exception e) {
            return "ERROR: Database connection failed. " + e.getMessage();
        }
    }
}
