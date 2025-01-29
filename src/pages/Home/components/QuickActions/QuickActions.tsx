import styles from "./QuickAction.module.css";
import { IoIosAdd } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const quickGo = async (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <h2>快速操作</h2>
      <div className={styles.container2}>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(173, 216, 230, 0.5)" }}
          >
            <IoIosAdd size={24} color="rgba(0, 0, 255, 1)" />
          </div>
          <p>新增場次</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(144, 238, 144, 0.5)" }}
            onClick={() => quickGo("/signlist")}
          >
            <IoMdCheckmarkCircleOutline size={24} color="rgba(0, 128, 0, 1)" />
          </div>
          <p>簽到表</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(255, 204, 102, 0.5)" }}
          >
            <GoPeople size={24} color="rgba(255, 165, 0, 1)" />
          </div>
          <p>會員管理</p>
        </div>
        <div className={styles.function}>
          <div
            className={styles.icon}
            style={{ backgroundColor: "rgba(211, 211, 211, 0.5)" }}
          >
            <IoSettingsOutline size={24} color="rgba(128, 128, 128, 1)" />
          </div>
          <p>設定</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
