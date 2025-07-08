import { useEffect, useState } from "react";
import styles from "./Member.module.css";
import { FiCheckCircle, FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";

interface Props {
  book_id: string;
  setRateofShow: (key: number) => void;
}

interface MemberProps {
  profile_picture: string;
  user_name: string;
  booking_time: string;
  is_show: boolean;
  is_accept: boolean;
}

const MemberInfo = ({
  profile_picture,
  user_name,
  booking_time,
  is_show,
  is_accept,
}: MemberProps) => {
  const getStatusText = () => {
    if (!is_accept) return "候補";
    if (is_show) return "已簽到";
    return "未簽到";
  };

  const getStatusClass = () => {
    if (!is_accept) return styles.waiting;
    if (is_show) return styles.signed;
    return styles.pending;
  };

  return (
    <div className={styles.memberRow}>
      <div className={styles.memberInfo}>
        <div className={styles.avatar}>
          <img src={profile_picture} alt={user_name} />
        </div>
        <div className={styles.details}>
          <div className={styles.nameSection}>
            <span className={styles.name}>{user_name}</span>
            {is_accept && <span className={styles.acceptBadge}>正取</span>}
          </div>
          <div className={styles.timeSection}>
            <span className={styles.timeLabel}>報名時間</span>
            <span className={styles.timeValue}>{booking_time}</span>
          </div>
        </div>
      </div>
      <div className={styles.statusSection}>
        <span className={`${styles.statusText} ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

const Member = ({ book_id, setRateofShow }: Props) => {
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [amountOfAccept, setAmountOfAccept] = useState<number>(0);
  const [amountOfSigned, setAmountOfSigned] = useState<number>(0);

  const getMembers = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/courtSession/getSessionMember`, {
        params: {
          book_id: book_id
        },
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      setMembers(data);
    } catch ( err ) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    }
    
  };

  useEffect(() => {
    if (!book_id) return;
    getMembers();
  }, [book_id]);

  useEffect(() => {
    let acceptCount = 0;
    let signedCount = 0;
    
    members.forEach((item) => {
      if (item.is_accept) acceptCount++;
      if (item.is_show) signedCount++;
    });
    
    setAmountOfAccept(acceptCount);
    setAmountOfSigned(signedCount);
  }, [members]);

  useEffect(() => {
    const rateOfShow = members.length > 0 
      ? Math.floor((amountOfSigned / members.length) * 100)
      : 0;
    
    if (!isNaN(rateOfShow)) {
      setRateofShow(rateOfShow);
    }
  }, [amountOfSigned, members.length]);

  const waitingCount = members.length - amountOfAccept;
  const attendanceRate = amountOfAccept > 0 ? Math.round((amountOfSigned / amountOfAccept) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* 統計數據 */}
      <div className={styles.statsContainer}>
        <div className={styles.statsHeader}>
          <h2>報名統計</h2>
          <p className={styles.statsSubtitle}>場次報名與出席狀況概覽</p>
        </div>
        
        <div className={styles.statsContent}>
          <div className={styles.statsRow}>
            <div className={`${styles.statItem} ${styles.accepted}`}>
              <div className={styles.statLeft}>
                <p className={styles.statLabel}>正取人數</p>
                <p className={styles.statValue}>{amountOfAccept}</p>
              </div>
              <div className={styles.statIcon}>
                <FiUserCheck />
              </div>
            </div>
            
            <div className={`${styles.statItem} ${styles.waiting}`}>
              <div className={styles.statLeft}>
                <p className={styles.statLabel}>候補人數</p>
                <p className={styles.statValue}>{waitingCount}</p>
              </div>
              <div className={styles.statIcon}>
                <FiUserX />
              </div>
            </div>
            
            <div className={`${styles.statItem} ${styles.signed}`}>
              <div className={styles.statLeft}>
                <p className={styles.statLabel}>簽到人數</p>
                <p className={styles.statValue}>{amountOfSigned}</p>
              </div>
              <div className={styles.statIcon}>
                <FiCheckCircle />
              </div>
            </div>
          </div>
          
          <div className={styles.summaryRow}>
            <div className={`${styles.summaryItem} ${styles.attendanceRate}`}>
              <span className={styles.summaryLabel}>出席率</span>
              <span className={styles.summaryValue}>
                {attendanceRate}%
                <span className={styles.percentage}>({amountOfSigned}/{amountOfAccept})</span>
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>總報名人數</span>
              <span className={styles.summaryValue}>{members.length} 人</span>
            </div>
          </div>
        </div>
      </div>

      {/* 成員列表 */}
      <div className={styles.memberSection}>
        <div className={styles.sectionHeader}>
          <h2>成員清單</h2>
          <span className={styles.memberCount}>共 {members.length} 人</span>
        </div>
        
        {members.length > 0 ? (
          <div className={styles.memberTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>成員資訊</div>
              <div className={styles.headerCell}>狀態</div>
            </div>
            <div className={styles.tableBody}>
              {members.map((item, index) => (
                <MemberInfo
                  key={index}
                  is_show={item.is_show}
                  is_accept={item.is_accept}
                  profile_picture={item.profile_picture}
                  user_name={item.user_name}
                  booking_time={item.booking_time}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <span className={styles.emptyText}>目前尚無報名資料</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Member;
