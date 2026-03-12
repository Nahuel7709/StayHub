import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAccommodationsPage } from "../api/accommodations";

export function useHomeSearch() {
  const [params, setParams] = useSearchParams();

  const query = params.get("query") || "";
  const startDate = params.get("startDate") || "";
  const endDate = params.get("endDate") || "";

  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState("");

  const hasSearch = !!query || (!!startDate && !!endDate);

  useEffect(() => {
    async function loadResults() {
      if (!hasSearch) {
        setResults(null);
        setResultsError("");
        setLoadingResults(false);
        return;
      }

      setLoadingResults(true);
      setResultsError("");

      try {
        const data = await fetchAccommodationsPage({
          page: 0,
          size: 10,
          query,
          startDate,
          endDate,
        });
        setResults(data);
      } catch (e) {
        setResults(null);
        setResultsError(e?.message ?? "No se pudo cargar la búsqueda");
      } finally {
        setLoadingResults(false);
      }
    }

    loadResults();
  }, [hasSearch, query, startDate, endDate]);

  function handleSearch({
    query: nextQuery,
    startDate: nextStart,
    endDate: nextEnd,
  }) {
    const next = new URLSearchParams();

    if (nextQuery) next.set("query", nextQuery);
    if (nextStart && nextEnd) {
      next.set("startDate", nextStart);
      next.set("endDate", nextEnd);
    }

    setParams(next);
  }

  function clearSearch() {
    setParams(new URLSearchParams());
  }

  return {
    query,
    startDate,
    endDate,
    results,
    loadingResults,
    resultsError,
    hasSearch,
    handleSearch,
    clearSearch,
  };
}
