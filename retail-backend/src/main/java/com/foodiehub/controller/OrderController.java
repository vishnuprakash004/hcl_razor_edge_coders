package com.foodiehub.controller;
import com.foodiehub.service.EmailService;
import com.foodiehub.dto.OrderDto;
import com.foodiehub.entity.Order;
import com.foodiehub.entity.OrderItem;
import com.foodiehub.entity.Product;
import com.foodiehub.entity.User;
import com.foodiehub.repository.OrderRepository;
import com.foodiehub.repository.ProductRepository;
import com.foodiehub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@RestController @RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    public OrderController(OrderRepository or, UserRepository ur, ProductRepository pr, EmailService emailService) { 
        this.orderRepository = or; this.userRepository = ur; this.productRepository = pr; this.emailService = emailService;
    }
    
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderDto.Request req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(req.getDeliveryAddress());
        order.setStatus(Order.OrderStatus.CONFIRMED);
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for(OrderDto.OrderItemDto itemDto : req.getItems()) {
            Product p = productRepository.findById(itemDto.getProductId()).orElseThrow();
            if(p.getStockQuantity() < itemDto.getQuantity()) throw new RuntimeException("Insufficient stock for " + p.getName());
            p.setStockQuantity(p.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(p);
            OrderItem item = new OrderItem();
            item.setProduct(p);
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(p.getPrice());
            items.add(item);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
        }
        order.setItems(items);
        order.setTotalAmount(total);
        if(req.getCouponCode() != null && req.getCouponCode().equals("DISCOUNT10")) {
             order.setDiscountAmount(total.multiply(BigDecimal.valueOf(0.1)));
        }
        orderRepository.save(order);
        
        user.setLoyaltyPoints(user.getLoyaltyPoints() + total.divide(BigDecimal.valueOf(10)).intValue());
        userRepository.save(user);
        
        // Send Order Confirmation Email
        emailService.sendOrderConfirmation(user.getEmail(), order);
        
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserId(user.getId()));
    }
}