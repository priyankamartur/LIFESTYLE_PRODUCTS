package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class UserRoleUpdateRequestDto {
    @NotEmpty(message = "Roles list cannot be empty")
    private List<String> roles;

    // No-args constructor
    public UserRoleUpdateRequestDto() {
    }

    // All-args constructor
    public UserRoleUpdateRequestDto(List<String> roles) {
        this.roles = roles;
    }

    // Getter and Setter
    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    // Builder Pattern
    public static UserRoleUpdateRequestDtoBuilder builder() {
        return new UserRoleUpdateRequestDtoBuilder();
    }

    public static class UserRoleUpdateRequestDtoBuilder {
        private List<String> roles;

        public UserRoleUpdateRequestDtoBuilder roles(List<String> roles) {
            this.roles = roles;
            return this;
        }

        public UserRoleUpdateRequestDto build() {
            return new UserRoleUpdateRequestDto(roles);
        }
    }
}
