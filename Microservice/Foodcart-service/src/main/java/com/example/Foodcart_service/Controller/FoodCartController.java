package com.example.Foodcart_service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Foodcart_service.Entity.FoodCart;
import com.example.Foodcart_service.Service.FoodCartService;

@RestController
@RequestMapping("/cart")
public class FoodCartController {
	@Autowired
	private FoodCartService foodCartService;
	
	@PostMapping("/add")
	public FoodCart addToCart(@RequestHeader Long UserId, @RequestBody FoodCart foodCart) {
		return foodCartService.addToCart(foodCart);
	}
	@GetMapping("/user/{userId}")
	public List<FoodCart> getCartItemsByUserId(@PathVariable Long userId) {
		return foodCartService.getCartItemsByUserId(userId);
	}
	@DeleteMapping("/clear/{userId}")
	public void clearCartByUserId(@PathVariable Long userId) {
		foodCartService.clearCartByUserId(userId);
	}

}
