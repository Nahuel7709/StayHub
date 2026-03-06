package com.stayhub.backend.auth;

import com.stayhub.backend.auth.dto.AuthResponse;
import com.stayhub.backend.auth.dto.CurrentUserResponse;
import com.stayhub.backend.auth.dto.LoginRequest;
import com.stayhub.backend.auth.dto.RegisterRequest;
import com.stayhub.backend.auth.dto.RegisterResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public CurrentUserResponse me(Authentication authentication) {
        return authService.me(authentication.getName());
    }
}