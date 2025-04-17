package com.example.programchair.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.programchair.Model.User;
import com.example.programchair.Model.LoginRequest;
import com.example.programchair.Repository.UserRepository;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User savedUser = userRepository.save(user);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", savedUser.getId());
        return response;
    }

    public Map<String, Object> loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real application, you should use password encryption
        if (!loginRequest.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-token-" + user.getId()); // In real app, generate JWT token
        response.put("user", user);
        return response;
    }
}
