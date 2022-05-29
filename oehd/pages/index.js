import Head from "next/head";
import Image from "next/image";
import DelugeRPC from "deluge-rpc";
import styles from "../styles/Home.module.css";
import mitch from "../mitch.json";
import { rand } from "../utils.js";

const Card = ({ cardInfo }) => {
  return (
    <a className={styles.card} href={cardInfo.link}>
      <section>
        <h2>{cardInfo.title}</h2>
        <Image
          src={cardInfo.imagePath}
          width={40}
          height={40}
          layout={"fixed"}
        ></Image>
      </section>
      <section>
        <p>Down: {cardInfo.details.downBytes}B</p>
        <p>Up: {cardInfo.details.upBytes}B</p>
        <p>Torrents: {cardInfo.details.torrentCount}</p>
      </section>
    </a>
  );
};

export default function Home({ info }) {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
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
          <Card cardInfo={info.deluge}></Card>
        </div>
      </main>
    </div>
  );
}

async function getDelugeInfo() {
  const delugeInfo = {
    title: "Deluge",
    link: "https://deluge.damnserver.com",
    imagePath: "/deluge.png",
    isUp: false,
  };

  const delugeClient = new DelugeRPC(
    "http://192.168.0.165:8112/",
    "thunderbutt"
  );

  const auth = await delugeClient.auth();
  if (!auth) {
    return { ...delugeInfo, error: "Authentication failed" };
  }

  const connected = await delugeClient.connect();
  if (!connected) {
    return delugeInfo;
  }

  const state = await delugeClient.getTorrentRecord();
  if (!state) {
    return { ...delugeInfo, isUp: true, error: "Error getting deluge state" };
  }

  const details = {
    downBytes: state.stats.download_rate,
    upBytes: state.stats.upload_rate,
    torrentCount: Object.keys(state.torrents).length,
  };

  return {
    ...delugeInfo,
    isUp: true,
    details: details,
  };
}

export async function getServerSideProps(context) {
  const mitchQuote = mitch[rand(0, mitch.length - 1)];
  const deluge = await getDelugeInfo();

  const info = { ["mitch"]: mitchQuote, ["deluge"]: deluge };
  return {
    props: { info },
  };
}
