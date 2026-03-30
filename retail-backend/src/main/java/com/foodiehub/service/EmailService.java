package com.foodiehub.service;

import com.foodiehub.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject("Welcome to FoodieHub!");
            helper.setText("<h1>Hello " + name + "!</h1><p>Thank you for registering at FoodieHub. Enjoy your pizza and drinks!</p>", true);
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email Error: Could not send Welcome Email. Check SMTP settings. Details: " + e.getMessage());
        }
    }

    public void sendOrderConfirmation(String to, Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject("Order Confirmation - FoodieHub");
            
            StringBuilder content = new StringBuilder();
            content.append("<h1>Order Confirmed!</h1>");
            content.append("<p>Order ID: #").append(order.getId()).append("</p>");
            content.append("<p>Total Amount: $").append(order.getTotalAmount()).append("</p>");
            content.append("<p>Delivery Address: ").append(order.getDeliveryAddress()).append("</p>");
            content.append("<p>We are preparing your delicious meal right now!</p>");
            
            helper.setText(content.toString(), true);
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email Error: Could not send Order Confirmation. Check SMTP settings. Details: " + e.getMessage());
        }
    }
}
