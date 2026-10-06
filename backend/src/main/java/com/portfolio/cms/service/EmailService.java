package com.portfolio.cms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String notifyEmail;

    public EmailService(JavaMailSender mailSender, @Value("${app.contact.notify-email}") String notifyEmail) {
        this.mailSender = mailSender;
        this.notifyEmail = notifyEmail;
    }

    /** Fire-and-forget notification when a new contact message arrives. Failures are logged, never thrown to the caller. */
    public void notifyNewContactMessage(String fromName, String fromEmail, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(notifyEmail);
            mail.setSubject("New portfolio contact message from " + fromName);
            mail.setText("From: " + fromName + " <" + fromEmail + ">\n\n" + message);
            mailSender.send(mail);
        } catch (Exception e) {
            System.err.println("Failed to send contact notification email: " + e.getMessage());
        }
    }
}
