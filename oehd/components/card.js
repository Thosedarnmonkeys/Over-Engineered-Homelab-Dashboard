import Image from "next/image";

export default function Card(props) {
  return (
    <span className="bg-slate-600 rounded-md w-72 h-32 mr-5 mb-5 shadow-md grid grid-card overflow-clip">
      <span className="row-start-1 h-auto flex flex-col mt-8 pl-4 pr-7 flex-1">
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
      </span>
      <div className="row-start-2 flex justify-center opacity-0 hover:bg-slate-500 hover:opacity-100 transition-all">
        <span className="">
          <Image src="/plus.svg" width={10} height={10}></Image>
        </span>
      </div>
      <span
        className={
          props.cardInfo.isUp
            ? "w-1 col-start-2 row-start-1 row-span-2 bg-emerald-700"
            : "w-1 col-start-2 row-start-1 row-span-2 bg-orange-800"
        }
      ></span>
    </span>
  );
}
