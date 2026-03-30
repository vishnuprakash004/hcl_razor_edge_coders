package com.foodiehub.controller;

import com.foodiehub.entity.Cart;
import com.foodiehub.entity.CartItem;
import com.foodiehub.entity.Product;
import com.foodiehub.entity.User;
import com.foodiehub.repository.CartItemRepository;
import com.foodiehub.repository.CartRepository;
import com.foodiehub.repository.ProductRepository;
import com.foodiehub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartController(CartRepository cartRepository, CartItemRepository cartItemRepository,
                          ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        Cart cart = findOrCreateCart(false);
        return ResponseEntity.ok(toCartResponse(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItem(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.getOrDefault("quantity", 1).toString());
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be greater than zero");

        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = findOrCreateCart(true);
        CartItem existingItem = cart.getItems().stream().filter(i -> i.getProduct().getId().equals(productId)).findFirst().orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setUnitPrice(product.getPrice());
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        recalcCart(cart);
        cartRepository.save(cart);

        return ResponseEntity.ok(toCartResponse(cart));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateItem(@PathVariable Long cartItemId, @RequestParam Integer quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Quantity must be 0 or greater");

        Cart cart = findOrCreateCart(false);
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(cartItemId)).findFirst().orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity == 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        recalcCart(cart);
        cartRepository.save(cart);

        return ResponseEntity.ok(toCartResponse(cart));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long cartItemId) {
        Cart cart = findOrCreateCart(false);
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(cartItemId)).findFirst().orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        recalcCart(cart);
        cartRepository.save(cart);

        return ResponseEntity.ok(toCartResponse(cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartResponse> clearCart() {
        Cart cart = findOrCreateCart(false);
        cart.getItems().clear();
        recalcCart(cart);
        cartRepository.save(cart);

        return ResponseEntity.ok(toCartResponse(cart));
    }

    private Cart findOrCreateCart(boolean createIfMissing) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserIdAndActiveTrue(user.getId()).orElse(null);
        if (cart == null && createIfMissing) {
            cart = new Cart();
            cart.setUser(user);
            cart.setActive(true);
            cart.setTotalAmount(BigDecimal.ZERO);
            cart.setItems(new ArrayList<>());
            cartRepository.save(cart);
        }
        if (cart != null && cart.getItems() == null) cart.setItems(new ArrayList<>());
        if (cart != null) recalcCart(cart);
        return cart;
    }

    private void recalcCart(Cart cart) {
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        cart.setTotalAmount(totalAmount);
    }

    private CartResponse toCartResponse(Cart cart) {
        CartResponse cr = new CartResponse();
        List<CartItemResponse> items = new ArrayList<>();

        if (cart != null) {
            for (CartItem item : cart.getItems()) {
                CartItemResponse ci = new CartItemResponse();
                ci.setCartItemId(item.getId());
                ci.setProductId(item.getProduct().getId());
                ci.setProductName(item.getProduct().getName());
                ci.setProductImage(item.getProduct().getImageUrl());
                ci.setUnitPrice(item.getUnitPrice());
                ci.setQuantity(item.getQuantity());
                ci.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                items.add(ci);
            }
            cr.setTotalAmount(cart.getTotalAmount());
            cr.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
        } else {
            cr.setTotalAmount(BigDecimal.ZERO);
            cr.setTotalItems(0);
        }

        cr.setItems(items);
        return cr;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public static class CartResponse {
        private List<CartItemResponse> items;
        private BigDecimal totalAmount;
        private Integer totalItems;

        public List<CartItemResponse> getItems() { return items; }
        public void setItems(List<CartItemResponse> items) { this.items = items; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public Integer getTotalItems() { return totalItems; }
        public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
    }

    public static class CartItemResponse {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private String productImage;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal subtotal;

        public Long getCartItemId() { return cartItemId; }
        public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }
}
