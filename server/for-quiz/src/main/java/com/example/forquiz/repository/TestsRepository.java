package com.example.forquiz.repository;


import com.example.forquiz.Entity.TestsEntity;
import com.example.forquiz.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestsRepository extends JpaRepository<TestsEntity, Integer> {



    @Query(
            value = "SELECT * FROM tests WHERE user_id = :user_id",
            nativeQuery = true
    )
    List<TestsEntity> findAll(@Param("user_id")int user_id);


    @Query(
            value = "SELECT * FROM tests",
            nativeQuery = true
    )
    List<TestsEntity> findAllTests();


    @Modifying
    @Query(
            value = "delete from tests where test_id =  :test_id",
            nativeQuery = true
    )
    void delete(@Param("test_id") Integer test_id);

}
