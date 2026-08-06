package com.lifestyle.products.controller;

import com.lifestyle.products.dto.ChangePasswordRequestDto;
import com.lifestyle.products.dto.MessageResponse;
import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.UserProfileResponseDto;
import com.lifestyle.products.dto.UserProfileUpdateRequestDto;
import com.lifestyle.products.service.OrderService;
import com.lifestyle.products.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<UserProfileResponseDto> getUserProfile(Principal principal) {
        return ResponseEntity.ok(userProfileService.getUserProfile(principal.getName()));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponseDto> updateUserProfile(
            Principal principal,
            @Valid @RequestBody UserProfileUpdateRequestDto dto
    ) {
        return ResponseEntity.ok(userProfileService.updateUserProfile(principal.getName(), dto));
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequestDto dto
    ) {
        userProfileService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDto>> getUserOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getOrderHistory(principal.getName()));
    }
}
