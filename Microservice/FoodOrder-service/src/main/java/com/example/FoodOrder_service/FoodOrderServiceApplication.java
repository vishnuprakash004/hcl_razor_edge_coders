package com.example.FoodOrder_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
@EnableFeignClients
@SpringBootApplication
public class FoodOrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodOrderServiceApplication.class, args);
	}

}
