import MichealDisasterFeed from "@/components/x-disaster-feed";
import Container from "../../components/ui/container";

export default function Home() {
  return (
       <Container>
    <main className="w-full flex items-center justify-between px-6 py-2 ">
      <MichealDisasterFeed />
    </main>
     </Container>
  );
}

