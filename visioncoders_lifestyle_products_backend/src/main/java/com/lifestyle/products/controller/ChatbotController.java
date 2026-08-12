package com.lifestyle.products.controller;

import com.lifestyle.products.dto.ChatDTOs.ChatRequest;
import com.lifestyle.products.dto.ChatDTOs.ChatResponse;
import com.lifestyle.products.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody(required = false) ChatRequest request) {
        return ResponseEntity.ok(chatbotService.processChatMessage(request));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions() {
        return ResponseEntity.ok(chatbotService.getSuggestedPrompts());
    }
}
