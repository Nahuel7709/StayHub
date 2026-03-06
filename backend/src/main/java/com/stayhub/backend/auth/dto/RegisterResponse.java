package com.stayhub.backend.auth.dto;

import com.stayhub.backend.users.Role;

public class RegisterResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

    public RegisterResponse() {
    }

    public RegisterResponse(Long id, String firstName, String lastName, String email, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}