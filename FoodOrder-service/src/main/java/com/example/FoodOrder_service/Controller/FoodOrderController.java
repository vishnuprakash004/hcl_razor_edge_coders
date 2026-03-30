package com.example.FoodOrder_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FoodOrder_service.Service.FoodOrderService;

@RestController
@RequestMapping("/orders")
public class FoodOrderController {
	@Autowired
	private FoodOrderService foodOrderService;

	@PostMapping("/place")
	public String placeOrder(
	        @RequestHeader("userId") Long userId,
	        @RequestHeader("email") String email) {
	    return foodOrderService.placeOrder(userId, email);
	}

}
