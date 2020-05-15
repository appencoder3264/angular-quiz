package org.testingacademy.quizbackend.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.testingacademy.quizbackend.model.UserModel;
import org.testingacademy.quizbackend.repository.UserRepository;
import org.testingacademy.quizbackend.service.JWTService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "*")
@RestController
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JWTService jwt;


  @Data
  private static class UserPwdChgDto {
    private String userName;
    private String oldPassword;
    private String newPassword;
  }


  @RequestMapping(value = "password-change", method = RequestMethod.POST)
  public ResponseEntity<Void> changePassword(@RequestBody UserPwdChgDto user,
                                             HttpServletResponse response) throws NoSuchAlgorithmException, IOException {

    String hNewPwd = h256(user.getNewPassword());
    String hOldPwd = h256(user.getOldPassword());
    UserModel byUserName = userRepository.findByUserName(user.getUserName()).stream()
      .findFirst().orElseThrow(() -> new IllegalArgumentException("no such user"));
    if (!byUserName.getPassword().equals(hOldPwd)) {
      response.sendError(403, "old password does not match");
      return null;
    }
    byUserName.setPassword(hNewPwd);
    userRepository.save(byUserName);
    return new ResponseEntity<>((HttpStatus.OK));
  }


  @Data
  @AllArgsConstructor
  private static class Token {
    private String userName;
    private String token;

  }

  @Data
  private static class UserDto {
    private String userName;
    private String password;
  }

  @RequestMapping(value = "auth/login", method = RequestMethod.POST)
  public Token login(@RequestBody UserDto user, HttpServletResponse response)
    throws NoSuchAlgorithmException, IOException {
    String hPwd = h256(user.getPassword());
    UserModel byUserName = userRepository.findByUserName(user.getUserName()).stream()
      .findFirst().orElseGet(() -> getDefUser(user.getUserName()));
    if (!hPwd.equals(byUserName.getPassword())) {
      response.sendError(403, "login incorrect");
      return null;
    }


    return new Token(user.getUserName(), jwt.issueToken((user.getUserName())));
  }


  private UserModel getDefUser(String userName) {
    if ("admin".equals(userName)) {
      try {
        return userRepository
          .save(new UserModel(null, userName, h256("admin")));
      } catch (NoSuchAlgorithmException e) {
        throw new IllegalStateException(e);
      }
    }
    throw new NoSuchElementException("no such user");
  }

  private String h256(String value) throws NoSuchAlgorithmException {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    return Base64.encodeBase64String(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
  }
}
