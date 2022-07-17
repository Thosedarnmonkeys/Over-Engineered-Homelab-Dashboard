import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import DelugeCard, {
  DelugeCardInfo,
  getDelugeInfo,
} from "../components/deluge-card";
import SonarrCard, {
  getSonarrInfo,
  SonarrCardInfo,
} from "../components/sonarr-card";
import mitchQuotes from "../mitchQuotes.json";

export class DashboardInfo {
  mitch: string = "";
  deluge?: DelugeCardInfo;
  sonarr?: SonarrCardInfo;
}

export default function Home({ info }: { info: DashboardInfo }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.replace(router.asPath);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cards = [];
  if (info.deluge) {
    cards.push(<DelugeCard cardInfo={info.deluge}></DelugeCard>);
  }
  if (info.sonarr) {
    cards.push(<SonarrCard cardInfo={info.sonarr}></SonarrCard>);
  }

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

      <main className="max-h-[90vh] w-min p-16 flex flex-col flex-wrap">
        {cards}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mitch = getMitchQuote();
  const deluge = await getDelugeInfo();
  const sonarr = await getSonarrInfo();

  const info = { mitch, deluge, sonarr };
  return {
    props: { info },
  };
};

export function getMitchQuote(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);

  const seedrandom = require("seedrandom");
  const randomGen = seedrandom(day);

  return mitchQuotes[Math.floor(randomGen() * (mitchQuotes.length - 1))];
}
