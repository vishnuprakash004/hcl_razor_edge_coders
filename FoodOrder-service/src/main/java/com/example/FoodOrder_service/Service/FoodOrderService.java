package com.example.FoodOrder_service.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FoodOrder_service.Entity.Order;
import com.example.FoodOrder_service.Entity.OrderItem;
import com.example.FoodOrder_service.Repository.FoodOrderItemRepository;
import com.example.FoodOrder_service.Repository.FoodOrderRepository;
import com.example.FoodOrder_service.feign.CartClient;
import com.example.FoodOrder_service.feign.InventoryClient;
import com.example.FoodOrder_service.model.FoodCart;

@Service
public class FoodOrderService {
	@Autowired
	private FoodOrderRepository foodOrderRepository;
	@Autowired
	private FoodOrderItemRepository foodOrderItemRepository;
	@Autowired
	private CartClient cartClient;
	@Autowired
	private InventoryClient inventoryClient;
	@Autowired
	private EmailService emailService;
	
	public String placeOrder(Long userId, String email) {

        // 1. Get cart items
        List<FoodCart> cartItems = cartClient.getCartItemsByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 2. Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("PLACED");

        order = foodOrderRepository.save(order);

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (FoodCart c : cartItems) {

            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setFoodId(c.getFoodId());
            item.setQuantity(c.getQuantity());

            item.setPrice(100.0);

            total += item.getPrice() * item.getQuantity();

            orderItems.add(item);
            foodOrderItemRepository.save(item);
        }

        inventoryClient.reduceStock(orderItems);

        cartClient.clearCartByUserId(userId);

        order.setTotalAmount(total);
        foodOrderRepository.save(order);
        String emailText = "Your order has been placed successfully!\n"
                + "Order ID: " + order.getId()
                + "\nTotal Amount: " + total;

        emailService.sendOrderEmail(email, emailText);


        return "Order placed successfully!";
     // AFTER order saved

            }
}