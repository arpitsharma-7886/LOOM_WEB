import React from 'react';
import MainTemplate from '../components/MainTemplate';
import Hero from '../components/Hero';
import ShopByCategories from '../components/ShopByCategory';
import NewAndPopular from '../components/NewAndPopular';

const Home = () => {
  return (
    <MainTemplate>
      <Hero />
      <ShopByCategories />
      <NewAndPopular />
    </MainTemplate>
  );
};

export default Home;