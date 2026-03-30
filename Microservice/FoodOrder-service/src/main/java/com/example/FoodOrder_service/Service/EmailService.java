package com.example.FoodOrder_service.Service;

	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.mail.SimpleMailMessage;
	import org.springframework.mail.javamail.JavaMailSender;
	import org.springframework.stereotype.Service;

	@Service
	public class EmailService {

	    @Autowired
	    private JavaMailSender mailSender;

	    public void sendOrderEmail(String toEmail, String messageText) {

	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(toEmail);
	        message.setSubject("Order Confirmation");
	        message.setText(messageText);

	        mailSender.send(message);
	    }
	}


