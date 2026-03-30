const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/java/com/foodiehub');

function mkdir(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

mkdir(srcDir);
mkdir(path.join(srcDir, 'config'));
mkdir(path.join(srcDir, 'controller'));
mkdir(path.join(srcDir, 'dto'));
mkdir(path.join(srcDir, 'entity'));
mkdir(path.join(srcDir, 'exception'));
mkdir(path.join(srcDir, 'repository'));
mkdir(path.join(srcDir, 'security'));
mkdir(path.join(srcDir, 'service'));

const files = {
'FoodieHubApplication.java': `package com.foodiehub;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class FoodieHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodieHubApplication.class, args);
    }
}`,

'config/CorsConfig.java': `package com.foodiehub.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
         registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").allowedHeaders("*");
    }
}`,

'config/SecurityConfig.java': `package com.foodiehub.config;
import com.foodiehub.security.JwtAuthFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) { this.jwtAuthFilter = jwtAuthFilter; }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
            .cors(c -> {})
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`,

'entity/User.java': `package com.foodiehub.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false, unique = true, length = 150) private String email;
    @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role;
    @Column(name = "loyalty_points", nullable = false) private Integer loyaltyPoints = 0;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    
    public enum Role { CUSTOMER, ADMIN }
    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); }
    public User() {}
    public User(String name, String email, String password, Role role, Integer loyaltyPoints) {
        this.name = name; this.email = email; this.password = password; this.role = role; this.loyaltyPoints = loyaltyPoints;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}`,

'entity/Product.java': `package com.foodiehub.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 150) private String name;
    @Column(length = 1000) private String description;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price;
    @Column(name = "image_url") private String imageUrl;
    @Column(name = "stock_quantity", nullable = false) private Integer stockQuantity = 0;
    @Column(nullable = false) private Boolean isAvailable = true;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    
    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); this.updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
    
    public Product() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}`,

'entity/Order.java': `package com.foodiehub.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2) private BigDecimal totalAmount;
    @Column(name = "discount_amount", precision = 10, scale = 2) private BigDecimal discountAmount = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private OrderStatus status;
    @Column(name = "delivery_address", nullable = false, length = 500) private String deliveryAddress;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); }
    public Order() {}
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; for(OrderItem it : items) it.setOrder(this); }
}`,

'entity/OrderItem.java': `package com.foodiehub.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id", nullable = false) private Order order;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id", nullable = false) private Product product;
    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price;
    public OrderItem() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}`,

'entity/Coupon.java': `package com.foodiehub.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 50) private String code;
    @Column(name = "discount_percent", nullable = false, precision = 5, scale = 2) private BigDecimal discountPercent;
    @Column(name = "min_order_amount", precision = 10, scale = 2) private BigDecimal minOrderAmount = BigDecimal.ZERO;
    @Column(name = "expiry_date") private LocalDate expiryDate;
    @Column(name = "is_active", nullable = false) private Boolean isActive = true;
    @Column(name = "max_uses") private Integer maxUses = 100;
    @Column(name = "used_count") private Integer usedCount = 0;
    public Coupon() {}
    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }
    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getMaxUses() { return maxUses; }
    public void setMaxUses(Integer maxUses) { this.maxUses = maxUses; }
    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }
}`,

'repository/UserRepository.java': `package com.foodiehub.repository;
import com.foodiehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}`,

'repository/ProductRepository.java': `package com.foodiehub.repository;
import com.foodiehub.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product, Long> {}`,

'repository/OrderRepository.java': `package com.foodiehub.repository;
import com.foodiehub.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}`,

'repository/CouponRepository.java': `package com.foodiehub.repository;
import com.foodiehub.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
}`,

'repository/OrderItemRepository.java': `package com.foodiehub.repository;
import com.foodiehub.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}`,

'dto/AuthDto.java': `package com.foodiehub.dto;
public class AuthDto {
    public static class RegisterRequest {
        private String name; private String email; private String password;
        public String getName() { return name; } public void setName(String name) { this.name = name; }
        public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    }
    public static class LoginRequest {
        private String email; private String password;
        public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    }
    public static class AuthResponse {
        private String token; private String name; private String role;
        public AuthResponse(String token, String name, String role) { this.token = token; this.name = name; this.role = role; }
        public String getToken() { return token; } public String getName() { return name; } public String getRole() { return role; }
    }
}`,

'dto/OrderDto.java': `package com.foodiehub.dto;
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
}`,

'exception/GlobalExceptionHandler.java': `package com.foodiehub.exception;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}`,

'security/JwtUtil.java': `package com.foodiehub.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtil {
    private final String SECRET = "thisIsAVeryLongSecretKeyForFoodieHub123456789";
    private Key getSigningKey() { return Keys.hmacShaKeyFor(SECRET.getBytes()); }
    public String generateToken(UserDetails userDetails, String role) {
        return Jwts.builder().setSubject(userDetails.getUsername())
                .claim("role", role).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }
    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
}`,

'security/CustomUserDetailsService.java': `package com.foodiehub.security;
import com.foodiehub.entity.User;
import com.foodiehub.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) { this.userRepository = userRepository; }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));
    }
}`,

'security/JwtAuthFilter.java': `package com.foodiehub.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService ds) { this.jwtUtil = jwtUtil; this.customUserDetailsService = ds; }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails ud = customUserDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(token, ud)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        chain.doFilter(request, response);
    }
}`,

'service/AuthService.java': `package com.foodiehub.service;
import com.foodiehub.dto.AuthDto.*;
import com.foodiehub.entity.User;
import com.foodiehub.repository.UserRepository;
import com.foodiehub.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    public AuthService(UserRepository repo, PasswordEncoder encoder, AuthenticationManager am, JwtUtil jwt, UserDetailsService uds) {
        this.userRepository = repo; this.passwordEncoder = encoder; this.authenticationManager = am; this.jwtUtil = jwt; this.userDetailsService = uds;
    }
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) throw new RuntimeException("Email already exists");
        User user = new User(req.getName(), req.getEmail(), passwordEncoder.encode(req.getPassword()), User.Role.CUSTOMER, 0);
        userRepository.save(user);
        UserDetails ud = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getRole().name());
    }
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        UserDetails ud = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getRole().name());
    }
}`,

'controller/AuthController.java': `package com.foodiehub.controller;
import com.foodiehub.dto.AuthDto.*;
import com.foodiehub.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }
    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) { return ResponseEntity.ok(authService.register(req)); }
    @PostMapping("/login") public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) { return ResponseEntity.ok(authService.login(req)); }
}`,

'controller/ProductController.java': `package com.foodiehub.controller;
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
}`,

'controller/OrderController.java': `package com.foodiehub.controller;
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
    public OrderController(OrderRepository or, UserRepository ur, ProductRepository pr) { this.orderRepository = or; this.userRepository = ur; this.productRepository = pr; }
    
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
        
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserId(user.getId()));
    }
}`,

'controller/AdminController.java': `package com.foodiehub.controller;
import com.foodiehub.entity.Product;
import com.foodiehub.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository productRepository;
    public AdminController(ProductRepository repo) { this.productRepository = repo; }
    
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product p) {
        return ResponseEntity.ok(productRepository.save(p));
    }
}`
};

for (const [relPath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(srcDir, relPath), content, 'utf8');
}
console.log('Backend perfectly regenerated completely WITHOUT LOMBOK.');
