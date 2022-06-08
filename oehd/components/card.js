import Image from "next/image";

export default function Card(props) {
  return (
    <span className="bg-slate-600 rounded-md w-64 h-28 mr-5 mb-5 shadow-md flex flex-row justify-between overflow-clip">
      <span className="h-auto flex flex-col my-auto pl-4">
        <span className="flex flex-row">
        <a href={props.cardInfo.link}>
          <Image
            src={props.cardInfo.imagePath}
            width={60}
            height={60}
            layout={"fixed"}
          ></Image>
          </a>
          <span className="flex flex-col">
            <a href={props.cardInfo.link} className="ml-6">
              <h2 className="inline text-2xl">{props.cardInfo.title}</h2>
            </a>
            <section className="ml-4 mt-1">{props.children}</section>
          </span>
        </span>
      </span>
      <span
        className={
          props.cardInfo.isUp ? "w-1 bg-emerald-700" : "w-1 bg-orange-800"
        }
      ></span>
    </span>
  );
}
