import styles from "./QuickSession.module.css";
import { CircleDashed, Play, CircleX } from 'lucide-react';
import { FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { sessionState, setCategory } from "@/state/sessionState/sessionState";
import { useDispatch } from "react-redux";

const QuickSession = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quickGo = async (category: sessionState) => {
    dispatch(setCategory(category));
    navigate("/books");
  };



  return (
    <div className={styles.container}>
      <h2>查看場次</h2>
      <div className={styles.container2}>
        
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(144, 238, 144, 0.5)" }}
            onClick={() => quickGo(sessionState.ONPROGRESS)}
          >
            <Play size={24} color="rgba(0, 128, 0, 1)" />
          </div>
          <p>進行中</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(255, 99, 71, 0.5)" }}
            onClick={() => quickGo(sessionState.OPENING)}
          >
            <FaFire size={24} color="rgba(255, 0, 0, 1)" />
          </div>
          <p>報名中</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(255, 204, 102, 0.5)" }}
            onClick={() => quickGo(sessionState.CLOSED)}
          >
            <CircleX size={24} color="rgba(255, 165, 0, 1)" />
          </div>
          <p>尚未開放</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(211, 211, 211, 0.5)" }}
            onClick={() => quickGo(sessionState.ENDED)}
          >
            <CircleDashed size={24} color="rgba(128, 128, 128, 1)" />
          </div>
          <p>已結束</p>
        </div>
      </div>
    </div>
  );
};

export default QuickSession;
