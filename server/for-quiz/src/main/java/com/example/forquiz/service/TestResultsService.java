package com.example.forquiz.service;



import com.example.forquiz.Entity.TestResultsEntity;
import com.example.forquiz.repository.TestResultsRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class TestResultsService {

    private final TestResultsRepository testResultsService;

    public TestResultsService(TestResultsRepository testResultsService) {
        this.testResultsService = testResultsService;
    }


    public List<TestResultsEntity> findAll(int test_id) {return testResultsService.findAll(test_id);}

    public ResponseEntity<Map<String, String>> delete(Integer result_id){
        try {

            testResultsService.delete(result_id);
            Map<String, String> okMap = new HashMap<>();
            okMap.put("ok", "result deleted");
            return ResponseEntity.ok(okMap);
        }catch (DataIntegrityViolationException e){
            Map<String,String> errorMap=new HashMap<>();
            errorMap.put("error", "incorrect input");
            return ResponseEntity.badRequest().body(errorMap);
        }
    }



}
