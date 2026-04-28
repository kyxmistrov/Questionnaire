package com.example.forquiz.controller;



import com.example.forquiz.Entity.CorrectAnswersEntity;
import com.example.forquiz.service.CorrectAnswersService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/correctAnswers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost", "*"})
public class CorrectAnswersController {
    private final CorrectAnswersService correctAnswers;

    public CorrectAnswersController(CorrectAnswersService correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    @GetMapping("/find/all")
    public List<CorrectAnswersEntity> findAll(){
        System.out.println("ВЫЗЫВАЕТСЯ ДЛЯ ПОИСКА ВСЕГО!!!!");
        return correctAnswers.findAll();
    }


}
