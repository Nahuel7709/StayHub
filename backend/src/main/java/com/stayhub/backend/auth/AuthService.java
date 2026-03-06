package com.stayhub.backend.auth;

import com.stayhub.backend.auth.dto.AuthResponse;
import com.stayhub.backend.auth.dto.CurrentUserResponse;
import com.stayhub.backend.auth.dto.LoginRequest;
import com.stayhub.backend.auth.dto.RegisterRequest;
import com.stayhub.backend.auth.dto.RegisterResponse;
import com.stayhub.backend.common.ConflictException;
import com.stayhub.backend.common.UnauthorizedException;
import com.stayhub.backend.users.Role;
import com.stayhub.backend.users.User;
import com.stayhub.backend.users.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Ya existe un usuario con ese email");
        }

        User user = new User(
                request.getFirstName().trim(),
                request.getLastName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public CurrentUserResponse me(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Usuario no autenticado"));

        return new CurrentUserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
}