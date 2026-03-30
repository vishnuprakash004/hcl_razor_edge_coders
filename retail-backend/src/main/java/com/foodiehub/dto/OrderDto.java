package com.foodiehub.dto;
import java.util.List;
public class OrderDto {
    public static class Request {
        private String deliveryAddress; private String couponCode; private List<OrderItemDto> items;
        public String getDeliveryAddress() { return deliveryAddress; } public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
        public String getCouponCode() { return couponCode; } public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
        public List<OrderItemDto> getItems() { return items; } public void setItems(List<OrderItemDto> items) { this.items = items; }
    }
    public static class OrderItemDto {
        private Long productId; private Integer quantity;
        public Long getProductId() { return productId; } public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; } public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}