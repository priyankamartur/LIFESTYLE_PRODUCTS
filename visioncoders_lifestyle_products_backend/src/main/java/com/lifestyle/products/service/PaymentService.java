package com.lifestyle.products.service;

import com.lifestyle.products.dto.PaymentRequestDto;
import com.lifestyle.products.dto.PaymentResponseDto;
import com.lifestyle.products.entity.Order;
import com.lifestyle.products.entity.OrderStatus;
import com.lifestyle.products.entity.Payment;
import com.lifestyle.products.entity.PaymentStatus;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.OrderRepository;
import com.lifestyle.products.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public PaymentResponseDto processPayment(String username, PaymentRequestDto dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ApiException("Order not found with ID: " + dto.getOrderId(), HttpStatus.NOT_FOUND));

        if (!order.getUser().getUsername().equals(username)) {
            throw new ApiException("Access denied: You do not own this order", HttpStatus.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ApiException("Payment has already been processed or order is cancelled", HttpStatus.BAD_REQUEST);
        }

        boolean isSuccess = !"FAILED".equalsIgnoreCase(dto.getSimulateStatus());
        PaymentStatus paymentStatus = isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        String transactionId = (isSuccess ? "TXN-OK-" : "TXN-FAIL-") + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create Payment entity
        Payment payment = Payment.builder()
                .order(order)
                .transactionId(transactionId)
                .amount(order.getTotalAmount())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update Order Status
        if (isSuccess) {
            order.setStatus(OrderStatus.PROCESSING);
        } else {
            order.setStatus(OrderStatus.CANCELLED);
        }
        orderRepository.save(order);

        return PaymentResponseDto.builder()
                .id(savedPayment.getId())
                .orderId(order.getId())
                .transactionId(savedPayment.getTransactionId())
                .amount(savedPayment.getAmount())
                .paymentMethod(savedPayment.getPaymentMethod())
                .paymentStatus(savedPayment.getPaymentStatus().name())
                .paymentDate(savedPayment.getPaymentDate())
                .message(isSuccess ? "Payment completed successfully." : "Payment failed. Transaction declined by gateway.")
                .build();
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentDetailsByOrderId(String username, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found with ID: " + orderId, HttpStatus.NOT_FOUND));

        if (!order.getUser().getUsername().equals(username)) {
            throw new ApiException("Access denied: You do not own this order", HttpStatus.FORBIDDEN);
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException("No payment transaction found for order ID: " + orderId, HttpStatus.NOT_FOUND));

        return PaymentResponseDto.builder()
                .id(payment.getId())
                .orderId(order.getId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus().name())
                .paymentDate(payment.getPaymentDate())
                .message(payment.getPaymentStatus() == PaymentStatus.COMPLETED ? "Transaction completed." : "Transaction failed.")
                .build();
    }
}
