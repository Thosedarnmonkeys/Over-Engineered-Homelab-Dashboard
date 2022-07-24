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
    port: 32400,
    token: "1iejXXysyYxNesLys7ov",
    username: "thosedarnmonkeys",
  });

  const image = await plexClient.query(joinedUrl);

  res.setHeader("Content-Type", "image/jpeg");
  res.end(image);
}
