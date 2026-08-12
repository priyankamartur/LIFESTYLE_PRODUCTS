package com.lifestyle.products.service;

import com.lifestyle.products.dto.ChatDTOs.ChatRequest;
import com.lifestyle.products.dto.ChatDTOs.ChatResponse;
import com.lifestyle.products.dto.ProductDto;
import com.lifestyle.products.entity.Category;
import com.lifestyle.products.entity.Product;
import com.lifestyle.products.repository.CategoryRepository;
import com.lifestyle.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductService productService;

    public List<String> getSuggestedPrompts() {
        return Arrays.asList(
                "✨ Recommend top featured items",
                "👜 Show stylish bags & luxury accessories",
                "🚚 What are your shipping & delivery times?",
                "🔄 What is your return and refund policy?",
                "📦 How can I track my active order?",
                "💳 What payment methods are supported?"
        );
    }

    @Transactional(readOnly = true)
    public ChatResponse processChatMessage(ChatRequest request) {
        String userMsg = request != null && request.getMessage() != null ? request.getMessage().trim() : "";
        if (userMsg.isEmpty()) {
            return new ChatResponse(
                    "Hello! I am AURA, your personal Lifestyle AI Assistant. How can I help you today?",
                    Collections.emptyList(),
                    getSuggestedPrompts()
            );
        }

        String lowerMsg = userMsg.toLowerCase(Locale.ROOT);
        List<ProductDto> recommendedProducts = new ArrayList<>();
        StringBuilder reply = new StringBuilder();
        List<String> nextQuickReplies = new ArrayList<>();

        // 1. Greeting Check
        if (lowerMsg.matches(".*\\b(hi|hello|hey|greetings|good morning|good evening)\\b.*")) {
            reply.append("Hello there! I'm AURA, your AI Shopping Assistant. How can I assist you with your shopping experience today?");
            nextQuickReplies.addAll(Arrays.asList("✨ Show top featured items", "🚚 Shipping information", "💡 Help me find a gift"));
            return new ChatResponse(reply.toString(), Collections.emptyList(), nextQuickReplies);
        }

        // 2. Shipping & Delivery Intent
        if (lowerMsg.contains("shipping") || lowerMsg.contains("deliver") || lowerMsg.contains("courier") || lowerMsg.contains("dispatch")) {
            reply.append("🚚 **Shipping & Delivery Information**:\n\n")
                 .append("• Standard Delivery: 3-5 business days (Free on orders over $50).\n")
                 .append("• Express Delivery: 1-2 business days.\n")
                 .append("• International Shipping: Available for select regions.\n\n")
                 .append("All orders come with live tracking sent straight to your email once dispatched!");
            nextQuickReplies.addAll(Arrays.asList("📦 Track my order", "🔄 Return policy", "✨ Featured products"));
            return new ChatResponse(reply.toString(), Collections.emptyList(), nextQuickReplies);
        }

        // 3. Return & Refund Intent
        if (lowerMsg.contains("return") || lowerMsg.contains("refund") || lowerMsg.contains("exchange") || lowerMsg.contains("policy")) {
            reply.append("🔄 **Return & Refund Policy**:\n\n")
                 .append("• 30-Day Hassle-Free Returns on unused items in original packaging.\n")
                 .append("• Easy instant return requests from your Account profile page.\n")
                 .append("• Full refund processed within 48 hours of item verification.");
            nextQuickReplies.addAll(Arrays.asList("💬 Contact support", "🚚 Delivery options", "✨ Browse catalog"));
            return new ChatResponse(reply.toString(), Collections.emptyList(), nextQuickReplies);
        }

        // 4. Order Tracking Intent
        if (lowerMsg.contains("track") || lowerMsg.contains("status") || lowerMsg.contains("where is my order")) {
            reply.append("📦 **Order Tracking**:\n\n")
                 .append("You can check real-time order status directly from your profile under **'My Orders'**.\n")
                 .append("If you placed an order recently, tracking details are also emailed to your registered address.");
            nextQuickReplies.addAll(Arrays.asList("💬 Support contact", "💳 Payment assistance", "✨ Continue shopping"));
            return new ChatResponse(reply.toString(), Collections.emptyList(), nextQuickReplies);
        }

        // 5. Payment Methods
        if (lowerMsg.contains("payment") || lowerMsg.contains("pay") || lowerMsg.contains("razorpay") || lowerMsg.contains("card") || lowerMsg.contains("upi")) {
            reply.append("💳 **Accepted Payment Methods**:\n\n")
                 .append("We accept Credit/Debit cards (Visa, Mastercard, AMEX), NetBanking, UPI, digital wallets, and secure checkout via Razorpay.");
            nextQuickReplies.addAll(Arrays.asList("✨ Browse products", "🚚 Shipping times", "🔄 Return policy"));
            return new ChatResponse(reply.toString(), Collections.emptyList(), nextQuickReplies);
        }

        // 6. Featured / Best Seller Intent
        if (lowerMsg.contains("featured") || lowerMsg.contains("best seller") || lowerMsg.contains("trending") || lowerMsg.contains("popular") || lowerMsg.contains("top rated")) {
            List<Product> featuredList = productRepository.findByFeaturedTrue();
            if (featuredList.isEmpty()) {
                Page<Product> page = productRepository.findAll(PageRequest.of(0, 4));
                featuredList = page.getContent();
            }
            recommendedProducts = featuredList.stream()
                    .limit(4)
                    .map(p -> productService.getProductById(p.getId()))
                    .collect(Collectors.toList());

            reply.append("✨ Here are our top featured and popular lifestyle items chosen just for you:");
            nextQuickReplies.addAll(Arrays.asList("👜 Show accessories", "🚚 Delivery info", "💳 Payment info"));
            return new ChatResponse(reply.toString(), recommendedProducts, nextQuickReplies);
        }

        // 7. Budget / Price Filter Intent (e.g. "under 100", "cheap", "affordable")
        BigDecimal maxPrice = null;
        if (lowerMsg.contains("under 100") || lowerMsg.contains("under $100")) {
            maxPrice = new BigDecimal("100");
        } else if (lowerMsg.contains("under 50") || lowerMsg.contains("under $50")) {
            maxPrice = new BigDecimal("50");
        } else if (lowerMsg.contains("under 200") || lowerMsg.contains("under $200")) {
            maxPrice = new BigDecimal("200");
        }

        // 8. Category & Keyword Product Search
        List<Category> allCategories = categoryRepository.findAll();
        Category matchedCategory = null;
        for (Category cat : allCategories) {
            if (lowerMsg.contains(cat.getName().toLowerCase(Locale.ROOT))) {
                matchedCategory = cat;
                break;
            }
        }

        String searchKeyword = null;
        if (matchedCategory == null) {
            // Extract common lifestyle nouns
            String[] keywords = {"bag", "shoe", "watch", "shirt", "dress", "jacket", "glasses", "wallet", "fragrance", "perfume", "leather", "cotton", "denim", "hoodie"};
            for (String kw : keywords) {
                if (lowerMsg.contains(kw)) {
                    searchKeyword = kw;
                    break;
                }
            }
        }

        Long catId = matchedCategory != null ? matchedCategory.getId() : null;
        String searchTerm = searchKeyword != null ? searchKeyword : (matchedCategory == null ? userMsg.replaceAll("(?i)(show|recommend|find|me|items|products|looking|for|a|an|the|under|price|please)", "").trim() : null);

        Page<Product> searchResults = productRepository.searchProducts(catId, (searchTerm != null && !searchTerm.isEmpty()) ? searchTerm : null, PageRequest.of(0, 6));
        List<Product> candidates = searchResults.getContent();

        if (maxPrice != null) {
            final BigDecimal filterPrice = maxPrice;
            candidates = candidates.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice().compareTo(filterPrice) <= 0)
                    .collect(Collectors.toList());
        }

        if (!candidates.isEmpty()) {
            recommendedProducts = candidates.stream()
                    .limit(4)
                    .map(p -> productService.getProductById(p.getId()))
                    .collect(Collectors.toList());

            if (matchedCategory != null) {
                reply.append("🛍️ Here are some top picks from our **").append(matchedCategory.getName()).append("** collection:");
            } else {
                reply.append("🛍️ I found these products matching your request:");
            }
            nextQuickReplies.addAll(Arrays.asList("✨ Top featured items", "🚚 Delivery options", "🔄 Return policy"));
            return new ChatResponse(reply.toString(), recommendedProducts, nextQuickReplies);
        }

        // 9. Fallback Catalog Suggestion
        List<Product> topItems = productRepository.findTop8ByOrderByCreatedAtDesc();
        if (!topItems.isEmpty()) {
            recommendedProducts = topItems.stream()
                    .limit(4)
                    .map(p -> productService.getProductById(p.getId()))
                    .collect(Collectors.toList());
        }

        reply.append("I couldn't find exact matches for \"").append(userMsg).append("\", but check out these trending items from our latest collection:");
        nextQuickReplies.addAll(Arrays.asList("✨ View top featured", "🚚 Delivery times", "🔄 Return policy", "💬 Customer service"));

        return new ChatResponse(reply.toString(), recommendedProducts, nextQuickReplies);
    }
}
