package com.foodiehub.repository;
import com.foodiehub.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Optional<Order> findByUserIdAndStatus(Long userId, Order.OrderStatus status);
}