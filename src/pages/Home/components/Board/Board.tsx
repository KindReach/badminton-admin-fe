import styles from "./Board.module.css";
import { MdCalendarToday } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";

const Board = () => {
  return (
    <div className={styles.container}>
      <h2>今日概覽</h2>
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          <div className={styles.description}>
            <MdCalendarToday style={{ color: "blue" }} />
            <p>今日場次</p>
          </div>
          <h2>5</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <GoPeople style={{ color: "green" }} />
            <p>參與人數</p>
          </div>
          <h2>32</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <IoIosTrendingUp style={{ color: "orange" }} />
            <p>出席率</p>
          </div>
          <h2>92%</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <IoIosTrendingUp style={{ color: "blue" }} />
            <p>營收</p>
          </div>
          <h2>$3200</h2>
        </div>
      </div>
    </div>
  );
};

export default Board;
