package com.example.forquiz.repository;


import com.example.forquiz.Entity.CorrectAnswersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CorrectAnswersRepository extends JpaRepository<CorrectAnswersEntity, Integer> {



    @Query(
            value = "select * from public.correct_answers",
            nativeQuery = true
    )
    List<CorrectAnswersEntity> findAll();


}
