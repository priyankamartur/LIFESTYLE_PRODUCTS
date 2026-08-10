package com.lifestyle.products.service;

import com.lifestyle.products.dto.AdminUserCreateRequestDto;
import com.lifestyle.products.dto.AdminUserUpdateRequestDto;
import com.lifestyle.products.dto.PagedResponseDto;
import com.lifestyle.products.dto.UserAdminResponseDto;
import com.lifestyle.products.dto.UserRoleUpdateRequestDto;
import com.lifestyle.products.entity.ERole;
import com.lifestyle.products.entity.Role;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.RoleRepository;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserAdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponseDto<UserAdminResponseDto> getAllUsers(int pageNo, int pageSize, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.DESC.name())
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();

        Page<User> page = userRepository.searchUsers(searchParam, pageable);

        List<UserAdminResponseDto> content = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public UserAdminResponseDto createUser(AdminUserCreateRequestDto dto) {
        if (userRepository.existsByUsername(dto.getUsername().trim())) {
            throw new ApiException("Error: Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(dto.getEmail().trim())) {
            throw new ApiException("Error: Email is already in use!", HttpStatus.BAD_REQUEST);
        }

        Set<Role> roles = new HashSet<>();
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            for (String roleName : dto.getRoles()) {
                String formattedRole = roleName.toUpperCase();
                if (!formattedRole.startsWith("ROLE_")) {
                    formattedRole = "ROLE_" + formattedRole;
                }
                final String finalFormattedRole = formattedRole;
                try {
                    ERole eRole = ERole.valueOf(finalFormattedRole);
                    Role role = roleRepository.findByName(eRole)
                            .orElseThrow(() -> new ApiException("Role not found in database: " + finalFormattedRole, HttpStatus.BAD_REQUEST));
                    roles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new ApiException("Invalid role value: " + roleName, HttpStatus.BAD_REQUEST);
                }
            }
        } else {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new ApiException("Role ROLE_ADMIN not found", HttpStatus.INTERNAL_SERVER_ERROR));
            roles.add(adminRole);
        }

        User user = User.builder()
                .username(dto.getUsername().trim())
                .email(dto.getEmail().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName() != null ? dto.getFirstName().trim() : null)
                .lastName(dto.getLastName() != null ? dto.getLastName().trim() : null)
                .phoneNumber(dto.getPhoneNumber() != null ? dto.getPhoneNumber().trim() : null)
                .enabled(dto.getEnabled() != null ? dto.getEnabled() : true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    @Transactional
    public UserAdminResponseDto setUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        user.setEnabled(enabled);
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public UserAdminResponseDto updateUser(Long userId, AdminUserUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        if (dto.getUsername() != null && !dto.getUsername().trim().isEmpty()) {
            String newUsername = dto.getUsername().trim();
            if (!user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
                throw new ApiException("Error: Username is already taken!", HttpStatus.BAD_REQUEST);
            }
            user.setUsername(newUsername);
        }

        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            String newEmail = dto.getEmail().trim();
            if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
                throw new ApiException("Error: Email is already in use!", HttpStatus.BAD_REQUEST);
            }
            user.setEmail(newEmail);
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        if (dto.getEnabled() != null) {
            user.setEnabled(dto.getEnabled());
        }

        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : dto.getRoles()) {
                String formattedRole = roleName.toUpperCase();
                if (!formattedRole.startsWith("ROLE_")) {
                    formattedRole = "ROLE_" + formattedRole;
                }
                final String finalFormattedRole = formattedRole;
                try {
                    ERole eRole = ERole.valueOf(finalFormattedRole);
                    Role role = roleRepository.findByName(eRole)
                            .orElseThrow(() -> new ApiException("Role not found in database: " + finalFormattedRole, HttpStatus.BAD_REQUEST));
                    roles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new ApiException("Invalid role value: " + roleName, HttpStatus.BAD_REQUEST);
                }
            }
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public UserAdminResponseDto updateUserRoles(Long userId, UserRoleUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        Set<Role> roles = new HashSet<>();
        for (String roleName : dto.getRoles()) {
            String formattedRole = roleName.toUpperCase();
            if (!formattedRole.startsWith("ROLE_")) {
                formattedRole = "ROLE_" + formattedRole;
            }

            final String finalFormattedRole = formattedRole;

            try {
                ERole eRole = ERole.valueOf(finalFormattedRole);
                Role role = roleRepository.findByName(eRole)
                        .orElseThrow(() -> new ApiException("Role not found in database: " + finalFormattedRole, HttpStatus.BAD_REQUEST));
                roles.add(role);
            } catch (IllegalArgumentException e) {
                throw new ApiException("Invalid role value: " + roleName, HttpStatus.BAD_REQUEST);
            }
        }

        user.setRoles(roles);
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional(readOnly = true)
    public UserAdminResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));
        return mapToDto(user);
    }

    private UserAdminResponseDto mapToDto(User user) {
        return UserAdminResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .enabled(user.getEnabled() != null ? user.getEnabled() : true)
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .build();
    }
}
