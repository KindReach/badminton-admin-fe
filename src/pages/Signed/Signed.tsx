import Header from "@/components/Header/Header";
import styles from "./Signed.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { CheckCircle2, User, Clock, AlertTriangle, X } from "lucide-react";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface HeaderProps {
  place_name: string;
  team_name: string;
  date: string;
  time: string;
  amount_of_member: number;
  limit_of_member: number;
  total_of_court: number;
}

interface MemberProps {
  book_id: string;
  id: string;
  user_name: string;
  profile_picture: string;
  book_time?: string;
  is_show: boolean;
  setUpdateStatus?: Dispatch<SetStateAction<boolean>>;
}

const Member = ({
  book_id,
  id,
  user_name,
  profile_picture,
  is_show,
  setUpdateStatus,
}: MemberProps) => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSigned = async () => {
    setIsSubmitting(true);
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/signed/signed`,
        {
          user_id: id,
          book_id: book_id,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (setUpdateStatus) setUpdateStatus((prev) => !prev);
      setShow(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading2(false));
    }
  };

  // 點擊遮罩關閉
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      setShow(false);
    }
  };

  // 阻止背景滾動
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  return (
    <>
      <div className={styles.member}>
        <div className={styles.profile}>
          <div className={styles.headContainer}>
            <img src={profile_picture} alt="head image" />
          </div>
          <h2>{user_name}</h2>
        </div>
        {is_show ? (
          <p className={styles.state} style={{ color: `rgba(40, 167, 69, 1)` }}>
            <FiCheckCircle style={{ marginRight: "2px" }} /> 已簽到
          </p>
        ) : (
          <button
            className={`${styles.state} ${styles.btn}`}
            onClick={() => setShow(true)}
          >
            簽到
          </button>
        )}
      </div>

      {/* 自定義 Modal */}
      {show && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            {/* 頂部指示器 */}
            <div className={styles.indicator}></div>
            
            {/* 關閉按鈕 */}
            {!isSubmitting && (
              <button className={styles.closeBtn} onClick={() => setShow(false)}>
                <X />
              </button>
            )}

            {/* 內容區域 */}
            <div className={styles.modalContent}>
              {/* 圖標區域 */}
              <div className={styles.iconContainer}>
                <CheckCircle2 className={styles.icon} />
              </div>

              {/* 使用者資訊 */}
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <img src={profile_picture} alt={user_name} />
                </div>
                <div className={styles.userDetails}>
                  <h3>{user_name}</h3>
                  <p className={styles.confirmText}>
                    <User className={styles.infoIcon} />
                    確認此會員已付款且到場
                  </p>
                  <p className={styles.timeInfo}>
                    <Clock className={styles.infoIcon} />
                    簽到時間：{new Date().toLocaleString('zh-TW')}
                  </p>
                </div>
              </div>

              {/* 警告提示 */}
              <div className={styles.warningNote}>
                <AlertTriangle className={styles.warningIcon} />
                <p>此動作完成後將無法撤銷，請確認會員已完成付款</p>
              </div>
            </div>

            {/* 按鈕區域 */}
            <div className={styles.modalActions}>
              <button 
                className={`${styles.actionBtn} ${styles.secondary}`}
                onClick={() => setShow(false)}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.primary} ${isSubmitting ? styles.submitting : ''}`}
                onClick={handleSigned}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    處理中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 />
                    確認簽到
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Signed = () => {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 提取 book_id
  const book_id = searchParams.get("book_id");

  if (!book_id) {
    navigate("/");
  }

  const [bookData, setBookData] = useState<HeaderProps>({
    place_name: "",
    team_name: "",
    date: "",
    time: "",
    amount_of_member: 0,
    limit_of_member: 0,
    total_of_court: 0,
  });

  const getNavData = async () => {
    
    try {
      dispatch(setLoading2(true));
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/courtSession/getDetail`, {
        params: {
          book_id: book_id,
        },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setBookData({
        place_name: data["place_name"],
        team_name: data["team_name"],
        date: data["date"],
        time: data["time"],
        amount_of_member: data["amount_of_member"],
        limit_of_member: data["limit_of_member"],
        total_of_court: data["total_of_court"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading2(false));
    }
  };

  const getMemberData = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(
        `${apiPrefix}/courtSession/signedMembers`,
        {
          params: {
            book_id: book_id,
          },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      (data as MemberProps[]).sort(
        (a, b) => Number(b.is_show) - Number(a.is_show)
      );
      setMembers(data as MemberProps[]);
    } catch (err) {
      console.error(err);
    }
    dispatch(setLoading2(false));
  };

  useEffect(() => {
    getMemberData();
  }, [updateStatus]);

  useEffect(() => {
    getNavData();
  }, []);

  return (
    <div className={styles.container}>
      <Header
        book_id={book_id as string}
        place_name={bookData.place_name}
        team_name={bookData.team_name}
        date={bookData.date}
        time={bookData.time}
        amount_of_total={bookData.limit_of_member}
        amount_of_member={bookData.amount_of_member}
        nav_title="簽到表"
      />

      <div className={styles.memberList}>
        {members.map((item, index) => (
          <Member
            key={index}
            book_id={book_id as string}
            id={item.id}
            user_name={item.user_name}
            profile_picture={item.profile_picture}
            is_show={item.is_show}
            setUpdateStatus={setUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Signed;
