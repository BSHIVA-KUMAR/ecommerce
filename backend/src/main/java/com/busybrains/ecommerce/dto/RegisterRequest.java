package com.ecommerce.dto;

public record RegisterRequest(String username, String password, String email, String fullName, String role) {}
