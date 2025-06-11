import { useEffect, useState } from "react";
import styles from "./Member.module.css";
import { FiCheckCircle, FiAlertTriangle, FiClock, FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import { FaRegQuestionCircle } from "react-icons/fa";
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
  const [state, setState] = useState<number>(0);

  // 狀態配置
  const statusConfig = [
    {
      icon: <FiCheckCircle className={styles.statusIcon} />,
      text: "已簽到",
      className: "signed"
    },
    {
      icon: <FiAlertTriangle className={styles.statusIcon} />,
      text: "候補中",
      className: "waiting"
    },
    {
      icon: <FaRegQuestionCircle className={styles.statusIcon} />,
      text: "未簽到",
      className: "pending"
    }
  ];

  useEffect(() => {
    if (!is_accept) {
      setState(1); // 候補中
    } else if (is_show) {
      setState(0); // 已簽到
    } else {
      setState(2); // 未簽到
    }
  }, [is_accept, is_show]);

  const currentStatus = statusConfig[state];
  const containerClass = `${styles.memberContainer} ${
    is_accept ? (is_show ? styles.signed : styles.accepted) : styles.waiting
  }`;

  return (
    <div className={containerClass}>
      <div className={styles.profile}>
        <div className={styles.headContainer}>
          <img src={profile_picture} alt={`${user_name}的頭像`} />
        </div>
        <div className={styles.description}>
          <h3 className={styles.userName}>
            {user_name}
            {is_accept && <FiUserCheck style={{ color: '#059669', fontSize: '14px' }} />}
          </h3>
          <p className={styles.bookingTime}>
            <FiClock className={styles.timeIcon} />
            報名時間：{booking_time}
          </p>
        </div>
        <div className={`${styles.statusBadge} ${styles[currentStatus.className]}`}>
          {currentStatus.icon}
          {currentStatus.text}
        </div>
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

  return (
    <div className={styles.container}>
      {/* 統計數據 */}
      <div className={styles.statsContainer}>
        <h2>報名統計</h2>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.accepted}`}>
            <FiUserCheck className={styles.statIcon} />
            <span className={styles.statValue}>{amountOfAccept}</span>
            <p className={styles.statLabel}>正取人數</p>
          </div>
          <div className={`${styles.statCard} ${styles.waiting}`}>
            <FiUserX className={styles.statIcon} />
            <span className={styles.statValue}>{waitingCount}</span>
            <p className={styles.statLabel}>候補人數</p>
          </div>
          <div className={`${styles.statCard} ${styles.signed}`}>
            <FiCheckCircle className={styles.statIcon} />
            <span className={styles.statValue}>{amountOfSigned}</span>
            <p className={styles.statLabel}>簽到人數</p>
          </div>
        </div>
      </div>

      {/* 成員列表 */}
      <div className={styles.memberSection}>
        <h2>成員列表</h2>
        <div className={styles.memberList}>
          {members.length > 0 ? (
            members.map((item, index) => (
              <MemberInfo
                key={index}
                is_show={item.is_show}
                is_accept={item.is_accept}
                profile_picture={item.profile_picture}
                user_name={item.user_name}
                booking_time={item.booking_time}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <FiUsers className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>暫無成員資料</h3>
              <p className={styles.emptyDescription}>
                目前還沒有人報名此場次
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Member;
