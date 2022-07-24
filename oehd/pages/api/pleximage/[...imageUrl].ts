import { IncomingMessage, ServerResponse } from "http";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { imageUrl } = req.query;
  const joinedUrl = imageUrl.join("/");

  const PlexAPI = require("plex-api");
  const plexClient = new PlexAPI({
    hostname: "192.168.0.165",
    token: "1iejXXysyYxNesLys7ov",
  });

  const image = await plexClient.query(joinedUrl);
  const buffer = Buffer.from(image, "binary");
  const img = Uint8Array.from(buffer).buffer;

  res.setHeader("Content-Type", "image/jpeg");
  res.end(img);
}
