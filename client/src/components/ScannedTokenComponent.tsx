import copyData from "../data/copy.json";

export default function ScannedTokenComponent(props: { tokenId: string }) {
  const data = copyData.find((copy) => copy.id === props.tokenId);
  const imageUrl = new URL(`../assets/${data?.heroImage}`, import.meta.url)
    .href;
  const title = data?.title;

  return (
    <div className="rounded-lg w-full h-48 object-cover relative overflow-hidden">
      <h1 className="font-source-sans text-white font-bold text-2xl absolute top-2 left-4">
        {title}
      </h1>
      <img src={imageUrl} className="w-full h-full object-cover" />
    </div>
  );
}
