import Image from "next/image";
import { ReactNode, useState } from "react";

export class CardInfo {
  title: string = "";
  link: string = "";
  imagePath: string = "";
  isUp: boolean = false;
  error?: string;
}

export default function Card({
  cardInfo,
  children,
}: {
  cardInfo: CardInfo;
  children: ReactNode[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleIsExpanded() {
    setIsExpanded(!isExpanded);
  }

  const expandedContent = cardInfo.error ? (
    <p className="m-2 text-base text-red-200">{cardInfo.error}</p>
  ) : (
    children[1]
  );

  return (
    <span
      className={`bg-slate-600 rounded-md w-96 mr-5 mb-5 shadow-md grid grid-card overflow-clip childsecshow ${
        isExpanded ? "" : "h-32"
      }`}
    >
      <span className="row-start-1 h-auto flex flex-col pt-8 pl-6 pr-7 flex-1">
        <span className="flex flex-row">
          <a href={cardInfo.link}>
            <Image
              src={cardInfo.imagePath}
              width={60}
              height={60}
              layout={"fixed"}
            ></Image>
          </a>
          <span className="flex flex-col flex-1 ml-6 w-max">
            <a href={cardInfo.link}>
              <h2 className="inline text-2xl leading-5">{cardInfo.title}</h2>
            </a>
            <section className="mt-3">{children[0]}</section>
          </span>
        </span>
      </span>
      <div className={isExpanded ? "row-start-2" : "hidden row-start-2"}>
        {expandedContent}
      </div>
      <footer
        onClick={toggleIsExpanded}
        className="row-start-3 flex justify-center opacity-0 transition-all cursor-pointer"
      >
        <span>
          <Image
            src={isExpanded ? "/icons/minus.svg" : "/icons/plus.svg"}
            width={10}
            height={10}
          ></Image>
        </span>
      </footer>
      <span
        className={`w-1 col-start-2 row-start-1 row-span-3 ${
          cardInfo.isUp ? "bg-emerald-700" : "bg-orange-800"
        }`}
      ></span>
    </span>
  );
}
