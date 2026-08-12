package com.lifestyle.products.dto;

import java.util.List;

public class ChatDTOs {

    public static class ChatRequest {
        private String message;
        private String conversationId;

        public ChatRequest() {
        }

        public ChatRequest(String message, String conversationId) {
            this.message = message;
            this.conversationId = conversationId;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getConversationId() {
            return conversationId;
        }

        public void setConversationId(String conversationId) {
            this.conversationId = conversationId;
        }
    }

    public static class ChatResponse {
        private String reply;
        private List<ProductDto> products;
        private List<String> quickReplies;
        private long timestamp;

        public ChatResponse() {
            this.timestamp = System.currentTimeMillis();
        }

        public ChatResponse(String reply, List<ProductDto> products, List<String> quickReplies) {
            this.reply = reply;
            this.products = products;
            this.quickReplies = quickReplies;
            this.timestamp = System.currentTimeMillis();
        }

        public String getReply() {
            return reply;
        }

        public void setReply(String reply) {
            this.reply = reply;
        }

        public List<ProductDto> getProducts() {
            return products;
        }

        public void setProducts(List<ProductDto> products) {
            this.products = products;
        }

        public List<String> getQuickReplies() {
            return quickReplies;
        }

        public void setQuickReplies(List<String> quickReplies) {
            this.quickReplies = quickReplies;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
