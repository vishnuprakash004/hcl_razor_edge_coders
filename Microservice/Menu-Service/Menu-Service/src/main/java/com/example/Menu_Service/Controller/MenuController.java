package com.example.Menu_Service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Menu_Service.Entity.Menu;
import com.example.Menu_Service.Service.MenuService;

@RestController
@RequestMapping("/menu")
public class MenuController {
@Autowired
private MenuService menuService;

@GetMapping
public List<Menu> getAllMenus() {
	return menuService.getAllMenu();
	
}
@GetMapping("/location/{location}")
public Menu getByLocation(@PathVariable String location) {
	return menuService.getByLocation(location);
}
@GetMapping("/category/{category}")
public List <Menu>getByCategory(@PathVariable String category){
	return menuService.getByCategory(category);
}
@PostMapping
public Menu addMenu(@RequestBody Menu menu) {
	return menuService.addMenu(menu);
}
@PutMapping("/{id}")
public Menu updateMenu(@PathVariable Long id, @RequestBody Menu updatedMenu) {
	return menuService.updateMenu(id, updatedMenu);
}
}

