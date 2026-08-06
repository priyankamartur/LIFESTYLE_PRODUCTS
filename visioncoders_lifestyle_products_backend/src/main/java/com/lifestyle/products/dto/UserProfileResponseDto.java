package com.lifestyle.products.dto;

import java.util.List;

public class UserProfileResponseDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private List<String> roles;

    // No-args constructor
    public UserProfileResponseDto() {
    }

    // All-args constructor
    public UserProfileResponseDto(Long id, String username, String email, String firstName, String lastName, String phoneNumber, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
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

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    // Builder method
    public static UserProfileResponseDtoBuilder builder() {
        return new UserProfileResponseDtoBuilder();
    }

    // Builder class
    public static class UserProfileResponseDtoBuilder {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private List<String> roles;

        public UserProfileResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserProfileResponseDtoBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserProfileResponseDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserProfileResponseDtoBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserProfileResponseDtoBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserProfileResponseDtoBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserProfileResponseDtoBuilder roles(List<String> roles) {
            this.roles = roles;
            return this;
        }

        public UserProfileResponseDto build() {
            return new UserProfileResponseDto(id, username, email, firstName, lastName, phoneNumber, roles);
        }
    }
}
