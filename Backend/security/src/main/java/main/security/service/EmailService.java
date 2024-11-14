package main.security.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    public void sendMail(String receiver, String content, String subject) throws MessagingException {
        MimeMessage mail = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mail, true);
        mail.setFrom("Wirtualny-akademik");
        helper.setTo("krongjacobs@gmail.com");
        mail.setSubject("Activate account");
        String link = "http://localhost:8081/validate/" + content;
        String htmlMsg = "Link aktywacyjny: <a href=\"" + link + "\">" + link + "</a>";
        helper.setText(htmlMsg, true);
        javaMailSender.send(mail);
    }
}
