package com.example.forquiz.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "test_results", schema = "public", catalog = "quiz_platform")
public class TestResultsEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "result_id", nullable = false)
    private int resultId;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestsEntity testId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsersEntity userId;

    @Basic
    @Column(name = "user_name", nullable = true, length = 50)
    private String userName;

    @Basic
    @Column(name = "total_score", nullable = true)
    private Integer totalScore;

    @Convert(converter = JsonConverter.class)
    @Column(name = "results", nullable = true, columnDefinition = "jsonb")
    private Object results;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDate created_at;

    public int getResultId() {
        return resultId;
    }

    public void setResultId(int resultId) {
        this.resultId = resultId;
    }

    public TestsEntity getTestId() {
        return testId;
    }

    public void setTestId(TestsEntity testId) {
        this.testId = testId;
    }

    public UsersEntity getUserId() {
        return userId;
    }

    public void setUserId(UsersEntity userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Object getResults() {
        return results;
    }

    public void setResults(Object results) {
        this.results = results;
    }

    public LocalDate getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDate created_at) {
        this.created_at = created_at;
    }
}
