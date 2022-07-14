import Card, { CardInfo } from "./card";

export class SonarrShowDetails {
  showsMissingEps: number = 0;
}

export class SonarrCardInfo extends CardInfo {
  showDetails?: SonarrShowDetails;
}

export default function SonarrCard({ cardInfo }: { cardInfo: SonarrCardInfo }) {
  return (
    <Card cardInfo={cardInfo}>
      <div className="flex flex-1 justify-between"></div>
      <div className="my-3 mx-4 grid gap-x-3 gap-y-1"></div>
    </Card>
  );
}

export async function getSonarrInfo(): Promise<SonarrCardInfo> {
  const sonarrInfo: SonarrCardInfo = {
    title: "Sonarr",
    link: "https://tv.damnserver.com",
    imagePath: "/appicons/sonarr.png",
    isUp: false,
    error: "Test error",
    showDetails: { showsMissingEps: 0 },
  };

  return sonarrInfo;
}
