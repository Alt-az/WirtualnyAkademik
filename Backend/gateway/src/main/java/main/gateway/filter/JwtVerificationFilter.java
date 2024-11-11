package main.gateway.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


import java.io.IOException;

@Component
public class JwtVerificationFilter extends OncePerRequestFilter {

    @Value("${spring.cloud.gateway.mvc.routes[0].uri}")  // URL do serwisu zabezpieczeń
    private String securityServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate(); // Do komunikacji HTTP

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String requestURI = request.getRequestURI();
        System.out.println("Authorization header: " + authorizationHeader);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ") && !requestURI.equals("/security/login") && !requestURI.equals("/security/register")) {
            String token = authorizationHeader.substring(7);

            try {
                // Sprawdzamy token u zewnętrznego serwisu zabezpieczeń
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + token);

                HttpEntity<String> entity = new HttpEntity<>(headers);
                ResponseEntity<String> securityResponse = restTemplate.exchange(
                        securityServiceUrl + "/security/validate-token",  // Endpoint do weryfikacji tokenu
                        HttpMethod.POST,
                        entity,
                        String.class
                );

                if (securityResponse.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Token is valid");
                    // Token jest poprawny - kontynuuj łańcuch filtrowania
                    chain.doFilter(request, response);
                } else {
                    // Token niepoprawny - zwróć błąd
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                }
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed");
            }
        } else {
            System.out.println("login or register");
            if(requestURI.equals("/security/login") || requestURI.equals("/security/register")) {
                chain.doFilter(request, response);
                return;
            }
            // Brak tokenu - zwróć błąd
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing or invalid");
        }
    }
}
