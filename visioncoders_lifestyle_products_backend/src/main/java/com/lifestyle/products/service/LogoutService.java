package com.lifestyle.products.service;

import com.lifestyle.products.entity.User;
import com.lifestyle.products.repository.JwtTokenRepository;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogoutService {

    @Autowired
    private JwtTokenRepository jwtTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void logoutUser(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            jwtTokenRepository.deleteByUser(user);
        });
    }

    @Transactional
    public void logoutToken(String token) {
        jwtTokenRepository.deleteByToken(token);
    }
}
