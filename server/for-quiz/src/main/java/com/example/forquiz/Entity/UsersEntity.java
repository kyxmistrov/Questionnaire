package com.example.forquiz.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users", schema = "public", catalog = "quiz_platform")
public class UsersEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "user_id")
    private int userId;
    @Basic
    @Column(name = "username")
    private String username;
    @Basic
    @Column(name = "password")
    private String password;
    @Basic
    @Column(name = "email")
    private String email;


    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TestResultsEntity> testResults;

    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TestsEntity> tests;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<TestResultsEntity> getTestResults() {
        return testResults;
    }

    public void setTestResults(List<TestResultsEntity> testResults) {
        this.testResults = testResults;
    }

    public List<TestsEntity> getTests() {
        return tests;
    }

    public void setTests(List<TestsEntity> tests) {
        this.tests = tests;
    }
}
