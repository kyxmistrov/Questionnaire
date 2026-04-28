package com.example.forquiz.controller;


import com.example.forquiz.Entity.TestsEntity;
import com.example.forquiz.Entity.UsersEntity;
import com.example.forquiz.service.TestsService;
import com.example.forquiz.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost", "*"})public class TestsController {
    private final TestsService testsService;

    public TestsController(TestsService testsService) {
        this.testsService = testsService;
    }

    @GetMapping("/find")
    public List<TestsEntity> findAll(@RequestParam int user_id){
        return testsService.findAll(user_id);
    }

    @GetMapping("/find-all")
    public List<TestsEntity> findAllTests(){
        return testsService.findAllTests();
    }

    @DeleteMapping("/delete/{test_id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable  Integer test_id) {
        return testsService.delete(test_id);
    }


}
