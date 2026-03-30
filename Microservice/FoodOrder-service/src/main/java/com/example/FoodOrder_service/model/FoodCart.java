package com.example.FoodOrder_service.model;

public class FoodCart {
		private Long id;
	private Long userId;
	private Long foodId;
	private Double price;
	private int quantity;

	public FoodCart() {
		
	}
	public FoodCart(Long userId, Long foodId, int quantity,Double price) {
		
		this.userId = userId;
		this.foodId = foodId;
		this.quantity = quantity;
		this.price = price;
	}
	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getFoodId() {
		return foodId;
	}

	public void setFoodId(Long foodItemId) {
		this.foodId = foodItemId;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	

}
