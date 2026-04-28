package com.example.forquiz.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

@Service
public class TestService {
    private final JdbcTemplate jdbcTemplate;

    public TestService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveTestData(Long userId, String type, String testData) {
        String sql = "SELECT save_test_data(?, ?, ?::jsonb)";
        System.out.println(type);
        jdbcTemplate.execute(sql, (PreparedStatementCallback<Object>) ps -> {
            ps.setLong(1, userId);
            ps.setString(2, type);
            ps.setString(3, testData);
            ps.execute();
            return null;
        });
    }

    public String getTestInfo(int testId) {
        String sql = "SELECT get_test_info(?)::text";
        return jdbcTemplate.queryForObject(sql, new Object[]{testId}, String.class);
    }


    public void addTestResult(Integer testId, Integer userId, String userName, Integer totalScore, String resultsJson) {
        String sql = "SELECT add_test_result(?, ?, ?, ?, ?::jsonb)";

        jdbcTemplate.execute(sql, (PreparedStatementCallback<Object>) ps -> {
            ps.setInt(1, testId);
            if (userId == null) {
                ps.setNull(2, Types.INTEGER);
                ps.setString(3, "Гость");
            } else {
                ps.setInt(2, userId);
                ps.setString(3, userName);
            }

            ps.setInt(4, totalScore);
            ps.setString(5, resultsJson);
            ps.execute();
            return null;
        });
    }




}


