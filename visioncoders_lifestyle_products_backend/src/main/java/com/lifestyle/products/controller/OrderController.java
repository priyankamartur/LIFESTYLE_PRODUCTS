package com.lifestyle.products.controller;

import com.lifestyle.products.dto.CheckoutRequestDto;
import com.lifestyle.products.dto.OrderHistoryItemDto;
import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.OrderStatusUpdateRequestDto;
import com.lifestyle.products.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDto> checkout(
            Principal principal,
            @Valid @RequestBody CheckoutRequestDto dto
    ) {
        return new ResponseEntity<>(orderService.checkout(principal.getName(), dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderHistoryItemDto>> getOrderHistory(Principal principal) {
        return ResponseEntity.ok(orderService.getSuccessfulOrders(principal.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderResponseDto>> getStructuredOrderHistory(Principal principal) {
        return ResponseEntity.ok(orderService.getOrderHistory(principal.getName()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(
            @PathVariable(name = "orderId") Long orderId,
            Principal principal
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(principal.getName(), orderId));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable(name = "orderId") Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequestDto dto
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, dto));
    }
}
