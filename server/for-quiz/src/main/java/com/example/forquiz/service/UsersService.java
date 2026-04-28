package com.example.forquiz.service;



import com.example.forquiz.Entity.CorrectAnswersEntity;
import com.example.forquiz.Entity.UsersEntity;
import com.example.forquiz.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;


    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public String findUsernameByEmailAndPassword(String email, String password){

        return usersRepository.findUsernameByEmailAndPassword(email,password);
    }
    public boolean findEmail(String email){
        return usersRepository.findEmail(email);
    }

    public List<UsersEntity> findAll(String email,String password) {return usersRepository.findAll(email,password);}

    public void saveUser(String username, String password, String email){
        usersRepository.saveUser(username, password, email);
    }

}
