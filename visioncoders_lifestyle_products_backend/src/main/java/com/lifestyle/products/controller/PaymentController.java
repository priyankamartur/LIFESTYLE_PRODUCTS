package com.lifestyle.products.controller;

import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.PaymentRequestDto;
import com.lifestyle.products.dto.PaymentResponseDto;
import com.lifestyle.products.dto.RazorpayOrderRequest;
import com.lifestyle.products.dto.RazorpayOrderResponse;
import com.lifestyle.products.dto.RazorpayVerifyRequest;
import com.lifestyle.products.service.PaymentService;
import com.lifestyle.products.service.RazorpayPaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private RazorpayPaymentService razorpayPaymentService;

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDto> processPayment(
            Principal principal,
            @Valid @RequestBody PaymentRequestDto dto
    ) {
        return ResponseEntity.ok(paymentService.processPayment(principal.getName(), dto));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponseDto> getPaymentDetails(
            @PathVariable(name = "orderId") Long orderId,
            Principal principal
    ) {
        return ResponseEntity.ok(paymentService.getPaymentDetailsByOrderId(principal.getName(), orderId));
    }

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(
            @Valid @RequestBody RazorpayOrderRequest request
    ) {
        return ResponseEntity.ok(razorpayPaymentService.createRazorpayOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderResponseDto> verifyPayment(
            Principal principal,
            @Valid @RequestBody RazorpayVerifyRequest request
    ) {
        return ResponseEntity.ok(razorpayPaymentService.verifyPayment(principal.getName(), request));
    }
}
