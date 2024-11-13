package main.security.service;

import main.security.model.RecaptchaResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private static final String SECRET_KEY = "6LdSuX0qAAAAAGdQqGZVKbkN1iPkiIx0hHJghQu-";

    public boolean verifyCaptcha(String recaptchaToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = RECAPTCHA_VERIFY_URL + "?secret=" + SECRET_KEY + "&response=" + recaptchaToken;

        RecaptchaResponse response = restTemplate.postForObject(url, null, RecaptchaResponse.class);

        if (response != null) {
            System.out.println("Recaptcha response: " + response);
        } else {
            System.out.println("Recaptcha response is null.");
        }

        return response != null && response.isSuccess();
    }
}
