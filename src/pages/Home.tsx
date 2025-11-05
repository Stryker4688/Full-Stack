// pages/Home.tsx
import React from "react";
import Hero from "../components/sections/Hero";
import SpecialOffers from "../components/sections/SpecialOffers";
import CoffeeRecommender from "../components/sections/CoffeeRecommender";
import About from "../components/sections/About";
import LiveStock from "../components/sections/BestSellers";
import Menu from "../components/sections/Menu";
import Testimonials from "../components/sections/Testimonials";
import Contact from "../components/sections/Contact";

const Home: React.FC = () => {
  return (
    <>
      <section id="home">
        <Hero />
      </section>
      <section id="offer">
        <SpecialOffers />
      </section>
      <LiveStock />
      <section id="menu">
        <Menu />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="testimonial">
        <Testimonials />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  );
};

export default Home;
