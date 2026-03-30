package com.foodiehub.controller;
import com.foodiehub.entity.Category;
import com.foodiehub.entity.Product;
import com.foodiehub.repository.CategoryRepository;
import com.foodiehub.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController 
@RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AdminController(ProductRepository repo, CategoryRepository catRepo) {
        this.productRepository = repo;
        this.categoryRepository = catRepo;
    }

    @GetMapping("/products")
    public ResponseEntity<java.util.List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<java.util.List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody java.util.Map<String, Object> payload) {
        Product p = mapToProduct(payload, new Product());
        return ResponseEntity.ok(productRepository.save(p));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        Product existing = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        Product updated = mapToProduct(payload, existing);
        return ResponseEntity.ok(productRepository.save(updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Product mapToProduct(java.util.Map<String, Object> payload, Product product) {
        product.setName((String) payload.getOrDefault("name", product.getName()));
        product.setDescription((String) payload.getOrDefault("description", product.getDescription()));
        product.setPrice(parseBigDecimal(payload.getOrDefault("price", product.getPrice())));
        product.setStockQuantity(parseInteger(payload.getOrDefault("stockQuantity", product.getStockQuantity())));
        product.setIsAvailable(product.getStockQuantity() != null && product.getStockQuantity() > 0);
        product.setBrand((String) payload.getOrDefault("brand", product.getBrand()));
        product.setPackaging((String) payload.getOrDefault("packaging", product.getPackaging()));
        product.setImageUrl((String) payload.getOrDefault("imageUrl", product.getImageUrl()));

        Object categoryIdValue = payload.get("categoryId");
        if (categoryIdValue != null) {
            Long catId = parseLong(categoryIdValue);
            Category cat = categoryRepository.findById(catId).orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(cat);
        }

        return product;
    }

    private Integer parseInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).intValue();
        try { return Integer.valueOf(value.toString()); } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid numeric value: " + value, e);
        }
    }

    private Long parseLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).longValue();
        try { return Long.valueOf(value.toString()); } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid id value: " + value, e);
        }
    }

    private java.math.BigDecimal parseBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof java.math.BigDecimal) return (java.math.BigDecimal) value;
        if (value instanceof Number) return java.math.BigDecimal.valueOf(((Number) value).doubleValue());
        try { return new java.math.BigDecimal(value.toString()); } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid decimal value: " + value, e);
        }
    }
}
