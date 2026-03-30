package com.example.Inventory_Service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Inventory_Service.Entity.Inventory;
import com.example.Inventory_Service.Model.OrderItem;
import com.example.Inventory_Service.Repository.InventoryRepository;

@Service
public class InventoryService {
	@Autowired
	
	private InventoryRepository inventoryRepository;
	
	public void reduceStock(List<OrderItem> items) {

        for (OrderItem item : items) {

            Inventory inventory = inventoryRepository
                    .findByfoodId(item.getFoodid())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            if (inventory.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Out of stock");
            }

            inventory.setStockQuantity(
                    inventory.getStockQuantity() - item.getQuantity()
            );

            inventoryRepository.save(inventory);
        }
    }

}
