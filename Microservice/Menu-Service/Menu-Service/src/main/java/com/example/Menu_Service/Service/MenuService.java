package com.example.Menu_Service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Menu_Service.Entity.Menu;
import com.example.Menu_Service.Repository.MenuRepository;

@Service

public class MenuService {
	@Autowired
	private MenuRepository menuRepository;
	
public List<Menu> getAllMenu() {
	return menuRepository.findAll();
}
public List<Menu> getByCategory(String category) {
	return menuRepository.findBycategory(category);
}
public Menu addMenu(Menu menu) {
	return menuRepository.save(menu);
}
public Menu updateMenu(Long id, Menu updatedMenu) {
    Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu not found"));

    menu.setName(updatedMenu.getName());   // ✅ FIXED
    menu.setCategory(updatedMenu.getCategory());
    menu.setPrice(updatedMenu.getPrice());
    menu.setStockQuantity(updatedMenu.getStockQuantity());
    menu.setImageUrl(updatedMenu.getImageUrl());
    menu.setLocation(updatedMenu.getLocation()); // (optional but better)

    return menuRepository.save(menu);
}
		
public Menu getByLocation(String location) {
	return menuRepository.findBylocation(location).stream().findFirst().orElse(null);
}
public void deleteMenu(Long id) {
	menuRepository.deleteById(id);
}

}
