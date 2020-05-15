package org.testingacademy.quizbackend.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.testingacademy.quizbackend.model.AssignmentItemModel;
import org.testingacademy.quizbackend.model.AssignmentModel;
import org.testingacademy.quizbackend.model.CandidateModel;
import org.testingacademy.quizbackend.model.QuizResultsModel;
import org.testingacademy.quizbackend.repository.*;

import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
public class QuizController {
  private static Logger logger = LoggerFactory.getLogger(QuizController.class);

  @Autowired
  private AssignmentItemRepository assignmentItemRepository;
  @Autowired
  private AssignmentRepository assignmentRepository;
  @Autowired
  private ChoiceRepository choiceRepository;
  @Autowired
  private CandidateRepository candidateRepository;
  @Autowired
  private QuizResultsRepository quizResultsRepository;

  @Data
  private static class CodeDto {
    private String code;
  }

  @RequestMapping(value = "quiz", method = RequestMethod.POST)
  public AssignmentAdminController.AssingmentDto quiz(@RequestBody CodeDto codeDto) {
    logger.info(" quiz for " + codeDto.getCode());

    CandidateModel byCode = candidateRepository.findByCode(codeDto.getCode());
    if (byCode.getResult() != null) {
      throw new IllegalStateException("already taken");
    }

    AssignmentModel assignmentModel = assignmentRepository.findById(byCode.getAssigmnetId()).get();

    List<AssignmentAdminController.AssingmentItemsDto> assignmentItems =
      assignmentItemRepository.findByAssignmentId(assignmentModel.getId()).stream()
        .map(it -> {
          List<AssignmentAdminController.ValueDto> choices = choiceRepository.findByAssignmentItemId(it.getId())
            .stream().map(a -> new AssignmentAdminController.ValueDto(a.getValue())).collect(Collectors.toList());
          return new AssignmentAdminController.AssingmentItemsDto(null, it.getQuestion(),
            choices);
        }).collect(Collectors.toList());
    return new AssignmentAdminController.AssingmentDto(assignmentModel.getId(), assignmentModel.getName(), assignmentItems);
  }

  @Data
  private static class QuizSubmitDto {
    private String code;
    private Map<Integer, Integer> answers;
  }

  private List<Integer> calcCorrect(Long assignmentId, Map<Integer, Integer> answers) {
    List<AssignmentItemModel> items = assignmentItemRepository.findByAssignmentId(assignmentId);

    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < items.size(); i++) {
      Integer a = answers.get(i);
      items.get(i).getCorrectAnswer();
      res.add(items.get(i).getCorrectAnswer() == a ? 1 : 0);
    }
    return res;
  }

  @RequestMapping(value = "quiz-submit", method = RequestMethod.POST)
  public String quizSubmit(@RequestBody QuizSubmitDto quizSubmitDto) {
    CandidateModel byCode = candidateRepository.findByCode(quizSubmitDto.getCode());
    logger.info(" quizSubmit user " + byCode);
    List<Integer> res = calcCorrect(byCode.getAssigmnetId(), quizSubmitDto.getAnswers());

    double score = res.stream().reduce(Integer::sum).get() / ((float) res.size());
    byCode.setResult(score * 100);
    byCode.setTaken(new Date(new java.util.Date().getTime()));
    candidateRepository.save(byCode);

    quizSubmitDto.getAnswers().forEach(
      (k, v) -> quizResultsRepository.save(new QuizResultsModel(
        null, byCode.getAssigmnetId(), quizSubmitDto.getCode(), k, v)));
    return "";
  }

  @Data
  @AllArgsConstructor
  private static class QuizResultsDto {
    private String name;
    private List<Integer> results;
  }

  @RequestMapping(value = "quiz-result", method = RequestMethod.GET)
  public QuizResultsDto quizResult(@RequestParam String code) {
    Map<Integer, Integer> answers = quizResultsRepository.findByCode(code).stream()
      .collect(Collectors.toMap(QuizResultsModel::getNb, QuizResultsModel::getChoice,
        (a1,a2) -> a2));
    CandidateModel byCode = candidateRepository.findByCode(code);
    AssignmentModel assignmentModel = assignmentRepository.findById(byCode.getAssigmnetId()).get();

    return new QuizResultsDto(assignmentModel.getName(), calcCorrect(byCode.getAssigmnetId(), answers));
  }
}
