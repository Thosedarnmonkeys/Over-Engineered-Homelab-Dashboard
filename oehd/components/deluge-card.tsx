import Image from "next/image";
import DelugeRPC from "deluge-rpc";
import Card, { CardInfo } from "./card";
import { formatBytes } from "../utils";

export class Torrent {
  name: string = "";
  progress: number = 0;
  upBytes: number = 0;
  downBytes: number = 0;
}

export class TorrentDetails {
  downBytes: number = 0;
  upBytes: number = 0;
  torrentCount: number = 0;
  torrents: Torrent[] = [];
}

export class DelugeCardInfo extends CardInfo {
  details?: TorrentDetails;
}

export default function DelugeCard({ cardInfo }: { cardInfo: DelugeCardInfo }) {
  let gridRows = [
    <span className=" m-auto text-sm col-start-2 row-start-1">%</span>,
    <span className="m-auto col-start-3 row-start-1">
      <Image src="/icons/down-arrow.svg" width={10} height={10}></Image>
    </span>,
    <span className="m-auto col-start-4 row-start-1">
      <Image src="/icons/up-arrow.svg" width={10} height={10}></Image>
    </span>,
  ];
  if (cardInfo.details) {
    for (let i = 0; i < cardInfo.details.torrentCount; i++) {
      const t = cardInfo.details.torrents[i];
      const row = i + 2;
      const flooredProgress = Math.floor(t.progress);
      const progress = flooredProgress === 0 ? "-" : flooredProgress;
      const rowSections = [
        <span
          className="text-sm text-ellipsis whitespace-nowrap overflow-hidden col-start-1"
          style={{ gridRowStart: row }}
        >
          {t.name}
        </span>,
        <span className="text-sm col-start-2" style={{ gridRowStart: row }}>
          {progress}
        </span>,
        <span
          className="text-sm col-start-3 content-end text-right"
          style={{ gridRowStart: row }}
        >
          {formatBytes(t.downBytes, 1)}
        </span>,
        <span
          className="text-sm col-start-4 text-right"
          style={{ gridRowStart: row }}
        >
          {formatBytes(t.upBytes, 1)}
        </span>,
      ];

      gridRows = gridRows.concat(rowSections);
    }
  }

  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-1 justify-between">
        <span className="flex">
          <Image src="/icons/hash.svg" width={12} height={12}></Image>
          <p className="ml-1 text-sm">{cardInfo.details?.torrentCount ?? 0}</p>
        </span>
        <span className="flex">
          <Image src="/icons/down-arrow.svg" width={12} height={12}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details?.downBytes ?? 0, 2)}
          </p>
        </span>
        <span className="flex">
          <Image src="/icons/up-arrow.svg" width={12} height={12}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details?.upBytes ?? 0, 2)}
          </p>
        </span>
      </div>
      <div
        className="my-3 mx-4 grid gap-x-3 gap-y-1"
        style={{
          gridTemplateRows:
            Array(cardInfo.details?.torrentCount).fill("1fr").join(" ") + ";",
          gridTemplateColumns: "1fr mincontent mincontent mincontent",
        }}
      >
        {gridRows}
      </div>
    </Card>
  );
}

export async function getDelugeInfo(): Promise<DelugeCardInfo> {
  const delugeInfo: DelugeCardInfo = {
    title: "Deluge",
    link: "https://deluge.damnserver.com",
    imagePath: "/appicons/deluge.png",
    isUp: false,
    details: undefined,
  };

  const delugeClient = new DelugeRPC(
    "http://192.168.0.165:8112/",
    "thunderbutt"
  );

  const auth = await delugeClient.auth();
  if (!auth) {
    delugeInfo.error = "Authentication failed";
    return delugeInfo;
  }

  const connected = await delugeClient.connect();
  if (!connected) {
    delugeInfo.error = "Connection failed";
    return delugeInfo;
  }

  const state = await delugeClient.getTorrentRecord();
  if (!state) {
    delugeInfo.error = "Error getting Deluge state";
    return delugeInfo;
  }

  const torrentsArray = Object.values(state.torrents ?? []);

  const details = {
    downBytes: state.stats?.download_rate ?? 0,
    upBytes: state.stats?.upload_rate ?? 0,
    torrentCount: torrentsArray.length,
    torrents: torrentsArray.map((t) => ({
      name: t.name,
      progress: t.progress,
      upBytes: t.upload_payload_rate,
      downBytes: t.download_payload_rate,
    })),
  };

  delugeInfo.isUp = true;
  delugeInfo.details = details;
  return delugeInfo;
}
