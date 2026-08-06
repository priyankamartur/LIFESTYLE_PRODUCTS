package com.lifestyle.products.controller;

import com.lifestyle.products.service.LogoutService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    @Autowired
    private LogoutService logoutService;

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        Map<String, String> responseBody = new HashMap<>();
        try {
            // Get current authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Extract token from request header
            String jwt = parseJwt(request);
            
            if (jwt != null) {
                logoutService.logoutToken(jwt);
            } else if (authentication != null && authentication.isAuthenticated()) {
                logoutService.logoutUser(authentication.getName());
            }

            // Clear SecurityContext
            SecurityContextHolder.clearContext();

            // Clear authentication cookies
            clearAuthCookies(response);

            responseBody.put("message", "Logout successful");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            responseBody.put("message", "Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    private void clearAuthCookies(HttpServletResponse response) {
        String[] cookieNames = {"token", "jwt", "jwt-token", "JSESSIONID"};
        for (String name : cookieNames) {
            Cookie cookie = new Cookie(name, null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }
}
