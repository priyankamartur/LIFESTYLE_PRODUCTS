package com.lifestyle.products.controller;

import com.lifestyle.products.dto.AdminUserCreateRequestDto;
import com.lifestyle.products.dto.AdminUserUpdateRequestDto;
import com.lifestyle.products.dto.PagedResponseDto;
import com.lifestyle.products.dto.UserAdminResponseDto;
import com.lifestyle.products.dto.UserRoleUpdateRequestDto;
import com.lifestyle.products.service.UserAdminService;
import com.lifestyle.products.util.AppConstants;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    @Autowired
    private UserAdminService userAdminService;

    @GetMapping
    public ResponseEntity<PagedResponseDto<UserAdminResponseDto>> getAllUsers(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search
    ) {
        return ResponseEntity.ok(userAdminService.getAllUsers(page, size, sortBy, sortDir, search));
    }

    @PostMapping
    public ResponseEntity<UserAdminResponseDto> createUser(@Valid @RequestBody AdminUserCreateRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userAdminService.createUser(dto));
    }

    @PutMapping("/{userId}/enable")
    public ResponseEntity<UserAdminResponseDto> enableUser(@PathVariable(name = "userId") Long userId) {
        return ResponseEntity.ok(userAdminService.setUserStatus(userId, true));
    }

    @PutMapping("/{userId}/disable")
    public ResponseEntity<UserAdminResponseDto> disableUser(@PathVariable(name = "userId") Long userId) {
        return ResponseEntity.ok(userAdminService.setUserStatus(userId, false));
    }

    @PutMapping("/{userId}/roles")
    public ResponseEntity<UserAdminResponseDto> updateUserRoles(
            @PathVariable(name = "userId") Long userId,
            @Valid @RequestBody UserRoleUpdateRequestDto dto
    ) {
        return ResponseEntity.ok(userAdminService.updateUserRoles(userId, dto));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserAdminResponseDto> updateUser(
            @PathVariable(name = "userId") Long userId,
            @Valid @RequestBody AdminUserUpdateRequestDto dto
    ) {
        return ResponseEntity.ok(userAdminService.updateUser(userId, dto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserAdminResponseDto> getUserById(@PathVariable(name = "userId") Long userId) {
        return ResponseEntity.ok(userAdminService.getUserById(userId));
    }
}
