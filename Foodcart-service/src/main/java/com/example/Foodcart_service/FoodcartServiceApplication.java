package com.example.Foodcart_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
@EnableFeignClients
@SpringBootApplication
public class FoodcartServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodcartServiceApplication.class, args);
	}

}
