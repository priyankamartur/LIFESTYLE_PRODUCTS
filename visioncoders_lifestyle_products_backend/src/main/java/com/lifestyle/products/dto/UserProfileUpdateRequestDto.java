package com.lifestyle.products.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserProfileUpdateRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    // No-args constructor
    public UserProfileUpdateRequestDto() {
    }

    // All-args constructor
    public UserProfileUpdateRequestDto(String email, String firstName, String lastName, String phoneNumber) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // Builder method
    public static UserProfileUpdateRequestDtoBuilder builder() {
        return new UserProfileUpdateRequestDtoBuilder();
    }

    // Builder class
    public static class UserProfileUpdateRequestDtoBuilder {
        private String email;
        private String firstName;
        private String lastName;
        private String phoneNumber;

        public UserProfileUpdateRequestDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserProfileUpdateRequestDtoBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserProfileUpdateRequestDtoBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserProfileUpdateRequestDtoBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserProfileUpdateRequestDto build() {
            return new UserProfileUpdateRequestDto(email, firstName, lastName, phoneNumber);
        }
    }
}
