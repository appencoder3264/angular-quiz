package org.testingacademy.quizbackend.web;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.testingacademy.quizbackend.model.AssignmentItemModel;
import org.testingacademy.quizbackend.model.AssignmentModel;
import org.testingacademy.quizbackend.model.ChoiceModel;
import org.testingacademy.quizbackend.repository.AssignmentItemRepository;
import org.testingacademy.quizbackend.repository.AssignmentRepository;
import org.testingacademy.quizbackend.repository.ChoiceRepository;
import org.testingacademy.quizbackend.service.JWTService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
public class AssignmentAdminController {

  private static Logger logger = LoggerFactory.getLogger(AssignmentAdminController.class);

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class AssingmentDto {
    private Long id;
    @JsonProperty(required = true)
    private String name;
    private List<AssingmentItemsDto> items;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class ValueDto {
    private String value;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class AssingmentItemsDto {
    private Integer answer;
    private String question;
    private List<ValueDto> choices;
  }

  @Autowired
  private JWTService jwt;

  @Autowired
  private AssignmentItemRepository assignmentItemRepository;
  @Autowired
  private AssignmentRepository assignmentRepository;
  @Autowired
  private ChoiceRepository choiceRepository;

  @RequestMapping(value = "assignment", method = RequestMethod.GET)
  public AssingmentDto assignment(@RequestParam Long id,
                                  HttpServletRequest request, HttpServletResponse response) {
    if (!jwt.verify(request, response)) {
      return null;
    }

    logger.info("loading assignment for " + id);
    AssignmentModel assignmentModel = assignmentRepository.findById(id).get();

    List<AssingmentItemsDto> assignmentItems =
      assignmentItemRepository.findByAssignmentId(assignmentModel.getId()).stream()
        .map(it -> {
          List<ValueDto> choices = choiceRepository.findByAssignmentItemId(it.getId())
            .stream().map(a -> new ValueDto(a.getValue())).collect(Collectors.toList());
          return new AssingmentItemsDto(it.getCorrectAnswer(), it.getQuestion(),
            choices);
        }).collect(Collectors.toList());
    return new AssingmentDto(assignmentModel.getId(), assignmentModel.getName(), assignmentItems);
  }


  @RequestMapping(value = "save-questions", method = RequestMethod.POST)
  public String saveQuestionsDto(@RequestBody AssingmentDto param,
                                 HttpServletRequest request, HttpServletResponse response) {
    if (!jwt.verify(request, response)) {
      return null;
    }
    logger.info("save-questions" + param);
    // delete
    assignmentItemRepository.findByAssignmentId(param.getId()).forEach(it -> {
      choiceRepository.findByAssignmentItemId(it.getId())
        .forEach(c -> choiceRepository.deleteById(c.getId()));
      assignmentItemRepository.deleteById(it.getId());
    });
    // repopulate
    param.items.forEach(it -> {
      Long savedId = assignmentItemRepository.save(
        new AssignmentItemModel(null, param.getId(), it.getQuestion(), it.getAnswer())).getId();

      it.choices.forEach(c -> choiceRepository.save(new ChoiceModel(null, savedId, c.getValue())));
    });
    return "";
  }


  @Data
  @ToString
  private static class IdDto {
    private Long id;
  }

  @Data
  @AllArgsConstructor
  @ToString
  private static class AssingmentShortDto {
    private Long id;
    private String name;
    @JsonProperty(required = true)
    private String changeDate;
    @JsonProperty(required = true)
    private String changedBy;
  }

  private SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");

  @RequestMapping(value = "assignment-list", method = RequestMethod.GET)
  public List<AssingmentShortDto> assignmentList(HttpServletRequest request, HttpServletResponse response) {
    if (!jwt.verify(request, response)) {
      return null;
    }
    logger.info("loading assignment list ");
    return assignmentRepository.findAll().stream()
      .map(a -> new AssingmentShortDto(a.getId(), a.getName(),
        format.format(a.getChangeDate()), a.getChangedBy()))
      .collect(Collectors.toList());
  }

  @RequestMapping(value = "assignment-desc-delete", method = RequestMethod.POST)
  public String assignmentDelete(@RequestBody IdDto param, HttpServletRequest request, HttpServletResponse response) {
    if (!jwt.verify(request, response)) {
      return null;
    }
    logger.info("assignment-desc-delete " + param);
    assignmentRepository.deleteById(param.getId());
    return "";
  }

  @RequestMapping(value = "assignment-desc-edit", method = RequestMethod.POST)
  public String assignmentEdit(@RequestBody AssingmentShortDto param, HttpServletRequest request, HttpServletResponse response) {
    if (!jwt.verify(request, response)) {
      return null;
    }
    logger.info("assignment-desc-edit " + param);
    AssignmentModel assignmentModel = param.getId() != null ?
      assignmentRepository.findById(param.getId()).get() : new AssignmentModel();

    assignmentModel.setChangeDate(new Date(new java.util.Date().getTime()));
    assignmentModel.setChangedBy("admin");
    assignmentModel.setName(param.getName());
    assignmentRepository.save(assignmentModel);
    return "";
  }
}
