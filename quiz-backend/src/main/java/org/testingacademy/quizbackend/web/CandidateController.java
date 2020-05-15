package org.testingacademy.quizbackend.web;

import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.testingacademy.quizbackend.model.CandidateModel;
import org.testingacademy.quizbackend.repository.CandidateRepository;
import org.testingacademy.quizbackend.service.JWTService;

import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@CrossOrigin(origins = "*")
@RestController
public class CandidateController {

  @Autowired
  private JWTService jwt;

  @Autowired
  private CandidateRepository candidateRepository;

  @RequestMapping(value = "candidate-list", method = RequestMethod.GET)
  public List<CandidateModel> candidateList() {
    return candidateRepository.findAll();
  }

  private final static char[] PinAlphabet = "123456789BCDFHJKLMNPRSTVXZ".toCharArray();
  private final static int PinLength = 16;

  public static String generateCode() {
    Random randomGenerator = new Random(System.currentTimeMillis());
    return IntStream.range(0, PinLength)
      .mapToObj(a -> PinAlphabet[randomGenerator.nextInt(PinAlphabet.length)])
      .reduce(new StringBuilder(),
        (a, b) -> a.append(b),
        (a, b) -> a.append(b)).toString();
  }

  @RequestMapping(value = "candidate-edit", method = RequestMethod.POST)
  public String candidateEdit(@RequestBody CandidateModel candidateModelDto) {

    CandidateModel candidateModel = candidateModelDto.getId() != null ?
      candidateRepository.findById(candidateModelDto.getId()).get() : candidateModelDto;

    candidateModel.setFirstName(candidateModelDto.getFirstName());
    candidateModel.setLastName(candidateModelDto.getLastName());
    candidateModel.setEmail(candidateModelDto.getEmail());
    candidateModel.setAssigmnetId(candidateModelDto.getAssigmnetId());

    if (candidateModel.getCode() == null) {
      candidateModel.setCode(generateCode());
    }
    candidateRepository.save(candidateModel);
    return "";
  }

  @Data
  @ToString
  private static class IdDto {
    private Long id;
  }

  @RequestMapping(value = "candidate-delete", method = RequestMethod.POST)
  public String candidateDelete(@RequestBody IdDto idDto) {
    candidateRepository.deleteById(idDto.getId());
    return "";
  }
}
