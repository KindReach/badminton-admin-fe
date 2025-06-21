import styles from "./upComing.module.scss";
import { Calendar, Clock, ArrowRight, Users } from "lucide-react";
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

  const getOccupancyRate = () => {
    return (amount_of_member / limit_of_member) * 100;
  };

  const getOccupancyStatus = () => {
    const rate = getOccupancyRate();
    if (rate >= 90) return { status: 'full', color: '#ef4444', bgColor: '#fef2f2' };
    if (rate >= 70) return { status: 'high', color: '#f59e0b', bgColor: '#fef3c7' };
    if (rate >= 40) return { status: 'medium', color: '#3b82f6', bgColor: '#eff6ff' };
    return { status: 'low', color: '#10b981', bgColor: '#ecfdf5' };
  };

  const occupancyStatus = getOccupancyStatus();

  return (
    <div 
      className={styles.bookContainer} 
      onClick={goDetail}
    >
      <div className={styles.header}>
        <div className={styles.placeInfo}>
          <h3 className={styles.placeName}>{place_name}</h3>
          <span className={styles.bookId}>#{book_id.substring(0, 6)}</span>
        </div>
        <div 
          className={styles.occupancyBadge}
          style={{
            color: occupancyStatus.color,
            backgroundColor: occupancyStatus.bgColor,
          }}
        >
          <Users size={12} />
          <span>{amount_of_member}/{limit_of_member}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.timeInfo}>
          <div className={styles.infoItem}>
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className={styles.infoItem}>
            <Clock size={16} />
            <span>{time}</span>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{
                width: `${getOccupancyRate()}%`,
                backgroundColor: occupancyStatus.color,
              }}
            />
          </div>
          <span className={styles.progressText}>
            {getOccupancyRate().toFixed(0)}% 已預約
          </span>
        </div>
      </div>
    </div>
  );
};

const UpComing = () => {
  const [bookingData, setBookingData] = useState<BookInfo[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getUpComingData = async () => {
    dispatch(setLoading2(true));

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(
        `${apiPrefix}/courtSession/upcommingSessions`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setBookingData(data);
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  };

  useEffect(() => {
    getUpComingData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>即將開始的場次</h2>
          <span className={styles.subtitle}>
            {bookingData.length} 個即將開始的場次
          </span>
        </div>
        <button 
          className={styles.viewAllBtn}
          onClick={() => navigate("/books")}
        >
          查看全部
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className={styles.listContainer}>
        {bookingData.length > 0 ? (
          bookingData.map((item, index) => (
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
          ))
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} className={styles.emptyIcon} />
            <h3>目前沒有即將開始的場次</h3>
            <p>請稍後再來查看或創建新的場次</p>
          </div>
        )}
      </div>
      
      {bookingData.length > 0 && (
        <button 
          className={styles.mainActionBtn} 
          onClick={() => navigate("/books")}
        >
          查看全部場次
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default UpComing;
