package org.testingacademy.quizbackend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

@Service
public class JWTService {
  @Value("topSecret")
  private String secret;

  public String issueToken(String userName) {
    java.util.Calendar exp = java.util.Calendar.getInstance();
    exp.add(Calendar.MONTH, 10);

    Algorithm algorithm = Algorithm.HMAC256(secret);
    String token = JWT.create()
      .withClaim("name", userName)
      .withIssuedAt(new Date())
      .withExpiresAt(exp.getTime())
      .withIssuer("quiz")
      .sign(algorithm);

    return token;
  }

  public boolean verify(ServletRequest request, ServletResponse response) {
    try {
      String token = ((HttpServletRequest) request).getHeader("Authorization");
      Algorithm algorithm = Algorithm.HMAC256(secret);
      JWTVerifier verifier = JWT.require(algorithm)
        .withIssuer("quiz")
        .build(); //Reusable verifier instance
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException exception) {
      try {
        ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
      } catch (IOException e) {
      }
      return false;
    }
  }
}
