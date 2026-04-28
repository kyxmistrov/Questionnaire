package com.example.forquiz.controller;

import com.example.forquiz.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost", "*"})
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @PostMapping("/create")
    public void createTest(@RequestParam Long userId, @RequestParam String type, @RequestBody String testData) {
        testService.saveTestData(userId, type, testData);
    }

    @GetMapping("/{testId}")
    public String getTestInfo(@PathVariable int testId) {
        return testService.getTestInfo(testId);
    }


    @PostMapping("/add_test_result")
    public void addTestResult(@RequestBody Map<String, Object> request) {
        Integer test_id = (Integer) request.get("test_id");
        Integer user_id = (Integer) request.get("user_id");


        String user_name = (String) request.get("user_name");
        Integer total_score = (Integer) request.get("total_score");
        String results = (String) request.get("results");

        //System.out.println(test_id + "\n" + user_id + "\n" + user_name + "\n" + total_score + "\n" + results);
        testService.addTestResult(test_id, user_id, user_name, total_score, results);
    }
}

