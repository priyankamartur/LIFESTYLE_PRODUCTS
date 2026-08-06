package com.lifestyle.products.repository;

import com.lifestyle.products.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @org.springframework.data.jpa.repository.Query(value = "SELECT COALESCE(SUM(oi.price * oi.quantity), 0) " +
                   "FROM order_items oi JOIN orders o ON oi.order_id = o.id " +
                   "WHERE DATE(o.order_date) = DATE(:targetDate) AND o.status NOT IN ('PENDING', 'CANCELLED')", nativeQuery = true)
    java.math.BigDecimal getDailyOrderItemsRevenue(@org.springframework.data.repository.query.Param("targetDate") String targetDate);
}

