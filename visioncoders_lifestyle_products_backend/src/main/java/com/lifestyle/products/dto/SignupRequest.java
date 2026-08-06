package com.lifestyle.products.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class SignupRequest {
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

    private String role;
    private Set<String> roles;

    // No-args constructor
    public SignupRequest() {
    }

    // All-args constructor with roles (for backward compatibility)
    public SignupRequest(String username, String email, String password, Set<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    // All-args constructor with role and roles
    public SignupRequest(String username, String email, String password, String role, Set<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.roles = roles;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    // Builder pattern
    public static SignupRequestBuilder builder() {
        return new SignupRequestBuilder();
    }

    public static class SignupRequestBuilder {
        private String username;
        private String email;
        private String password;
        private String role;
        private Set<String> roles;

        public SignupRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public SignupRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public SignupRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public SignupRequestBuilder role(String role) {
            this.role = role;
            return this;
        }

        public SignupRequestBuilder roles(Set<String> roles) {
            this.roles = roles;
            return this;
        }

        public SignupRequest build() {
            return new SignupRequest(username, email, password, role, roles);
        }
    }
}
