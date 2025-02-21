import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Basic.module.css";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface Props {
  book_id: string;
  place_name: string;
  location: string;
  limit_of_member: number;
  amount_of_member: number;
  total_of_court: number;
  time: string;
  is_opening: boolean;
  price: number;
  setUpdateStatus: Dispatch<SetStateAction<boolean>>;
}

const Basic = ({
  book_id,
  place_name,
  location,
  amount_of_member,
  limit_of_member,
  total_of_court,
  time,
  is_opening,
  price,
  setUpdateStatus,
}: Props) => {
  const [switchMode, setSwitchMode] = useState<boolean>(true); // 結束報名 / 開放報名
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const goSigned = () => {
    navigate(`/signed?book_id=${book_id}`);
  };

  useEffect(() => {
    console.log("is_opening: ", is_opening);
    setSwitchMode(is_opening);
  }, [is_opening]);

  const switchOpening = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/courtSession/switchOpening`,
        {
          book_id: book_id,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setUpdateStatus((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading2(false));
  };

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
          <p>{Math.min(amount_of_member, limit_of_member)}</p>
        </div>

        <div className={styles.content}>
          <p className={styles.title}>候補人數</p>
          <p>{Math.max(0, amount_of_member - limit_of_member)}</p>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h2>快速動作</h2>
        <div className={styles.functions}>
          <button className={styles.switch} onClick={switchOpening}>
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
