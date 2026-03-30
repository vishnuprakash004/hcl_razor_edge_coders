package com.example.FoodOrder_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.FoodOrder_service.Entity.OrderItem;

@Repository
public interface FoodOrderItemRepository extends JpaRepository<OrderItem, Long> {

}
