package org.testingacademy.quizbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Table(name = "assignment_item")
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentItemModel {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private Long assignmentId;

  @Column
  private String question;

  @Column
  private int correctAnswer;
}
