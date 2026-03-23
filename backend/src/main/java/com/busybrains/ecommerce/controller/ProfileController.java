package com.ecommerce.controller;

import com.ecommerce.dto.ChangePasswordRequest;
import com.ecommerce.dto.ProfileResponse;
import com.ecommerce.dto.UpdateProfileRequest;
import com.ecommerce.model.UserEntity;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.AppUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ProfileResponse getProfile(@AuthenticationPrincipal AppUserDetails principal) {
        UserEntity user = principal.getUser();
        return toResponse(user);
    }

    @PutMapping
    public ProfileResponse updateProfile(@AuthenticationPrincipal AppUserDetails principal,
                                         @RequestBody UpdateProfileRequest request) {
        UserEntity user = principal.getUser();
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        return toResponse(userRepository.save(user));
    }

    @PutMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@AuthenticationPrincipal AppUserDetails principal,
                               @RequestBody ChangePasswordRequest request) {
        UserEntity user = principal.getUser();
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private ProfileResponse toResponse(UserEntity user) {
        return new ProfileResponse(user.getUsername(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole().name());
    }
}
