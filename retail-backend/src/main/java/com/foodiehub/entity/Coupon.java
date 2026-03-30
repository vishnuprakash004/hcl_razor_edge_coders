package com.foodiehub.entity;
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
}