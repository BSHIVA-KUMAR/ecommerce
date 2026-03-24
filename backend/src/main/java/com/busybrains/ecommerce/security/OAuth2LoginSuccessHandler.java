package com.ecommerce.security;

import com.ecommerce.model.Role;
import com.ecommerce.model.UserEntity;
import com.ecommerce.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.oauth2.redirect-uri}")
    private String frontendRedirectUri;

    public OAuth2LoginSuccessHandler(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String fullName = (String) attributes.getOrDefault("name", "");
        if (email == null || email.isBlank()) {
            response.sendRedirect(frontendRedirectUri + "?error=missing_email");
            return;
        }

        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> createNewSsoUser(email, fullName));
        if ((user.getFullName() == null || user.getFullName().isBlank()) && !fullName.isBlank()) {
            user.setFullName(fullName);
            user = userRepository.save(user);
        }

        AppUserDetails userDetails = new AppUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        String redirectUrl = frontendRedirectUri
                + "?token=" + encode(token)
                + "&username=" + encode(user.getUsername())
                + "&role=" + encode(user.getRole().name());
        response.sendRedirect(redirectUrl);
    }

    private UserEntity createNewSsoUser(String email, String fullName) {
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setUsername(generateUniqueUsername(email));
        user.setFullName(fullName);
        user.setRole(Role.ROLE_USER);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return userRepository.save(user);
    }

    private String generateUniqueUsername(String email) {
        String localPart = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "").toLowerCase();
        String base = localPart.isBlank() ? "googleuser" : localPart;
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
