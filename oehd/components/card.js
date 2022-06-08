import Image from "next/image";

export default function Card(props) {
  return (
    <span className="bg-slate-600 rounded-md w-64 h-28 mr-5 mb-5 shadow-md flex flex-row justify-between overflow-clip">
      <span className="h-auto flex flex-col my-auto pl-4 pr-5 flex-1">
        <span className="flex flex-row">
          <a href={props.cardInfo.link}>
            <Image
              src={props.cardInfo.imagePath}
              width={60}
              height={60}
              layout={"fixed"}
            ></Image>
          </a>
          <span className="flex flex-col flex-1 ml-6 w-max">
            <a href={props.cardInfo.link}>
              <h2 className="inline text-2xl leading-5">
                {props.cardInfo.title}
              </h2>
            </a>
            <section className="mt-2">{props.children}</section>
          </span>
        </span>
        <div></div>
      </span>
      <span
        className={
          props.cardInfo.isUp ? "w-1 bg-emerald-700" : "w-1 bg-orange-800"
        }
      ></span>
    </span>
  );
}
