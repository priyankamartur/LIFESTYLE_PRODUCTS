package com.lifestyle.products.repository;

import com.lifestyle.products.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT COALESCE(SUM(p.amount), 0) " +
                   "FROM payments p " +
                   "WHERE DATE(p.payment_date) = DATE(:targetDate) AND p.payment_status = 'SUCCESS'", nativeQuery = true)
    java.math.BigDecimal getDailyPaymentsRevenue(@org.springframework.data.repository.query.Param("targetDate") String targetDate);
}

