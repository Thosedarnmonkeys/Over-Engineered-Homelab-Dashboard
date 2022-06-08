import Image from "next/image";
import Card from "./card";
import DelugeRPC from "deluge-rpc";

export default function DelugeCard({ cardInfo }) {
  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-row flex-1 justify-between">
        <span className="flex flex-col">
          <Image src="/hash.svg" width={10} height={10}></Image>
          <p className="text-sm">{cardInfo.details.torrentCount}</p>
        </span>
        <span className="flex flex-col">
          <Image src="/down-arrow.svg" width={10} height={10}></Image>
          <p className="text-sm">{formatBytes(cardInfo.details.downBytes)}</p>
        </span>
        <span className="flex flex-col">
          <Image src="/up-arrow.svg" width={10} height={10}></Image>
          <p className="text-sm">{formatBytes(cardInfo.details.upBytes)}</p>
        </span>
      </div>
    </Card>
  );
}

function formatBytes(rate) {
  let bytes;
  let unit;

  if (rate < 1000) {
    bytes = rate;
    unit = "B";
  } else if (rate < 1000000) {
    bytes = rate / 1000;
    unit = "KB";
  } else if (rate < 1000000000) {
    bytes = rate / 1000000;
    unit = "MB";
  } else {
    bytes = rate / 1000000000;
    unit = "GB";
  }

  return bytes.toPrecision(3) + unit;
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
