package com.example.forquiz.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "questions", schema = "public", catalog = "quiz_platform")
public class QuestionsEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "question_id")
    private int questionId;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestsEntity testId;
    @Basic
    @Column(name = "question_order")
    private int questionOrder;
    @Basic
    @Column(name = "type")
    private String type;
    @Basic
    @Column(name = "question_text")
    private String questionText;


    @OneToMany(mappedBy = "questionId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CorrectAnswersEntity> correct_unswers;

    @OneToMany(mappedBy = "questionId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OptionsEntity> options;

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public TestsEntity getTestId() {
        return testId;
    }

    public void setTestId(TestsEntity testId) {
        this.testId = testId;
    }

    public int getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<CorrectAnswersEntity> getCorrect_unswers() {
        return correct_unswers;
    }

    public void setCorrect_unswers(List<CorrectAnswersEntity> correct_unswers) {
        this.correct_unswers = correct_unswers;
    }

    public List<OptionsEntity> getOptions() {
        return options;
    }

    public void setOptions(List<OptionsEntity> options) {
        this.options = options;
    }
}
