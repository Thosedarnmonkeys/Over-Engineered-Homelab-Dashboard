import { IncomingMessage, ServerResponse } from "http";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { imageIds } = req.query;
  const libraryItemId: number = imageIds[0];
  const thumbnailId: number = imageIds[1];

  const plexUrl = `/library/metadata/${libraryItemId}/thumb/${thumbnailId}`;

  const PlexAPI = require("plex-api");
  const plexClient = new PlexAPI({
    hostname: "192.168.0.165",
    token: "1iejXXysyYxNesLys7ov",
  });

  const image: Buffer = await plexClient.query(plexUrl);

  res.setHeader("Content-Type", "image/jpeg");
  res.send(image.toString());
}
