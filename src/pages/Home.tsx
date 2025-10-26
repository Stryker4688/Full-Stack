// pages/Home.tsx
import React from "react";
import Hero from "../components/sections/Hero";
import SpecialOffers from "../components/sections/SpecialOffers";
import CoffeeRecommender from "../components/sections/CoffeeRecommender";
import About from "../components/sections/About";
import LiveStock from "../components/sections/LiveStock";
import Menu from "../components/sections/Menu";
import Testimonials from "../components/sections/Testimonials"; 
import Contact from "../components/sections/Contact";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <SpecialOffers />
      <CoffeeRecommender />
      <About />
      <LiveStock />
      <Menu />
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;
