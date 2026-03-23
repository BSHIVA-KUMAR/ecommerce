package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.security.AppUserDetails;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@AuthenticationPrincipal AppUserDetails principal, @Valid @RequestBody ProductRequest request) {
        Product p = new Product();
        p.setName(request.name());
        p.setDescription(request.description());
        p.setPrice(request.price());
        p.setCreatedByUserId(principal.getUser().getId());
        p.setCreatedByUsername(principal.getUsername());
        return productRepository.save(p);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product updateProduct(@AuthenticationPrincipal AppUserDetails principal, @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!p.getCreatedByUserId().equals(principal.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update products created by you");
        }
        p.setName(request.name());
        p.setDescription(request.description());
        p.setPrice(request.price());
        return productRepository.save(p);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@AuthenticationPrincipal AppUserDetails principal, @PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!p.getCreatedByUserId().equals(principal.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete products created by you");
        }
        productRepository.deleteById(id);
    }
}
