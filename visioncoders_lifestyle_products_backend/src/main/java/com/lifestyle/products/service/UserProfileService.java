package com.lifestyle.products.service;

import com.lifestyle.products.dto.ChangePasswordRequestDto;
import com.lifestyle.products.dto.UserProfileResponseDto;
import com.lifestyle.products.dto.UserProfileUpdateRequestDto;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponseDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found with username: " + username, HttpStatus.NOT_FOUND));
        return mapToDto(user);
    }

    @Transactional
    public UserProfileResponseDto updateUserProfile(String username, UserProfileUpdateRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found with username: " + username, HttpStatus.NOT_FOUND));

        if (!user.getEmail().equalsIgnoreCase(dto.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new ApiException("Email is already in use by another account", HttpStatus.BAD_REQUEST);
            }
            user.setEmail(dto.getEmail());
        }

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found with username: " + username, HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new ApiException("Incorrect current password", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileResponseDto mapToDto(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .build();
    }
}
