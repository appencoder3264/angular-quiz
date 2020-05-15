package org.testingacademy.quizbackend.service;

import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(filterName = "Filter", urlPatterns = {"*assignment*",
  "*candidate*", "save-questions"})
public class JWTFilter implements Filter {
  @Autowired
  private JWTService jwt;

  @Override
  public void doFilter(ServletRequest request,
                       ServletResponse response, FilterChain chain) throws IOException, ServletException {

    if (jwt.verify(request, response)) {
      chain.doFilter(request, response);
    }
  }
}
