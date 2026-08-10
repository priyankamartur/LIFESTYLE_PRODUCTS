package com.lifestyle.products.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserCreateRequestDto {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 100, message = "Email must be under 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 120, message = "Password must be at least 6 characters")
    private String password;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean enabled;
    private List<String> roles;
}
