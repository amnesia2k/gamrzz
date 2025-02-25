import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faq from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Gamrzz</title>
        <meta
          name="description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta
          name="keywords"
          content="Gamrzz, mobile gaming, esports recruitment, gaming platform, team recruiters, gamers, clan contracts, player applications, competitive gaming, mobile esports"
        />
        <meta name="author" content="Gamrzz" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gamrzz" />
        <meta
          property="og:description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta property="og:url" content="https://gamrzz.vercel.app/" />
        <meta
          property="og:image"
          content="https://gamrzz.vercel.app/ms-icon-310x310.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gamrzz" />
        <meta
          name="twitter:description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta
          name="twitter:image"
          content="https://gamrzz.vercel.app/ms-icon-310x310.png"
        />
      </Helmet>

      <main className="flex flex-col gap-10 sm:gap-20 py-10 sm-py-20">
        <section className="text-center">
          <h1 className="flex flex-col items-center justify-center gradient-title text-4xl md:text-6xl  lg:text-7xl lg:text-8xl tracking-tighter py-4 font-extrabold">
            Find Your Dream Team{" "}
            <span className="flex items-center gap-2 md:gap-6">
              here on{" "}
              <img
                src="/logo-white.png"
                alt="logo"
                className="h-[40px] w-[140px] md:h-[60px] md:w-[200px] lg:w-[300px] lg:h-[100px]"
              />
            </span>
          </h1>
          <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
            Explore hundreds of clan openings or find the perfect player!
          </p>
        </section>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 justify-center">
          <Link to="/contracts">
            <Button variant="blue" size="xl">
              Find a Contract
            </Button>
          </Link>
          <Link to="/post-contract">
            <Button variant="destructive" size="xl">
              Post a Contract
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full py-10"
        >
          <CarouselContent className="flex gap-5 sm:gap-20 items-center">
            {companies.map(({ id, name, path }) => (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Banner */}
        <img src="/banner.jpg" alt="banner" className="w-full" />

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle>For Players looking for Teams</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              Search for clans looking for talented players like you and apply
              to join
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle>For Clans and Guilds</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              Create openings, manage applications, and find the best candidate
            </CardContent>
          </Card>
        </section>

        {/* Accordion */}
        <Accordion type="single" collapsible>
          {faq.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
};

export default Home;
