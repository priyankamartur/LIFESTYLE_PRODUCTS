package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequestDto {
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 120, message = "New password must be between 6 and 120 characters")
    private String newPassword;

    // No-args constructor
    public ChangePasswordRequestDto() {
    }

    // All-args constructor
    public ChangePasswordRequestDto(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    // Builder method
    public static ChangePasswordRequestDtoBuilder builder() {
        return new ChangePasswordRequestDtoBuilder();
    }

    // Builder class
    public static class ChangePasswordRequestDtoBuilder {
        private String oldPassword;
        private String newPassword;

        public ChangePasswordRequestDtoBuilder oldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
            return this;
        }

        public ChangePasswordRequestDtoBuilder newPassword(String newPassword) {
            this.newPassword = newPassword;
            return this;
        }

        public ChangePasswordRequestDto build() {
            return new ChangePasswordRequestDto(oldPassword, newPassword);
        }
    }
}
