import Image from "next/image";

export default function Card({ cardInfo }) {
  return (
    <div class="mr-4 p-6 text-left border-2 border-slate-200 rounded-lg w-1/5">
      <section class="flex justify-between content-center">
        <a href={cardInfo.link}>
          <h2 class="inline text-2xl mr-6">{cardInfo.title}</h2>
        </a>
        <Image
          class="inline"
          src={cardInfo.imagePath}
          width={40}
          height={40}
          layout={"fixed"}
        ></Image>
      </section>
      <section>{this.props.children}</section>
    </div>
  );
}
