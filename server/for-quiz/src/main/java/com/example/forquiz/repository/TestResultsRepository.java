package com.example.forquiz.repository;


import com.example.forquiz.Entity.TestResultsEntity;
import com.example.forquiz.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultsRepository extends JpaRepository<TestResultsEntity, Integer> {


    @Query(
            value = "select * from  test_results where test_id = :test_id",
            nativeQuery = true
    )
    List<TestResultsEntity> findAll(@Param("test_id")int test_id);


    @Modifying
    @Query(
            value = "delete from test_results where result_id =  :result_id",
            nativeQuery = true
    )
    void delete(@Param("result_id") Integer test_id);



}
