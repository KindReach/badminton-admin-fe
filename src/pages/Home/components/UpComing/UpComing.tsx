import styles from "./upComing.module.css";
import data from "./data.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface BookInfo {
  book_id: string;
  place_name: string;
  team_name: string;
  time: string;
  date: string;
  amount_of_member: number;
  limit_of_member: number;
}

const Book = ({
  book_id,
  place_name,
  team_name,
  date,
  time,
  limit_of_member,
  amount_of_member,
}: BookInfo) => {
  const navigate = useNavigate();

  const goDetail = () => {
    navigate(`/detail?book_id=${book_id}`);
  };

  return (
    <div className={styles.bookContainer} onClick={goDetail}>
      <div className={styles.infoLeft}>
        <h2>
          {place_name}（{book_id.substring(0, 3)}）
        </h2>
        <p>{team_name}</p>
        <p>
          {amount_of_member}/{limit_of_member}
        </p>
      </div>
      <div className={styles.infoRight}>
        <p>{time}</p>
        <div className={styles.functions}>
          <button className={styles.btnManage}>管理</button>
          <button className={styles.btnSign}>簽到表</button>
        </div>
      </div>
    </div>
  );
};

const UpComing = () => {
  const [bookingData, setBookingData] = useState<BookInfo[]>([]);
  const dispatch = useDispatch();
  const getUpComingData = async () => {
    dispatch(setLoading2(true));

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/courtSession/upcommingSessions`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      setBookingData(data);
    } catch ( err ) {
      console.error(err);
    }
    requestAnimationFrame(() => {
      // 確保在下一個畫面更新週期才關閉 loading
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  }


  useEffect(() => {
    getUpComingData();
    // setBookingData(data);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>即將開始的場次</h2>
        <a href="/books">查看全部</a>
      </div>
      <div className={styles.listContainer}>
        {bookingData.map((item, index) => (
          <Book
            key={index}
            book_id={item.book_id}
            place_name={item.place_name}
            team_name={item.team_name}
            amount_of_member={item.amount_of_member}
            limit_of_member={item.limit_of_member}
            date={item.date}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
};

export default UpComing;
