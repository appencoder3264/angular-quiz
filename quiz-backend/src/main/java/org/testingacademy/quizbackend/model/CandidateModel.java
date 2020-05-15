package org.testingacademy.quizbackend.model;

import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name = "candidate")
@ToString
public class CandidateModel {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private String firstName;

  @Column
  private String lastName;

  @Column
  private String email;

  @Column
  private Date taken;

  @Column
  private Double result;

  @Column
  private Long assigmnetId;

  @Column
  private String code;

}
