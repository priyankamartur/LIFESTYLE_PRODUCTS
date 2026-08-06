package com.lifestyle.products.repository;

import com.lifestyle.products.entity.JwtToken;
import com.lifestyle.products.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {
    Optional<JwtToken> findByToken(String token);
    
    @Transactional
    void deleteByUser(User user);
    
    @Transactional
    void deleteByToken(String token);
}
