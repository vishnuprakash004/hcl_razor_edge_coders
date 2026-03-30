package com.foodiehub.controller;
import com.foodiehub.entity.Product;
import com.foodiehub.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    public ProductController(ProductRepository repo) { this.productRepository = repo; }
    @GetMapping public ResponseEntity<List<Product>> getAll() { return ResponseEntity.ok(productRepository.findAll()); }
    @GetMapping("/{id}") public ResponseEntity<Product> getById(@PathVariable Long id) { return ResponseEntity.ok(productRepository.findById(id).orElseThrow()); }
}