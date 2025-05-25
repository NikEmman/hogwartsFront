import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import SpinningWheel from "./components/SpinningWheel";
import Card from "./components/Card";

export default function Home() {
  const [houses, setHouses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHouses() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/houses?name=${encodeURIComponent(searchText)}`
        );
        const data = await response.json();
        setHouses(data);
      } catch (error) {
        console.error("Error fetching houses:", error);
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
          placeholder="Search"
          value={searchText}
        />
        {loading ? (
          <SpinningWheel size={60} text="Loading data.." />
        ) : houses.length > 0 ? (
          houseList
        ) : (
          <p>No houses found.</p>
        )}
      </main>
    </>
  );
}
