import Cards from "../../components/Cards";
import FilterCards from "../../components/FilterCards";

function Home({ hotelsData }) {
    return (
        <>
            <header>
                <h1>Apartmani</h1>
            </header>
            <main>
                {hotelsData[0] && (
                    <>
                    
                        {/* <FilterCards />  */}
                        <Cards hotelsData={hotelsData} />
                    </>
                )}
            </main>
            <footer></footer>
        </>
    );
}

export default Home;
