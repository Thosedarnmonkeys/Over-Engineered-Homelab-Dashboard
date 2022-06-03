import Head from "next/head";
import styles from "../styles/Home.module.css";
import mitch from "../mitch.json";
import { rand } from "../utils.js";
import DelugeCard, { getDelugeInfo } from "../components/deluge-card";

export default function Home({ info }) {
  return (
    <div>
      <Head>
        <title>OEHD</title>
        <meta name="description" content="Over Engineered Homelab Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div>
          <h1>OEHD</h1>
          <span>{info.mitch}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <DelugeCard cardInfo={info.deluge}></DelugeCard>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const mitchQuote = mitch[rand(0, mitch.length - 1)];
  const deluge = await getDelugeInfo();

  const info = { ["mitch"]: mitchQuote, ["deluge"]: deluge };
  return {
    props: { info },
  };
}
