package com.lifestyle.products.service;

import com.lifestyle.products.dto.*;
import com.lifestyle.products.entity.ERole;
import com.lifestyle.products.entity.Role;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.entity.JwtToken;
import com.lifestyle.products.entity.PasswordResetToken;
import com.lifestyle.products.repository.JwtTokenRepository;
import com.lifestyle.products.repository.PasswordResetTokenRepository;
import com.lifestyle.products.repository.RoleRepository;
import com.lifestyle.products.repository.UserRepository;
import com.lifestyle.products.security.jwt.JwtUtils;
import com.lifestyle.products.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JwtTokenRepository jwtTokenRepository;

    @Transactional
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new ApiException("Error: Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new ApiException("Error: Email is already in use!", HttpStatus.BAD_REQUEST);
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new ApiException("Error: Role ROLE_USER is not found.", HttpStatus.INTERNAL_SERVER_ERROR));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    @Transactional
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Save token to DB
        User user = userRepository.findByUsernameOrEmail(userDetails.getUsername(), userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        jwtTokenRepository.save(new JwtToken(jwt, user));

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public JwtResponse authenticateAdmin(LoginRequest loginRequest) {
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN);

        if (!isAdmin) {
            throw new ApiException("Access denied (non-admin)", HttpStatus.FORBIDDEN);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        jwtTokenRepository.save(new JwtToken(jwt, user));

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String emailInput = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(emailInput);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsernameOrEmail(request.getEmail().trim(), request.getEmail().trim());
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
            PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
            passwordResetTokenRepository.save(resetToken);

            logger.info("=========================================================================");
            logger.info("PASSWORD RESET TOKEN FOR EMAIL {}: {}", user.getEmail(), token);
            logger.info("RESET LINK: http://localhost:5173/reset-password?token={}&email={}", token, user.getEmail());
            logger.info("=========================================================================");

            return new ForgotPasswordResponse("If your email is registered, a password reset link has been sent.", token);
        }

        logger.info("Password reset requested for unregistered email/username: {}", request.getEmail());
        return new ForgotPasswordResponse("If your email is registered, a password reset link has been sent.", null);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken().trim())
                .orElseThrow(() -> new ApiException("Invalid or expired password reset token.", HttpStatus.BAD_REQUEST));

        if (resetToken.isUsed()) {
            throw new ApiException("This password reset token has already been used.", HttpStatus.BAD_REQUEST);
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ApiException("This password reset token has expired.", HttpStatus.BAD_REQUEST);
        }

        User user = resetToken.getUser();
        if (!user.getEmail().equalsIgnoreCase(request.getEmail().trim()) && !user.getUsername().equalsIgnoreCase(request.getEmail().trim())) {
            throw new ApiException("Token does not match the provided email address.", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        logger.info("Password reset successfully for user: {}", user.getUsername());
        return new MessageResponse("Password reset successfully.");
    }
}
