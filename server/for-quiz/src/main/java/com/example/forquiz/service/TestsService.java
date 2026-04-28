package com.example.forquiz.service;



import com.example.forquiz.Entity.TestsEntity;
import com.example.forquiz.Entity.UsersEntity;
import com.example.forquiz.repository.TestsRepository;
import com.example.forquiz.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class TestsService {

    private final TestsRepository testsRepository;


    public TestsService(TestsRepository testsRepository) {
        this.testsRepository =testsRepository;
    }


    public List<TestsEntity> findAll(int user_id) {return testsRepository.findAll(user_id);}

    public List<TestsEntity> findAllTests() {return testsRepository.findAllTests();}

    public ResponseEntity<Map<String, String>> delete(Integer test_id){
        try {

            testsRepository.delete( test_id);
            Map<String, String> okMap = new HashMap<>();
            okMap.put("ok", "test deleted");
            return ResponseEntity.ok(okMap);
        }catch (DataIntegrityViolationException e){
            Map<String,String> errorMap=new HashMap<>();
            errorMap.put("error", "incorrect input");
            return ResponseEntity.badRequest().body(errorMap);
        }
    }

}
