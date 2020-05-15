package org.testingacademy.quizbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Table(name = "choice")
@AllArgsConstructor
@NoArgsConstructor
public class ChoiceModel {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private Long assignmentItemId;

  @Column
  private String value;
}
