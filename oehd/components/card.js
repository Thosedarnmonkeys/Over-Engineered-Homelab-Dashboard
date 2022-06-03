import Image from "next/image";

export default function Card(props) {
  return (
    <div className="mr-4 p-6 text-left border-2 border-slate-200 rounded-lg w-1/5">
      <section className="flex justify-between content-center">
        <a href={props.cardInfo.link}>
          <h2 className="inline text-2xl mr-6">{props.cardInfo.title}</h2>
        </a>
        <Image
          className="inline"
          src={props.cardInfo.imagePath}
          width={40}
          height={40}
          layout={"fixed"}
        ></Image>
      </section>
      <section>{props.children}</section>
    </div>
  );
}
