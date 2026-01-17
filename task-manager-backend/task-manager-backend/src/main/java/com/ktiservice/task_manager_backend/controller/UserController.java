package com.ktiservice.task_manager_backend.controller;

import com.ktiservice.task_manager_backend.dto.ApiResponse;
import com.ktiservice.task_manager_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User information endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<Map<String, String>>> getUserProfile() {
        Map<String, String> profile = new HashMap<>();
        profile.put("userId", userService.getCurrentUserId());
        profile.put("username", userService.getCurrentUserName());
        profile.put("email", userService.getCurrentUserEmail());

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/check-role")
    @Operation(summary = "Check if user has specific role")
    public ResponseEntity<ApiResponse<Boolean>> checkRole(@RequestParam String role) {
        boolean hasRole = userService.hasRole(role);
        return ResponseEntity.ok(ApiResponse.success(hasRole));
    }
}
