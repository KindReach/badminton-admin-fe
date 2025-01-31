import { useEffect, useState } from "react";
import styles from "./Basic.module.css";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

interface Props {
  book_id: string;
  place_name: string;
  location: string;
  limit_of_member: number;
  total_of_court: number;
  time: string;
  is_opening: boolean;
  price: number;
}

const Basic = ({
  book_id,
  place_name,
  location,
  limit_of_member,
  total_of_court,
  time,
  is_opening,
  price,
}: Props) => {
  const [switchMode, setSwitchMode] = useState<boolean>(true); // 結束報名 / 開放報名

  const navigate = useNavigate();

  const goSigned = () => {
    if (!is_opening) return;
    navigate(`/signed?book_id=${book_id}`);
  };

  useEffect(() => {
    console.log("is_opening: ", is_opening);
    setSwitchMode(is_opening);
  }, [is_opening]);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h2>場地資訊</h2>
        <p>
          <SlLocationPin style={{ marginRight: "10px" }} color="gray" />
          <a href={location} target="_blank">
            {place_name}
          </a>
        </p>
        <p>
          <GiTennisCourt style={{ marginRight: "10px" }} color="gray" />
          場地數量：{total_of_court}
        </p>
        <p>
          <GoPeople style={{ marginRight: "10px" }} color="gray" />
          人數上限：{limit_of_member} 人
        </p>
        <p>
          <FaRegClock style={{ marginRight: "10px" }} color="gray" />
          活動時間：{time}
        </p>
      </div>
      <div className={styles.contentContainer}>
        <h2>預約資訊</h2>
        <div className={styles.content}>
          <p className={styles.title}>場地費用</p>
          <p>NT$ {price}</p>
        </div>
        <div className={styles.content}>
          <p className={styles.title}>目前報名</p>
          <p>5</p>
        </div>

        <div className={styles.content}>
          <p className={styles.title}>候補人數</p>
          <p>0</p>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h2>快速動作</h2>
        <div className={styles.functions}>
          <button className={styles.switch}>
            {!switchMode ? "開放報名" : "結束報名"}
          </button>
          <button className={styles.sign} onClick={goSigned}>
            前往簽到
          </button>
        </div>
      </div>
    </div>
  );
};

export default Basic;
