import { auth } from "@/utils/firebase";
import React, { useEffect } from "react";
import styles from "./Home.module.css";
import Header from "./components/Header/Header";
import Board from "./components/Board/Board";
import QuickActions from "./components/QuickActions/QuickActions";
import UpComing from "./components/UpComing/UpComing";

const Home = () => {
  // useEffect(() => {
  //   auth.signOut();
  // }, []);

  return (
    <div className={styles.container}>
      <Header />
      <Board />
      <QuickActions />
      <UpComing />
    </div>
  );
};

export default Home;
