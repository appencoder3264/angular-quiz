package org.testingacademy.quizbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingacademy.quizbackend.model.ChoiceModel;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<ChoiceModel, Long> {
  List<ChoiceModel> findByAssignmentItemId(Long assignmentItemId);
}
