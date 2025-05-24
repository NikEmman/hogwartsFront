import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import SpinningWheel from "./SpinningWheel";

export default function Home() {
  const [data, setData] = useState(null);

  return data ? (
    <>
      <Head>
        <title>Hogwarts Wizard&apos;s School</title>
        <meta name="description" content="Hogwarts Wizard's School" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="public/harryPotter.ico" />
      </Head>

      <main>My data is here</main>
    </>
  ) : (
    <SpinningWheel size={60} text="Loading data.." />
  );
}
