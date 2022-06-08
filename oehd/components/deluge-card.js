import Image from "next/image";
import Card from "./card";
import DelugeRPC from "deluge-rpc";

export default function DelugeCard({ cardInfo }) {
  return (
    <Card cardInfo={cardInfo}>
      <span className="flex flex-row">
        <p className="ml-2">C: {cardInfo.details.torrentCount}</p>
        <p className="ml-2">D: {cardInfo.details.downBytes}B</p>
        <p className="ml-2">
          <Image src="/up-arrow.svg" width={10} height={10}>
          </Image>
          {cardInfo.details.upBytes}B
        </p>
      </span>
    </Card>
  );
}

export async function getDelugeInfo() {
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
