import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Basic.module.css";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { MdContentCopy } from "react-icons/md";
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
  time: string;
  is_opening: boolean;
  price: number;
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
    if ( !book_id ) return;
    try {
      dispatch(setLoading2(true));
      const idToken = await auth.currentUser?.getIdToken();
      if ( !idToken ) throw new Error("idToken is null");
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
      dispatch(setModalState({ title: "提醒", message: "刪除成功", level: ModalLevel.SUCCESS}));
    } catch ( err ) {
      dispatch(setModalState({ title: "提醒", message: "刪除失敗", level: ModalLevel.WARNING}));
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
  time,
  is_opening,
  price,
  setUpdateStatus,
}: Props) => {
  const [switchMode, setSwitchMode] = useState<boolean>(true); // 結束報名 / 開放報名
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const shareLink = `https://kindreach-badminton-booking.web.app/session?team_id=${team_id}&book_id=${book_id}`;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const goSigned = () => {
    navigate(`/signed?book_id=${book_id}`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
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
      { is_opening && <div className={styles.shareContainer}>
        <MdContentCopy
          style={{
            marginRight: "10px",
            fontSize: "22px",
            fontWeight: "900",
            cursor: "pointer",
          }}
          color="gray"
          onClick={copyToClipboard}
        />
        <p style={{ color: isCopied ? "#4CAF50" : "inherit" }}>
          分享連結：
          {shareLink.substring(0, 15)}...
        </p>
      </div>}
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

          {switchMode ? (
            <button className={styles.sign} onClick={goSigned}>
              前往簽到
            </button>
          ) : (
            <button className={styles.del} onClick={() => setShow(true)}>
              刪除場次
            </button>
          )}
        </div>
      </div>
      <Modals
        show={show}
        setShow={setShow}
        book_id={book_id}
      />
    </div>
  );
};

export default Basic;
