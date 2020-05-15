package org.testingacademy.quizbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingacademy.quizbackend.model.QuizResultsModel;

import java.util.List;

@Repository
public interface QuizResultsRepository extends JpaRepository<QuizResultsModel, Long> {
  List<QuizResultsModel> findByCode(String code);
}
