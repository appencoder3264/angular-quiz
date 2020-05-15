package org.testingacademy.quizbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Table(name = "results")
@AllArgsConstructor
@NoArgsConstructor
public class QuizResultsModel {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private Long assignmentItemId;

  @Column
  private String code;

  @Column
  private Integer nb;

  @Column
  private Integer choice;
}
