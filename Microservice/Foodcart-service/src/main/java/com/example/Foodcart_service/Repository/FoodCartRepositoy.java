package com.example.Foodcart_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Foodcart_service.Entity.FoodCart;
@Repository
public interface FoodCartRepositoy extends JpaRepository<FoodCart, Long> {
	List<FoodCart> findByUserId(Long userId);

}
