import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
