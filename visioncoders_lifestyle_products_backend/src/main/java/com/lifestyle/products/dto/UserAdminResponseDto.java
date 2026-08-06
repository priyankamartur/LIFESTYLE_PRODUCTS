package com.lifestyle.products.dto;

import java.util.List;

public class UserAdminResponseDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean enabled;
    private List<String> roles;

    // No-args constructor
    public UserAdminResponseDto() {
    }

    // All-args constructor
    public UserAdminResponseDto(Long id, String username, String email, String firstName, String lastName, String phoneNumber, Boolean enabled, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.enabled = enabled;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    // Builder Pattern
    public static UserAdminResponseDtoBuilder builder() {
        return new UserAdminResponseDtoBuilder();
    }

    public static class UserAdminResponseDtoBuilder {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private Boolean enabled;
        private List<String> roles;

        public UserAdminResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserAdminResponseDtoBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserAdminResponseDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserAdminResponseDtoBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserAdminResponseDtoBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserAdminResponseDtoBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserAdminResponseDtoBuilder enabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserAdminResponseDtoBuilder roles(List<String> roles) {
            this.roles = roles;
            return this;
        }

        public UserAdminResponseDto build() {
            return new UserAdminResponseDto(id, username, email, firstName, lastName, phoneNumber, enabled, roles);
        }
    }
}
