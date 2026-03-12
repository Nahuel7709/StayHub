import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import {
  addFavorite,
  fetchMyFavoriteIds,
  removeFavorite,
} from "../api/favorites";

export function useFavorites() {
  const { isAuthenticated } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");
  const [togglingIds, setTogglingIds] = useState(new Set());

  const loadFavoriteIds = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      setFavoritesError("");
      return;
    }

    setLoadingFavorites(true);
    setFavoritesError("");

    try {
      const ids = await fetchMyFavoriteIds();
      setFavoriteIds(ids);
    } catch (e) {
      setFavoriteIds([]);
      setFavoritesError(e?.message ?? "No se pudieron cargar favoritos");
    } finally {
      setLoadingFavorites(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavoriteIds();
  }, [loadFavoriteIds]);

  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  function isFavorite(accommodationId) {
    return favoriteIdsSet.has(accommodationId);
  }

  async function toggleFavorite(accommodationId) {
    if (!isAuthenticated) {
      throw new Error("Tenés que iniciar sesión para guardar favoritos");
    }

    if (togglingIds.has(accommodationId)) {
      return;
    }

    const currentlyFavorite = favoriteIdsSet.has(accommodationId);

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.add(accommodationId);
      return next;
    });

    setFavoritesError("");

    try {
      if (currentlyFavorite) {
        await removeFavorite(accommodationId);
        setFavoriteIds((prev) => prev.filter((id) => id !== accommodationId));
        return false;
      }

      await addFavorite(accommodationId);
      setFavoriteIds((prev) => [...prev, accommodationId]);
      return true;
    } catch (e) {
      const message = e?.message ?? "No se pudo actualizar el favorito";
      setFavoritesError(message);
      throw e;
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(accommodationId);
        return next;
      });
    }
  }

  return {
    favoriteIds,
    favoriteIdsSet,
    loadingFavorites,
    favoritesError,
    togglingIds,
    isFavorite,
    toggleFavorite,
    reloadFavorites: loadFavoriteIds,
  };
}
