package com.stayhub.backend.features;

import com.stayhub.backend.features.dto.CreateFeatureRequest;
import com.stayhub.backend.features.dto.FeatureResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeatureResponse create(@Valid @RequestBody CreateFeatureRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<FeatureResponse> list() {
        return service.list();
    }

    @PutMapping("/{id}")
    public FeatureResponse update(
            @PathVariable String id,
            @Valid @RequestBody CreateFeatureRequest req
    ) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}