package main.security.service;

import main.security.model.RecaptchaResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private static final String SECRET_KEY = "6LdSuX0qAAAAAGdQqGZVKbkN1iPkiIx0hHJghQu-";

    public boolean verifyCaptcha(String recaptchaToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = RECAPTCHA_VERIFY_URL;

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", SECRET_KEY);
        requestBody.add("response", recaptchaToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<RecaptchaResponse> responseEntity = restTemplate.postForEntity(url, requestEntity, RecaptchaResponse.class);

        RecaptchaResponse response = responseEntity.getBody();

        if (response != null) {
            System.out.println("Recaptcha response: " + response);
        } else {
            System.out.println("Recaptcha response is null.");
        }

        return response != null && response.isSuccess();
    }
}
