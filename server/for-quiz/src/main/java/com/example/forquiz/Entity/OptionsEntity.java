package com.example.forquiz.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "options", schema = "public", catalog = "quiz_platform")
public class OptionsEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "option_id")
    private int optionId;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuestionsEntity questionId;

    @Column(name = "option_text", columnDefinition = "TEXT[]")
    @Convert(converter = StringArrayConverter.class)
    private String[] optionText;

    public int getOptionId() {
        return optionId;
    }

    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }

    public QuestionsEntity getQuestionId() {
        return questionId;
    }

    public void setQuestionId(QuestionsEntity questionId) {
        this.questionId = questionId;
    }

    public String[] getOptionText() {
        return optionText;
    }

    public void setOptionText(String[] optionText) {
        this.optionText = optionText;
    }
}
