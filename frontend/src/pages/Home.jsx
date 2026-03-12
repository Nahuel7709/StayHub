import Categories from "../components/Categories";
import Recommendations from "../components/Recommendations";
import SearchBar from "../components/SearchBar";
import SearchResultsSection from "../components/SearchResultsSection";
import { useHomeSearch } from "../hooks/useHomeSearch";
import { useFavorites } from "../hooks/useFavorites";

export default function Home() {
  const {
    query,
    startDate,
    endDate,
    results,
    loadingResults,
    resultsError,
    hasSearch,
    handleSearch,
    clearSearch,
  } = useHomeSearch();

  const { favoriteIdsSet, togglingIds, toggleFavorite } = useFavorites();

  return (
    <>
      <SearchBar
        initialQuery={query}
        initialStartDate={startDate}
        initialEndDate={endDate}
        onSearch={handleSearch}
      />

      <div className="mx-auto max-w-screen-2xl">
        {hasSearch ? (
          <SearchResultsSection
            query={query}
            startDate={startDate}
            endDate={endDate}
            loading={loadingResults}
            error={resultsError}
            results={results}
            onClear={clearSearch}
            favoriteIdsSet={favoriteIdsSet}
            togglingIds={togglingIds}
            onToggleFavorite={toggleFavorite}
          />
        ) : null}

        <Categories />
        <Recommendations
          favoriteIdsSet={favoriteIdsSet}
          togglingIds={togglingIds}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </>
  );
}
