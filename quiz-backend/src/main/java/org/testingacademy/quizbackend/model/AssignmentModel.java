package org.testingacademy.quizbackend.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name = "assignment")
public class AssignmentModel {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private String name;

  @Column
  private Date changeDate;

  @Column
  private String changedBy;

}
