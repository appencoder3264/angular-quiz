package org.testingacademy.quizbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingacademy.quizbackend.model.AssignmentItemModel;

import java.util.List;

@Repository
public interface AssignmentItemRepository extends JpaRepository<AssignmentItemModel, Long> {
  List<AssignmentItemModel> findByAssignmentId(Long assignmentid);
}
