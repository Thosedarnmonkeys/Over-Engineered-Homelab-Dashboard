//import Card from "./card";
import DelugeRPC from "deluge-rpc";

export default function DelugeCard({ cardInfo }) {
  return (
    <div cardInfo={cardInfo}>
      <p>Down: {cardInfo.details.downBytes}B</p>
      <p>Up: {cardInfo.details.upBytes}B</p>
      <p>Torrents: {cardInfo.details.torrentCount}</p>
    </div>
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
