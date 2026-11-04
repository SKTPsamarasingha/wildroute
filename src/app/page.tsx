import React from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getProducts } from "@/services/productService";
import { getTours } from "@/services/tourService";
import { ArrowRight, ArrowDownRight, MoveRight } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const tours = await getTours();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#F8F9F5] font-sans selection:bg-[#F3CE32] selection:text-[#0C1A14]">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="editorial-hero relative h-screen min-h-[700px] flex items-center  overflow-hidden">
          <div className="hero-cinematic-mask absolute inset-0 z-0">
            <div className="hero-cinematic-img absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613693687360-8b0d54705746?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0C1A14]"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20">
            <h1 className="font-serif font-black text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight drop-shadow-2xl">
              <span className="hero-title-line block text-[#F3CE32]">
                <span className="hero-serif-slide">EXPLORE</span>
              </span>
              <span className="hero-title-line block text-white">
                <span className="hero-serif-slide">BEYOND</span>
              </span>
              <span className="hero-title-line block text-white ml-0 md:ml-32">
                <span className="hero-serif-slide">LIMITS</span>
              </span>
            </h1>

            <p className="mt-8 text-white/90 text-sm md:text-base font-medium max-w-sm ml-0 md:ml-32 leading-relaxed">
              Adventure begins beyond comfort. Step into the wild, breathe
              deeply & rediscover the world in its purest form.
            </p>

            <div className="ml-0 md:ml-32 mt-8">
              <Link
                href="/tours"
                className="motion-magnetic inline-flex px-8 py-4 bg-[#F3CE32] text-black font-black uppercase tracking-widest text-xs items-center gap-2"
                data-magnetic-strength="0.3"
              >
                Book Expedition <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3-CARD GRID SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="home-scroll-reveal bg-white text-black p-6 flex flex-col justify-between min-h-[450px] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#F3CE32]"></div>
              <div>
                <h3 className="font-serif text-3xl font-bold uppercase leading-none mb-6">
                  Sustainable
                  <br />
                  Escapes
                </h3>
                <div className="hero-cinematic-mask w-full aspect-[4/3] relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1531201890865-fb64780d16e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U3VzdGFpbmFibGUlMjBFc2NhcGVzJTIwaW4lMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Safari Giraffes"
                    fill
                    className="hero-cinematic-img object-cover"
                  />
                </div>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest border-b border-black/10 pb-4 mb-4">
                  <span>Forest Trails</span>
                  <span>• Eco Living</span>
                  <span>• Wildlife Spotting</span>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                Eco-friendly journeys tailored for explorers who crave
                meaningful experiences, blending adventure, sustainability, and
                emotion in every step.
              </p>
            </div>

            {/* Card 2 */}
            <div className="home-scroll-reveal bg-[#F3CE32] text-black p-2 flex flex-col min-h-[450px] relative">
              <div className="hero-cinematic-mask w-full aspect-square relative mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW4lMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Rhino"
                  fill
                  className="hero-cinematic-img object-cover"
                />
              </div>
              <div className="px-4 pb-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold uppercase leading-none mb-4">
                    Inside
                    <br />
                    Experience
                  </h3>
                  <p className="text-xs font-medium leading-relaxed max-w-[90%]">
                    Step beyond the surface and into the heart of the journey.
                    This is where the feeling, atmosphere, & true essence of the
                    moment come alive.
                  </p>
                </div>
                <ArrowDownRight
                  className="w-12 h-12 self-end mt-4"
                  strokeWidth={1}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="home-scroll-reveal isolate bg-white text-white p-8 flex flex-col justify-between min-h-[450px] relative">
              <div className="hero-cinematic-mask absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1543043204-3f4e66dc5c2b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                  alt="Rhino"
                  fill
                  className="hero-cinematic-img z-0 object-cover"
                />
              </div>
              <div className="absolute right-0 top-0 z-10 w-1 h-full bg-[#0C1A14]"></div>
              <div className="relative z-10">
                <span className="font-serif text-6xl font-black block mb-4">
                  01
                </span>
                <h3 className="font-serif text-2xl font-bold uppercase leading-tight">
                  Eco Award
                  <br />
                  Mention
                </h3>
              </div>
              <div className="relative z-10 border-t border-black/10 pt-6">
                <p className="text-2xl font-medium leading-snug tracking-tight">
                  Green Camp is a leader in eco-friendly, purpose built
                  journeys.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY SECTION */}
        <section className="home-scroll-reveal py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] mb-8">
            <span className="hero-title-line">
              <span className="hero-serif-slide">
                Wildroute is the place where nature, adventure, and
                sustainability come together.
              </span>
            </span>
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/2 relative">
              <Image
                src="https://images.unsplash.com/photo-1729196014295-fdc3d621f967?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Rhino"
                fill
                className="hero-cinematic-img z-0 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-[1.1]">
                  <span className="hero-title-line">
                    <span className="hero-serif-slide">
                      Wander through lush forests, crystal clear rivers &
                      thriving wildlife while enjoying eco-friendly travel at
                      finest.
                    </span>
                  </span>
                </h2>
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/80 max-w-md">
                Journey through lush forests, crystal clear rivers, vibrant
                wildlife zones, and eco-conscious community spaces designed to
                inspire mindful exploration.
              </p>
            </div>
          </div>
        </section>

        {/* PARTNERS SECTION */}
        <section className="home-scroll-reveal py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
          <h2 className="font-serif font-black text-5xl md:text-7xl lg:text-[8rem] uppercase leading-[0.85] tracking-tight relative z-10">
            <span className="hero-title-line block text-[#F3CE32]">
              <span className="hero-serif-slide">SUPPORTING</span>
            </span>
            <span className="hero-title-line block text-white">
              <span className="hero-serif-slide">SUSTAINABILITY</span>
            </span>
            <span className="hero-title-line block text-white text-center md:text-left md:ml-24">
              <span className="hero-serif-slide">PARTNERS</span>
            </span>
          </h2>

          <div className="mt-12 flex flex-col md:flex-row items-center gap-12 md:gap-32 relative z-10">
            <p className="text-sm font-medium leading-relaxed text-white/80 max-w-sm ml-0 md:ml-32">
              We're grateful to work alongside organizations that share our
              commitment to sustainability and conservation.
            </p>
          </div>

          {/* Yellow Starburst shape */}
          <div className="absolute right-10 md:right-32 bottom-0 md:bottom-20 z-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="absolute w-full h-full text-[#F3CE32] animate-[spin_20s_linear_infinite]"
                fill="currentColor"
              >
                <path d="M100 0L115.359 29.5085L147.553 15.4508L151.745 49.336L183.824 46.1281L173.344 78.4348L200 93.3013L176.791 118.847L194.276 148.618L161.42 160.297L165.418 193.969L132.88 189.658L120.407 218.805L93.7538 199.141L69.317 222.753L53.7911 193.364L21.3656 200.758L22.6109 167.147L-7.85908 152.025L13.7852 124.966L-8.48774 97.4691L18.1505 76.5173L5.3523 45.4227L38.1633 36.6373L39.7342 3.03268L71.1894 10.9922L84.641 -18.2323L100 0Z" />
              </svg>
              <span className="relative z-10 text-black font-bold text-[10px] tracking-widest uppercase text-center w-24">
                Explore
                <br />
                The Camp
              </span>
            </div>
          </div>
        </section>

        {/* 3-CARD PLACES SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Card 1 - Nature */}
            <div className="home-scroll-reveal bg-white text-black p-6 flex flex-col h-full min-h-[400px]">
              <p className="text-[10px] font-medium leading-relaxed max-w-[90%] mb-6">
                Eco-friendly journeys tailored for explorers who crave
                meaningful experiences, blending adventure, sustainability, and
                emotion in every step.
              </p>
              <div className="hero-cinematic-mask relative flex-1 w-full min-h-[200px] mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2015&auto=format&fit=crop"
                  alt="Tiger"
                  fill
                  className="hero-cinematic-img object-cover"
                />
              </div>
              <h3 className="font-serif text-4xl md:text-5xl font-bold uppercase text-center tracking-tight">
                Nature
              </h3>
            </div>

            {/* Card 2 - Places */}
            <div className="home-scroll-reveal bg-white text-black p-6 flex flex-col h-full min-h-[400px]">
              <h3 className="font-serif text-4xl md:text-5xl font-bold uppercase text-center tracking-tight mb-6">
                Places
              </h3>
              <div className="hero-cinematic-mask relative flex-1 w-full min-h-[200px] mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop"
                  alt="Jeeps"
                  fill
                  className="hero-cinematic-img object-cover"
                />
              </div>
              <p className="text-[10px] font-medium leading-relaxed">
                Discover the unique and breathtaking locations that make
                Wildroute a true haven for eco-adventurers. From lush,
                whispering forests and pristine, crystal-clear rivers to vibrant
                wildlife zones teeming with life.
              </p>
            </div>

            {/* Card 3 - Travel */}
            <div className="home-scroll-reveal relative h-full min-h-[400px] p-6 flex flex-col justify-between overflow-hidden group">
              <div className="hero-cinematic-mask absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW4lMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Rhino"
                  fill
                  className="hero-cinematic-img object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute right-0 top-0 z-10 w-1 h-full bg-[#0C1A14]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="relative z-10 text-white flex justify-end">
                <p className="text-[10px] font-medium text-right max-w-[150px]">
                  Special unique tours and authentic outdoor experiences
                  immersed in nature and carefully tailored.
                </p>
              </div>
              <h3 className="relative z-10 font-serif text-4xl md:text-5xl font-bold uppercase text-[#F3CE32] tracking-tight mt-auto">
                Travel
              </h3>
            </div>
          </div>
        </section>

        <section className="metrics-section py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="h-px w-full bg-white/20 mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="home-scroll-reveal border border-white/15 p-8">
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="230"
                data-suffix="+"
              >
                230+
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Completed Events
              </p>
            </div>
            <div className="home-scroll-reveal border border-white/15 p-8">
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="300"
                data-suffix="+"
              >
                300+
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Community Members
              </p>
            </div>
            <div className="home-scroll-reveal border border-white/15 p-8">
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="48"
                data-suffix=""
              >
                48
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Guided Expeditions
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
