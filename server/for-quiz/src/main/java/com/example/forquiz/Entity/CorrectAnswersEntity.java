package com.example.forquiz.Entity;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "correct_answers", schema = "public", catalog = "quiz_platform")
public class CorrectAnswersEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "answer_id")
    private int answerId;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuestionsEntity questionId;

    @Column(name = "correct_answer_indices", columnDefinition = "TEXT[]")
    @Convert(converter = StringArrayConverter.class)
    private String[] correctAnswerIndices;

    public void setAnswerId(int answerId) {
        this.answerId = answerId;
    }

    public void setQuestionId(QuestionsEntity questionId) {
        this.questionId = questionId;
    }

    public void setCorrectAnswerIndices(String[] correctAnswerIndices) {
        this.correctAnswerIndices = correctAnswerIndices;
    }
}
