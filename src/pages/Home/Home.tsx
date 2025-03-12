import { auth, apiPrefix } from "@/utils/firebase";
import React, { useEffect } from "react";
import styles from "./Home.module.css";
import Header from "./components/Header/Header";
import Board from "./components/Board/Board";
import QuickActions from "./components/QuickActions/QuickActions";
import UpComing from "./components/UpComing/UpComing";
import QuickSession from "./components/QuickSession/QuickSession";

const Home = () => {

  return (
    <div className={styles.container}>
      <Header />
      <Board />
      <QuickActions />
      <QuickSession />
      <UpComing />
      <footer className={styles.footer}>© 2025 KindReach 羽球系統 | 版權所有</footer>
    </div>
  );
};

export default Home;
