package com.example.user_service.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

 private static final String SECRET ="mysecretkeymysecretkeymysecretkey";

 private static final Key key =Keys.hmacShaKeyFor(SECRET.getBytes());

 public static String generateToken(String email) {

  return Jwts.builder()
          .setSubject(email)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + 86400000))
          .signWith(key)
          .compact();
 }

}