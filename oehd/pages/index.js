import Head from "next/head";
import mitch from "../mitch.json";
import { rand } from "../utils.js";
import DelugeCard, { getDelugeInfo } from "../components/deluge-card";

export default function Home({ info }) {
  return (
    <div className="min-h-screen">
      <Head>
        <title>OEHD</title>
        <meta name="description" content="Over Engineered Homelab Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-slate-800 h-[10vh]">
        <div className="h-full flex flex-row justify-between items-center">
          <h1 className="text-4xl ml-8">OEHD</h1>
          <span className="opacity-50 mr-8 max-w-md text-sm">{info.mitch}</span>
        </div>
      </header>

      <main className="h-[90vh] w-full p-16 grid gap-6">
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
        <DelugeCard cardInfo={info.deluge}></DelugeCard>
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
