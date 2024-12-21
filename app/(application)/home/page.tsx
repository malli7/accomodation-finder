"use client"
import { SyncUserToFirestore } from "@/app/utils/SyncUserToFirestore";
import HomePage from "@/app/components/homePageComponents/Home";

import React from "react";

const Home = () => {

  SyncUserToFirestore()
  return (
    <>
      <HomePage />
    </>
  );
};

export default Home;
