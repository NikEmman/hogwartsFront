import Head from "next/head";
import { useState, useEffect } from "react";
import SpinningWheel from "./components/SpinningWheel";
import Card from "./components/Card";

export default function Home() {
  const [houses, setHouses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHouses() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/houses?name=${encodeURIComponent(
            searchText
          )}`
        );
        const data = await response.json();
        setHouses(data);
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError(`Error fetching houses: ${error.message}`);
        setHouses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHouses();
  }, [searchText]);

  function handleInputChange(text) {
    setSearchText(text);
  }

  const houseList = houses.map((house) => {
    return <Card key={house.id} house={house} />;
  });

  return (
    <>
      <Head>
        <title>Hogwarts Wizard&apos;s School</title>
        <meta name="description" content="Hogwarts Wizard's School" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="harryPotter.ico" />
      </Head>
      <main>
        <input
          onChange={(e) => handleInputChange(e.target.value)}
          type="search"
          placeholder="Search houses"
          value={searchText}
        />

        {loading ? (
          <SpinningWheel size={60} text="Loading data.." />
        ) : houses.length > 0 ? (
          houseList
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>No houses found.</p>
        )}
      </main>
    </>
  );
}
