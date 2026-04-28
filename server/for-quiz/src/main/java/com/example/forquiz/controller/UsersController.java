package com.example.forquiz.controller;


import com.example.forquiz.Entity.CorrectAnswersEntity;
import com.example.forquiz.Entity.UsersEntity;
import com.example.forquiz.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost", "*"})public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("/find")
    public ResponseEntity<Map<String, String>> findUsernameByEmailAndPassword(@RequestParam String email, @RequestParam String password) {
        System.out.println("email "+email);
        String username = usersService.findUsernameByEmailAndPassword(email, password);
        System.out.println("username "+username);

        if (username != null && !username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("username", username);
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unauthorized");
            return ResponseEntity.ok(response);
        }
    }


    @GetMapping("/find-user")
    public List<UsersEntity> findAll(@RequestParam String email, @RequestParam String password){
        return usersService.findAll(email, password);
    }


    @PostMapping("/registration")
    public ResponseEntity<Map<String, String>> Registration(@RequestParam String username, @RequestParam String password,@RequestParam String email) {

       boolean findEmail= usersService.findEmail(email);

       if (findEmail){
           Map<String, String> response = new HashMap<>();
           response.put("error", "Email is already in use");
           return ResponseEntity.ok(response);
       }else {
           usersService.saveUser(username,password,email);
           Map<String, String> response = new HashMap<>();
           response.put("ok", "The user has been added");
           return ResponseEntity.ok(response);
       }


    }


}
