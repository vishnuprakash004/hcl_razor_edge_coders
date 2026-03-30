package com.foodiehub.security;
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
}