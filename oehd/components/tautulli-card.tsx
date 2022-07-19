import Image from "next/image";
import Card, { CardInfo } from "./card";

export class StreamDetail {
  userName: string = "";
  playingName: string = "";
  progress: number = 0;
  bandwidth: number = 0;
}

export class TautulliDetails {
  streamCount: number = 0;
  totalBandwidth: number = 0;
  streams: StreamDetail[] = [];
}

export class TautulliCardInfo extends CardInfo {
  details?: TautulliDetails;
}

export default function TautulliCard({
  cardInfo,
}: {
  cardInfo: TautulliCardInfo;
}) {
  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-1 justify-between">
        <span className="flex">
          <Image src="/icons/hash.svg" width={10} height={10}></Image>
          <p className="ml-1 text-sm">{cardInfo.details?.streamCount ?? 0}</p>
        </span>
      </div>
      <div className="my-3 mx-4 grid gap-x-3 gap-y-1"></div>
    </Card>
  );
}

export async function getTautulliInfo(): Promise<TautulliCardInfo> {
  const tautulliInfo: TautulliCardInfo = {
    title: "Tautulli",
    link: "https://monitor.damnserver.com",
    imagePath: "/appicons/tautulli.png",
    isUp: false,
  };

  const Tautulli = require("tautulli-api");
  const tautulliClient = new Tautulli(
    "192.168.0.165",
    "8181",
    "4a371da9fca34054b68f2860c11fa2cd"
  );
  const activity = await tautulliClient.get("get_activity");

  const streamCount = activity.response.data.stream_count;

  const details = {
    streamCount,
    totalBandwidth: 0,
    streams: [],
  };

  tautulliInfo.details = details;
  tautulliInfo.isUp = true;
  return tautulliInfo;
}
