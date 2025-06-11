import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Basic.module.css";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock, FaUserLock, FaUsers, FaClock } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { MdContentCopy, MdCheckCircle } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { Modal } from "react-bootstrap";
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";

interface Props {
  team_id: string;
  book_id: string;
  place_name: string;
  location: string;
  limit_of_member: number;
  amount_of_member: number;
  total_of_court: number;
  date: string;
  time: string;
  is_opening: boolean;
  price: number;
  is_public: boolean;
  setUpdateStatus: Dispatch<SetStateAction<boolean>>;
}

interface ModalProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  book_id: string;
}
const Modals = ({ show, setShow, book_id }: ModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async () => {
    setShow(false);
    if (!book_id) return;
    try {
      dispatch(setLoading2(true));
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("idToken is null");
      const { data } = await axios.post(
        `${apiPrefix}/courtSession/delete`,
        {
          book_id: book_id,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      dispatch(
        setModalState({
          title: "提醒",
          message: "刪除成功",
          level: ModalLevel.SUCCESS,
        })
      );
    } catch (err) {
      dispatch(
        setModalState({
          title: "提醒",
          message: "刪除失敗",
          level: ModalLevel.WARNING,
        })
      );
      console.error(err);
    } finally {
      dispatch(setModalShow(true));
      dispatch(setLoading2(false));
      navigate("/");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>提醒</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <div className="alert alert-warning" role="alert">
          您確定要刪除該場次嗎？
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          style={{
            background: "linear-gradient(to right, #ef4444,rgb(250, 109, 74))",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
        >
          確認
        </button>
      </Modal.Footer>
    </Modal>
  );
};

const Basic = ({
  team_id,
  book_id,
  place_name,
  location,
  amount_of_member,
  limit_of_member,
  total_of_court,
  date,
  time,
  is_opening,
  price,
  setUpdateStatus,
  is_public,
}: Props) => {
  const [switchMode, setSwitchMode] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const shareLink = `https://kindreachbadminton.com/session?team_id=${team_id}&book_id=${book_id}`;
  const shareLinkWithContent = `場地：${place_name}\n日期：${date}\n時間：${time}\n費用：${price}\n人數上限：${limit_of_member}\n\n報名連結：${shareLink}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goSigned = () => {
    navigate(`/signed?book_id=${book_id}`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLinkWithContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error("複製失敗：", err);
    }
  };

  useEffect(() => {
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

  const togglePublic = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/courtSession/switchPublic`,
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

  const waitingCount = Math.max(0, amount_of_member - limit_of_member);
  const confirmedCount = Math.min(amount_of_member, limit_of_member);

  return (
    <div className={styles.container}>
      {/* 場地資訊 - 第一位 */}
      <div className={styles.contentContainer}>
        <h2>場地資訊</h2>
        <div className={styles.infoItem}>
          <SlLocationPin className={styles.icon} />
          <span className={styles.label}>場地名稱：</span>
          <a href={location} target="_blank" className={styles.value}>
            {place_name}
          </a>
        </div>
        <div className={styles.infoItem}>
          <GiTennisCourt className={styles.icon} />
          <span className={styles.label}>場地數量：</span>
          <span className={styles.value}>{total_of_court} 面</span>
        </div>
        <div className={styles.infoItem}>
          <GoPeople className={styles.icon} />
          <span className={styles.label}>人數上限：</span>
          <span className={styles.value}>{limit_of_member} 人</span>
        </div>
        <div className={styles.infoItem}>
          <FaRegClock className={styles.icon} />
          <span className={styles.label}>活動時間：</span>
          <span className={styles.value}>{time}</span>
        </div>
        <div className={styles.infoItem}>
          <BiDollar className={styles.icon} />
          <span className={styles.label}>場地費用：</span>
          <span className={styles.value}>NT$ {price}</span>
        </div>
      </div>

      {/* 場次狀態 - 第二位 */}
      {is_opening && (
        <div className={styles.contentContainer}>
          <h2>場次狀態</h2>
          <div className={styles.status}>
            <div className={styles.statusInfo}>
              <FaUserLock className={styles.icon} />
              <span>報名模式</span>
              <span className={styles.statusBadge}>
                {is_public ? "公開報名" : "私有報名"}
              </span>
            </div>
            <button className={styles.switchButton} onClick={togglePublic}>
              {is_public ? "設為私有" : "設為公開"}
            </button>
          </div>
        </div>
      )}

      {/* 分享連結 - 第三位 */}
      {is_opening && (
        <div
          className={styles.shareContainer}
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <MdCheckCircle className={styles.shareIcon} />
          ) : (
            <MdContentCopy className={styles.shareIcon} />
          )}
          <p className={`${styles.shareText} ${isCopied ? styles.copied : ''}`}>
            {isCopied ? '已複製分享連結到剪貼簿！' : '點擊複製分享連結'}
          </p>
          {isCopied && <span className={styles.copyBadge}>已複製</span>}
        </div>
      )}

      {/* 報名統計 - 第四位 */}
      <div className={styles.contentContainer}>
        <h2>報名統計</h2>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${confirmedCount > 0 ? styles.highlight : ''}`}>
            <span className={styles.statValue}>{confirmedCount}</span>
            <span className={styles.statLabel}>確認報名</span>
          </div>
          <div className={`${styles.statCard} ${waitingCount > 0 ? styles.warning : ''}`}>
            <span className={styles.statValue}>{waitingCount}</span>
            <span className={styles.statLabel}>候補人數</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{limit_of_member - confirmedCount}</span>
            <span className={styles.statLabel}>剩餘名額</span>
          </div>
        </div>
      </div>

      {/* 快速動作 - 第五位 */}
      <div className={styles.contentContainer}>
        <h2>快速動作</h2>
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={switchOpening}
          >
            <FaClock />
            {!switchMode ? "開放報名" : "結束報名"}
          </button>

          {switchMode ? (
            <button
              className={`${styles.actionButton} ${styles.success}`}
              onClick={goSigned}
            >
              <FaUsers />
              前往簽到
            </button>
          ) : (
            <button
              className={`${styles.actionButton} ${styles.danger}`}
              onClick={() => setShow(true)}
            >
              🗑️ 刪除場次
            </button>
          )}
        </div>
      </div>

      <Modals show={show} setShow={setShow} book_id={book_id} />
    </div>
  );
};

export default Basic;
