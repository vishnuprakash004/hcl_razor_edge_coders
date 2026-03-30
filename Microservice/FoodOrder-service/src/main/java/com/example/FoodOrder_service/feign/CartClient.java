package com.example.FoodOrder_service.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.FoodOrder_service.model.FoodCart;

@FeignClient(name = "foodcart-service")
public interface CartClient {
	@GetMapping("/cart/user/{userId}")
	List<FoodCart> getCartItemsByUserId(@PathVariable Long userId);
	@DeleteMapping("/cart/clear/{userId}")
	void clearCartByUserId(@PathVariable Long userId);

}
