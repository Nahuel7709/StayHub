package com.stayhub.backend.favorites;

import com.stayhub.backend.accommodations.dto.AccommodationCardResponse;
import com.stayhub.backend.favorites.dto.FavoriteStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("/me")
    public List<AccommodationCardResponse> myFavorites(Authentication authentication) {
        return favoriteService.listMyFavorites(authentication.getName());
    }

    @GetMapping("/me/ids")
    public List<String> myFavoriteIds(Authentication authentication) {
        return favoriteService.listMyFavoriteIds(authentication.getName());
    }

    @PostMapping("/{accommodationId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteStatusResponse add(
            @PathVariable String accommodationId,
            Authentication authentication
    ) {
        return favoriteService.add(authentication.getName(), accommodationId);
    }

    @DeleteMapping("/{accommodationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @PathVariable String accommodationId,
            Authentication authentication
    ) {
        favoriteService.remove(authentication.getName(), accommodationId);
    }
}