import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import Recommendations from "../components/Recommendations";



export default function Home() {
  return (
    <>
      <SearchBar />
      <div className="mx-auto max-w-screen-2xl">
        <Categories />
        <Recommendations />
      </div>
    </>
  );
}
