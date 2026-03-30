package com.example.Menu_Service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Menu_Service.Entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
	List<Menu> findBycategory(String category);
	List<Menu>findByname(String name);
	List<Menu>findBylocation(String location);

}
