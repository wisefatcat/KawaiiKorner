import Banner from "../components/Banner";
import Background from "../Background/Background";

export default function Home() {
  const data = {
    title: "Kawaii Korner",
    content:
      "Embrace Your Kawaii Side: Your Ultimate Destination for Anime and Cosplay Delights!",
    destination: "/products",
    label: "Buy now!",
  };

  return (
    <>
      <Background />
      <Banner data={data} />
    </>
  );
}
