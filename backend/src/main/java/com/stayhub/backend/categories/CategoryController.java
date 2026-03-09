package com.stayhub.backend.categories;

import com.stayhub.backend.categories.dto.CategoryResponse;
import com.stayhub.backend.categories.dto.CreateCategoryForm;
import com.stayhub.backend.categories.dto.CreateCategoryRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createJson(@Valid @RequestBody CreateCategoryRequest req) {
        return service.create(req);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createMultipart(@Valid @ModelAttribute CreateCategoryForm form) {
        return service.createWithUpload(form);
    }

    @GetMapping
    public List<CategoryResponse> list() {
        return service.list();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}