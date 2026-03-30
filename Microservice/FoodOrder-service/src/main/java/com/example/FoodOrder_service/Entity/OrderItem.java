package com.example.FoodOrder_service.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class OrderItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long orderId;
	private Long foodId;
	private int quantity;
	private Double price;
	public OrderItem() {
		
	}
	public OrderItem(Long orderId, Long foodId, int quantity,Double price) {
		
		this.orderId = orderId;
		this.foodId = foodId;
		this.quantity = quantity;
		this.price = price;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getOrderId() {
		return orderId;
	}
	public void setOrderId(Long orderId) {
		this.orderId = orderId;
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
