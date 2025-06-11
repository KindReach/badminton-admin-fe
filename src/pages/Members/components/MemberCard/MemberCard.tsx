import styles from "./MemberCard.module.css";
import { MemberProps } from "@/utils/types";
import { TiStarFullOutline } from "react-icons/ti";
import { LuCircleAlert } from "react-icons/lu";
import { MdOutlineCancel } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Offcanvas } from "react-bootstrap";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface Props extends MemberProps {
  setUpdateStatus: Dispatch<SetStateAction<boolean>>;
}

const MemberCard = ({
  user_id,
  user_name,
  profile_picture,
  is_blocked,
  amount_of_no_show,
  amount_of_book,
  add_time,
  setUpdateStatus
}: Props) => {
  const stateConfig = useMemo(() => ({
    icons: [<FiCheckCircle key="normal" />, <LuCircleAlert key="warning" />, <MdOutlineCancel key="blocked" />],
    content: ["正常", "警告", "已封鎖"],
    colors: ["#3b82f6", "#f59e0b", "#ef4444"],
    bgColors: ["#eff6ff", "#fef3c7", "#fee2e2"]
  }), []);

  const [state, setState] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setState(is_blocked ? 2 : 0);
  }, [is_blocked]);

  const noShowRate = useMemo(() => {
    return amount_of_book > 0 ? ((amount_of_no_show / amount_of_book) * 100).toFixed(1) : 0;
  }, [amount_of_no_show, amount_of_book]);

  const handleSwitchBlock = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    dispatch(setLoading2(true));
    
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.post(
        `${apiPrefix}/members/switchBlock`,
        { user_id },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setUpdateStatus((prev) => !prev);
      setShow(false);
    } catch (err) {
      console.error("封鎖狀態切換失敗:", err);
    } finally {
      setIsLoading(false);
      dispatch(setLoading2(false));
    }
  };

  const handleCardClick = () => {
    setShow(true);
  };

  return (
    <>
      <div className={styles.memberContainer} onClick={handleCardClick}>
        <div className={styles.profile}>
          <div className={styles.headContainer}>
            <img src={profile_picture} alt={`${user_name}的頭像`} />
          </div>
          <div className={styles.description}>
            <h2>{user_name}</h2>
            <p className={styles.time}>加入時間：{add_time}</p>
          </div>
        </div>

        <div className={styles.functions}>
          <p>參與：{amount_of_book} 次</p>
          <p>取消：{amount_of_no_show} 次</p>
          <p className={styles.rate}>取消率：{noShowRate}%</p>
        </div>
        
        <div
          className={styles.state}
          style={{
            color: stateConfig.colors[state],
            backgroundColor: stateConfig.bgColors[state],
          }}
        >
          {stateConfig.icons[state]}
          <span>{stateConfig.content[state]}</span>
        </div>
        
        <MdKeyboardArrowRight className={styles.arrowIcon} />
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="bottom"
        backdrop="static"
        className={styles.customOffcanvas}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>
            會員詳情
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className={styles.offcanvasBody}>
          <div className={styles.memberDetails}>
            <div className={styles.memberInfo}>
              <img src={profile_picture} alt={`${user_name}的頭像`} className={styles.largeAvatar} />
              <h3>{user_name}</h3>
              <div
                className={styles.statusBadge}
                style={{
                  color: stateConfig.colors[state],
                  backgroundColor: stateConfig.bgColors[state],
                }}
              >
                {stateConfig.icons[state]}
                <span>{stateConfig.content[state]}</span>
              </div>
            </div>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>加入時間</span>
                <span className={styles.statValue}>{add_time}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>參與次數</span>
                <span className={styles.statValue}>{amount_of_book} 次</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>取消次數</span>
                <span className={styles.statValue}>{amount_of_no_show} 次</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>取消率</span>
                <span className={styles.statValue}>{noShowRate}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${state === 2 ? styles.unblockBtn : styles.blockBtn}`}
              onClick={handleSwitchBlock}
              disabled={isLoading}
            >
              {isLoading ? "處理中..." : (state === 2 ? "解除封鎖" : "封鎖會員")}
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MemberCard;
