package com.example.forquiz.repository;


import com.example.forquiz.Entity.CorrectAnswersEntity;
import com.example.forquiz.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, Integer> {

    @Query(
            value = "SELECT * FROM users WHERE email = :email AND password = :password",
            nativeQuery = true
    )
    String findUsernameByEmailAndPassword(@Param("email")String email,@Param("password") String password);

    @Query(
            value = "SELECT * FROM users WHERE email = :email AND password = :password",
            nativeQuery = true
    )
    List<UsersEntity> findAll(@Param("email")String email, @Param("password") String password);


    @Query(
            value = "SELECT EXISTS (SELECT 1 FROM users WHERE email = :email ) AS email_exists",
            nativeQuery = true
    )
    boolean findEmail(@Param("email")String email);

    @Modifying
    @Query(
            value = "INSERT INTO public.users (username, password, email) VALUES (:username, :password, :email)",
            nativeQuery = true
    )
    void saveUser(@Param("username")String username,@Param("password")String password,@Param("email")String email);
}
