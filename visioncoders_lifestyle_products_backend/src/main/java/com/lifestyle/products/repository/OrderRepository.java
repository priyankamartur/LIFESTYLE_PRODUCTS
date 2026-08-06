package com.lifestyle.products.repository;

import com.lifestyle.products.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUsernameOrderByOrderDateDesc(String username);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN (com.lifestyle.products.entity.OrderStatus.PENDING, com.lifestyle.products.entity.OrderStatus.CANCELLED)")
    BigDecimal sumTotalRevenue();

    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN FETCH o.user u " +
           "JOIN FETCH u.roles r " +
           "JOIN FETCH o.orderItems oi " +
           "JOIN FETCH oi.product p " +
           "JOIN FETCH p.category c " +
           "WHERE u.username = :username " +
           "AND o.status NOT IN (com.lifestyle.products.entity.OrderStatus.PENDING, com.lifestyle.products.entity.OrderStatus.CANCELLED) " +
           "ORDER BY o.orderDate DESC")
    List<Order> findSuccessfulOrdersForUser(@org.springframework.data.repository.query.Param("username") String username);

    @Query(value = "SELECT DATE_FORMAT(order_date, '%Y-%m-%d') as period, COALESCE(SUM(total_amount), 0) as revenue " +
                   "FROM orders " +
                   "WHERE status NOT IN ('PENDING', 'CANCELLED') " +
                   "GROUP BY DATE_FORMAT(order_date, '%Y-%m-%d') " +
                   "ORDER BY period ASC", nativeQuery = true)
    List<Object[]> getDailyRevenueNative();

    @Query(value = "SELECT DATE_FORMAT(order_date, '%Y-%m') as period, COALESCE(SUM(total_amount), 0) as revenue " +
                   "FROM orders " +
                   "WHERE status NOT IN ('PENDING', 'CANCELLED') " +
                   "GROUP BY DATE_FORMAT(order_date, '%Y-%m') " +
                   "ORDER BY period ASC", nativeQuery = true)
    List<Object[]> getMonthlyRevenueNative();

    @Query(value = "SELECT DATE_FORMAT(order_date, '%Y') as period, COALESCE(SUM(total_amount), 0) as revenue " +
                   "FROM orders " +
                   "WHERE status NOT IN ('PENDING', 'CANCELLED') " +
                   "GROUP BY DATE_FORMAT(order_date, '%Y') " +
                   "ORDER BY period ASC", nativeQuery = true)
    List<Object[]> getYearlyRevenueNative();

    @Query(value = "SELECT COUNT(o.id) as txn_count, COALESCE(SUM(o.total_amount), 0) as revenue " +
                   "FROM orders o " +
                   "WHERE DATE(o.order_date) = DATE(:targetDate) " +
                   "AND o.status NOT IN ('PENDING', 'CANCELLED')", nativeQuery = true)
    List<Object[]> getDailyOrdersSummary(@org.springframework.data.repository.query.Param("targetDate") String targetDate);
}

