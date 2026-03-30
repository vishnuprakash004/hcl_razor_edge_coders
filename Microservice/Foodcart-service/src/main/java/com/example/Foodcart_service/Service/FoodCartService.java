package com.example.Foodcart_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Foodcart_service.Entity.FoodCart;
import com.example.Foodcart_service.Repository.FoodCartRepositoy;

@Service
public class FoodCartService {
	@Autowired
	private FoodCartRepositoy foodCartRepositoy;
	
	public FoodCart addToCart(FoodCart foodCart) {
		return foodCartRepositoy.save(foodCart);
	}
	
	public List<FoodCart> getCartItemsByUserId(Long userId) {
		return foodCartRepositoy.findByUserId(userId);
	}
	
	public void clearCartByUserId(Long userId) {
		List<FoodCart> cartItems = foodCartRepositoy.findByUserId(userId);
		foodCartRepositoy.deleteAll(cartItems);
	}

}
