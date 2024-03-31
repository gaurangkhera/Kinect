import { CardBody, CardContainer, CardItem } from "@/components/global/3d-card";
import { HeroParallax } from "@/components/global/connect-parallax";
import { ContainerScroll } from "@/components/global/container-scroll-animation";
import { InfiniteMovingCards } from "@/components/global/infinite-moving-cards";
import { LampComponent } from "@/components/global/lamp";
import Navbar from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  //WIP: remove fault IMAge for home page
  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar />
      <section className="w-full bg-neutral-950 rounded-md overflow-auto relative flex flex-col items-center antialiased">
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="flex flex-col mt-5 md:mt-5">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <Link href="/app">
                  <Button
                    size={"lg"}
                    className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-muted bg-background hover:bg-muted group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-primary duration-500"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      Start For Free Today
                    </span>
                  </Button>
                </Link>
                <h1 className="text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-primary to-accent font-sans font-bold">
                  Connect with friends, family and more.
                </h1>
              </div>
            }
          />
        </div>
      </section>
    </main>
  );
}