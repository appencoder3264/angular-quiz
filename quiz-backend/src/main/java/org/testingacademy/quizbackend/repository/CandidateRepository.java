package org.testingacademy.quizbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingacademy.quizbackend.model.CandidateModel;

@Repository
public interface CandidateRepository extends JpaRepository<CandidateModel, Long> {
  CandidateModel findByCode(String code);
}
