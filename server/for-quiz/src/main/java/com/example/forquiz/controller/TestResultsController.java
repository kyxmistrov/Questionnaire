package com.example.forquiz.controller;


import com.example.forquiz.Entity.TestResultsEntity;
import com.example.forquiz.Entity.TestsEntity;
import com.example.forquiz.service.TestResultsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost", "*"})
public class TestResultsController {
    private final TestResultsService testResultsService;

    public TestResultsController(TestResultsService testResultsService) {
        this.testResultsService = testResultsService;
    }


    @GetMapping("/find")
    public List<TestResultsEntity> findAll(@RequestParam int test_id){
        return testResultsService.findAll(test_id);
    }


    @DeleteMapping("/delete/{result_id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable  Integer result_id) {
        return testResultsService.delete(result_id);
    }
}
