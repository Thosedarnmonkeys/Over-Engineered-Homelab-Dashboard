import Image from "next/image";
import Card, { CardInfo } from "./card";
import { formatBytes } from "../utils";
import { ReactNode, useEffect, useState } from "react";

export class StreamDetail {
  userName: string = "";
  mediaType: "movie" | "episode" = "movie";
  playingName: string = "";
  progress: number = 0;
  bandwidth: number = 0;
  location: "lan" | "wan" = "wan";
  libraryItemId: string = "";
  thumbnailId: string = "";
}

export class TautulliDetails {
  streamCount: number = 0;
  totalBandwidth: number = 0;
  lanBandwidth: number = 0;
  wanBandwidth: number = 0;
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
  let streams: ReactNode[] = [];
  if (cardInfo.details) {
    const streamsParts = cardInfo.details.streams.map((x) => {
      const locationImagePath =
        x.location === "lan" ? "/icons/lan.svg" : "/icons/globe.svg";
      return (
        <div className="m-1 flex" key={x.userName + x.libraryItemId}>
          <img src={`/api/pleximage/${x.libraryItemId}/${x.thumbnailId}`}></img>

          <div className="m-1 flex flex-col justify-between w-full my-2 text-sm">
            <div className="flex justify-between">
              <span>{x.playingName}</span>
            </div>
            <div className="flex justify-between">
              <span>{x.userName}</span>
              <span>
                <Image src={locationImagePath} width={12} height={12}></Image>
                <span className="ml-1">
                  {formatBytes(x.bandwidth, 1, 1000)}
                </span>
              </span>
            </div>
          </div>
        </div>
      );
    });
    streams = streams.concat(streamsParts);
  }

  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-1 justify-between">
        <span className="flex">
          <Image src="/icons/hash.svg" width={12} height={12}></Image>
          <p className="ml-1 text-sm">{cardInfo.details?.streamCount ?? 0}</p>
        </span>
        <span className="flex">
          <Image src="/icons/lan.svg" width={15} height={15}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details?.lanBandwidth ?? 0, 2, 1000)}
          </p>
        </span>
        <span className="flex">
          <Image src="/icons/globe.svg" width={15} height={15}></Image>
          <p className="ml-1 text-sm">
            {formatBytes(cardInfo.details?.wanBandwidth ?? 0, 2, 1000)}
          </p>
        </span>
      </div>
      <div className="flex flex-col my-3 mx-4">{streams}</div>
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
  const data = activity?.response?.data;
  if (!data) {
    tautulliInfo.error = "no data returned from tautulli";
    return tautulliInfo;
  }

  const streamCount = data.stream_count;
  const totalBandwidth = data.total_bandwidth;
  const lanBandwidth = data.lan_bandwidth;
  const wanBandwidth = data.wan_bandwidth;
  const streams =
    data.sessions?.map((x: any) => {
      const mediaType = x.media_type;
      let thumbnailId, libraryItemId;
      if (mediaType === "movie") {
        libraryItemId = getLibraryItemId(x.thumb);
        thumbnailId = getThumbnailId(x.thumb);
      } else if (mediaType === "episode") {
        libraryItemId = getLibraryItemId(x.grandparent_thumb);
        thumbnailId = getThumbnailId(x.grandparent_thumb);
      }

      return {
        mediaType,
        libraryItemId,
        thumbnailId,
        userName: x.username,
        playingName: x.full_title,
        progress: x.progress_percent,
        bandwidth: x.bandwidth,
        location: x.location,
      };
    }) ?? [];

  const details = {
    streamCount,
    totalBandwidth,
    lanBandwidth,
    wanBandwidth,
    streams,
  };

  tautulliInfo.details = details;
  tautulliInfo.isUp = true;
  return tautulliInfo;
}

function getLibraryItemId(url: string): string {
  const urlPart = url.split("/");
  return urlPart[3];
}

function getThumbnailId(url: string): string {
  const index = url.lastIndexOf("/");
  return url.substring(index + 1);
}
