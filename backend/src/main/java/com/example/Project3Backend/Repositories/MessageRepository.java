package com.example.Project3Backend.Repositories;

import com.example.Project3Backend.Entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// This interface connects the ChatMessage entity (which maps to 'messages'
// table)
public interface MessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE (m.senderId = :userId1 AND m.recipientId = :userId2) OR (m.senderId = :userId2 AND m.recipientId = :userId1) ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}