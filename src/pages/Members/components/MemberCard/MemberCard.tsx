import styles from "./MemberCard.module.css";
import { MemberProps } from "@/utils/types";
import { TiStarFullOutline } from "react-icons/ti";
import { LuCircleAlert } from "react-icons/lu";
import { MdOutlineCancel } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Offcanvas } from "react-bootstrap";

const MemberCard = ({
  user_name,
  profile_picture,
  is_block,
  amount_of_no_show,
  amount_of_book,
  add_time,
}: MemberProps) => {
  const stateIcons = [
    <FiCheckCircle />,
    <LuCircleAlert />,
    <MdOutlineCancel />,
  ];

  const stateContent = ["正常", "警告", "已封鎖"];
  const color = ["rgba(0, 123, 255, 1)", "rgba(40, 167, 69, 1)", "#A83232"];
  const bgColor = [
    "rgba(184, 218, 255, 1)",
    "rgba(195, 230, 203, 1)",
    "#F2D7D5",
  ];

  const btnContent = ["封鎖", "解除封鎖"];
  const [state, setState] = useState<number>(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (is_block) setState(2);
    else setState(0);
  }, [is_block]);

  return (
    <>
      <div className={styles.memberContainer} onClick={() => setShow(true)}>
        <div className={styles.profile}>
          <div className={styles.headContainer}>
            <img src={profile_picture} alt="head image" />
          </div>
          <div className={styles.description}>
            <h2>{user_name}</h2>
            <p className={styles.time}>加入時間：{add_time}</p>
          </div>
        </div>

        <div className={styles.functions}>
          <p>參與：{amount_of_book} 次</p>
          <p>取消：{amount_of_no_show} 次</p>
          <p style={{ color: "#E0B888", fontWeight: "900" }}>
            <TiStarFullOutline />：{3.5}
          </p>
        </div>
        <p
          className={styles.state}
          style={{
            color: `${color[state]}`,
            backgroundColor: `${bgColor[state]}`,
          }}
        >
          {stateIcons[state]}
          {stateContent[state]}
        </p>
        <MdKeyboardArrowRight
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "10px",
            fontSize: "20px",
            fontWeight: "900",
            color: "gray",
          }}
        />
      </div>
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="bottom"
        backdrop="static"
      >
        <Offcanvas.Header
          closeButton
          style={{ borderBottom: "0.9px solid lightgray" }}
        >
          <Offcanvas.Title>{user_name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className={styles.components}>
            <button
              className={styles.blockBtn}
              style={{
                color: `${color[state === 0 ? 2 : 0]}`,
                backgroundColor: `${bgColor[state === 0 ? 2 : 0]}`,
              }}
            >
              {state === 2 ? btnContent[1] : btnContent[0]}
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MemberCard;
