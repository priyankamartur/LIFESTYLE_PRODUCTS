package com.lifestyle.products.repository;

import com.lifestyle.products.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserUsernameAndProductId(String username, Long productId);
    List<Wishlist> findByUserUsernameOrderByCreatedAtDesc(String username);
    long countByUserUsername(String username);
    boolean existsByUserUsernameAndProductId(String username, Long productId);
}
