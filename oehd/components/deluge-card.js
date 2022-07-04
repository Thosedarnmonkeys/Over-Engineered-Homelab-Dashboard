import Image from "next/image";
import Card from "./card";
import DelugeRPC from "deluge-rpc";

export default function DelugeCard({ cardInfo }) {
  let gridRows = [
    <span className=" m-auto text-sm col-start-2 row-start-1">%</span>,
    <span className="m-auto col-start-3 row-start-1">
      <Image src="/icons/down-arrow.svg" width={10} height={10}></Image>
    </span>,
    <span className="m-auto col-start-4 row-start-1">
      <Image src="/icons/up-arrow.svg" width={10} height={10}></Image>
    </span>,
  ];
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
        {formatBytes(t.downBytes)}
      </span>,
      <span
        className="text-sm col-start-4 text-right"
        style={{ gridRowStart: row }}
      >
        {formatBytes(t.upBytes)}
      </span>,
    ];

    gridRows = gridRows.concat(rowSections);
  }

  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-1 justify-between">
        <span className="flex">
          <Image src="/icons/hash.svg" width={10} height={10}></Image>
          <p className="ml-1 text-sm">{cardInfo.details.torrentCount}</p>
        </span>
        <span className="flex">
          <Image src="/icons/down-arrow.svg" width={10} height={10}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details.downBytes)}
          </p>
        </span>
        <span className="flex">
          <Image src="/icons/up-arrow.svg" width={10} height={10}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details.upBytes)}
          </p>
        </span>
      </div>
      <div
        className="my-3 mx-4 grid gap-x-3 gap-y-1"
        style={{
          gridTemplateRows:
            Array(cardInfo.details.torrentCount).fill("1fr").join(" ") + ";",
          gridTemplateColumns: "1fr mincontent mincontent mincontent;",
        }}
      >
        {gridRows}
      </div>
    </Card>
  );
}

function formatBytes(rate) {
  let bytes;
  let unit;

  if (rate < 1000000) {
    bytes = rate / 1000;
    unit = "Kb";
  } else if (rate < 1000000000) {
    bytes = rate / 1000000;
    unit = "Mb";
  } else {
    bytes = rate / 1000000000;
    unit = "Gb";
  }

  return bytes.toPrecision(bytes > 0 ? 2 : 1) + unit;
}

export async function getDelugeInfo() {
  const delugeInfo = {
    title: "Deluge",
    link: "https://deluge.damnserver.com",
    imagePath: "/appicons/deluge.png",
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

  const torrentsArray = Object.values(state.torrents);

  const details = {
    downBytes: state.stats.download_rate,
    upBytes: state.stats.upload_rate,
    torrentCount: torrentsArray.length,
    torrents: torrentsArray.map((t) => ({
      name: t.name,
      progress: t.progress,
      upBytes: t.upload_payload_rate,
      downBytes: t.download_payload_rate,
    })),
  };

  return {
    ...delugeInfo,
    isUp: true,
    details: details,
  };
}
