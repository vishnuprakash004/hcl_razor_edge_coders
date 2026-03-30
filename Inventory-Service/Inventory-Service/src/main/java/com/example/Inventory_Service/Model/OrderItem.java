package com.example.Inventory_Service.Model;

public class OrderItem {
private int quantity;
private Long foodId;

public OrderItem() {}
public OrderItem(int quantity, Long foodId) {
	this.quantity = quantity;
	this.foodId = foodId;
}
public int getQuantity() {
	return quantity;
}
public void setQuantity(int quantity) {
	this.quantity = quantity;
}
public Long getFoodid() {
	return foodId;
}
public void setFoodid(Long foodId) {
	this.foodId = foodId;
}
}
