package com.example.forquiz.service;


import com.example.forquiz.Entity.CorrectAnswersEntity;
import com.example.forquiz.repository.CorrectAnswersRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CorrectAnswersService {

    private final CorrectAnswersRepository correctAnswersRepository;


    public CorrectAnswersService(CorrectAnswersRepository correctAnswersRepository) {
        this.correctAnswersRepository = correctAnswersRepository;
    }

    public List<CorrectAnswersEntity> findAll(){return correctAnswersRepository.findAll();}

}
