import Image from "next/image";

export default function Card(props) {
  return (
    <span className="bg-slate-600 rounded-md w-64 h-28 shadow-md flex flex-row justify-between overflow-clip">
      <span className="flex flex-col py-4 pl-4">
        <span className="flex flex-row">
          <Image
            src={props.cardInfo.imagePath}
            width={60}
            height={60}
            layout={"fixed"}
          ></Image>
          <span className="flex flex-col">
            <a href={props.cardInfo.link} className="ml-6">
              <h2 className="inline text-2xl">{props.cardInfo.title}</h2>
            </a>
            <section className="ml-4 mt-1">{props.children}</section>
          </span>
        </span>
      </span>
      <span
        className={props.cardInfo.isUp ? "w-1 bg-green-400" : "w-1 bg-red-500"}
      ></span>
    </span>
  );
}
