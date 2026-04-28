package com.example.forquiz.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "tests", schema = "public", catalog = "quiz_platform")
public class TestsEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "test_id")
    private int testId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsersEntity userId;
    @Basic
    @Column(name = "title")
    private String title;
    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "type")
    private String type;
    @Basic
    @Column(name = "unique_id")
    private String uniqueId;
    @Basic
    @Column(name = "created_at")
    private Date createdAt;

    @OneToMany(mappedBy = "testId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<QuestionsEntity> questions;

    @OneToMany(mappedBy = "testId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TestResultsEntity> testResults;

    public int getTestId() {
        return testId;
    }

    public void setTestId(int testId) {
        this.testId = testId;
    }

    public UsersEntity getUserId() {
        return userId;
    }

    public void setUserId(UsersEntity userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<QuestionsEntity> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionsEntity> questions) {
        this.questions = questions;
    }

    public List<TestResultsEntity> getTestResults() {
        return testResults;
    }

    public void setTestResults(List<TestResultsEntity> testResults) {
        this.testResults = testResults;
    }
}
