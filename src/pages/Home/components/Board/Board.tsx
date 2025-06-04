import styles from "./Board.module.css";
import { MdCalendarToday } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface BoardType { 
  amount_of_session: number;
  amount_of_participant: number;
  amount_of_new_member: number; 
  income: number;
}

const Board = () => {
  const dispatch = useDispatch();
  const [boardData, setBoardData] = useState<BoardType>({
    amount_of_session: 0,
    amount_of_participant: 0,
    amount_of_new_member: 0,
    income: 0,
  });

  const getBoardData = async () => {
    try {
      dispatch(setLoading2(true));
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/board/getBoard`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setBoardData(data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading2(false));
    }
  };

  useEffect(() => {
    getBoardData();
  }, []);

  return (
    <div className={styles.container}>
      <h2>今日概覽</h2>
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          <div className={styles.description}>
            <MdCalendarToday style={{ color: "blue" }} />
            <p>今日場次</p>
          </div>
          <h2>{ boardData.amount_of_session }</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <GoPeople style={{ color: "green" }} />
            <p>參與人數</p>
          </div>
          <h2>{ boardData.amount_of_participant }</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <IoIosTrendingUp style={{ color: "orange" }} />
            <p>新增會員</p>
          </div>
          <h2>{ boardData.amount_of_new_member }</h2>
        </div>
        <div className={styles.board}>
          <div className={styles.description}>
            <IoIosTrendingUp style={{ color: "blue" }} />
            <p>營收</p>
          </div>
          <h2>${ boardData.income }</h2>
        </div>
      </div>
    </div>
  );
};

export default Board;
