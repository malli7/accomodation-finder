"use client"
import { SyncUserToFirestore2 } from "@/app/components/SyncUserToFirestore2";
import HomePage from "@/app/components/homePageComponents/Home";

import React from "react";

const Home = () => {

  SyncUserToFirestore2()
  return (
    <>
      <HomePage />
    </>
  );
};

export default Home;
