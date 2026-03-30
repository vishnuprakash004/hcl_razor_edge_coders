package com.foodiehub.service;
import com.foodiehub.dto.AuthDto.*;
import com.foodiehub.entity.User;
import com.foodiehub.repository.UserRepository;
import com.foodiehub.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;
    public AuthService(UserRepository repo, PasswordEncoder encoder, AuthenticationManager am, JwtUtil jwt, UserDetailsService uds, EmailService emailService) {
        this.userRepository = repo; this.passwordEncoder = encoder; this.authenticationManager = am; this.jwtUtil = jwt; this.userDetailsService = uds; this.emailService = emailService;
    }
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) throw new RuntimeException("Email already exists");
        User user = new User(req.getName(), req.getEmail(), passwordEncoder.encode(req.getPassword()), User.Role.CUSTOMER, 0);
        userRepository.save(user);
        UserDetails ud = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        
        // Send Welcome Email
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        
        return new AuthResponse(token, user.getName(), user.getRole().name());
    }
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        UserDetails ud = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getRole().name());
    }
}