import { useEffect, useState } from "react";
import styles from "./Member.module.css";
import data from "./data.json";
import { FiCheckCircle } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FaRegQuestionCircle } from "react-icons/fa";

interface Props {
  book_id: string;
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
  const stateIcon = [
    <FiCheckCircle style={{ marginRight: "2px" }} />,
    <FiAlertTriangle style={{ marginRight: "2px" }} />,
    <FaRegQuestionCircle style={{ marginRight: "2px" }} />,
  ];
  const color = ["rgba(40, 167, 69, 1)", "rgba(253, 126, 20, 1)", "gray"];
  const content = ["已簽到", "候補中", "未簽到"];
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    if (!is_accept) {
      setState(1);
    } else if (is_show) {
      setState(0);
    } else {
      setState(2);
    }
  }, [is_accept, is_show]);

  return (
    <div className={styles.memberContainer}>
      <div className={styles.profile}>
        <div className={styles.headContainer}>
          <img src={profile_picture} alt="head image" />
        </div>
        <div className={styles.description}>
          <h2>{user_name}</h2>

          <p>報名時間：{booking_time}</p>
        </div>
      </div>
      <p className={styles.state} style={{ color: `${color[state]}` }}>
        {stateIcon[state]} {content[state]}
      </p>
    </div>
  );
};

const Member = ({ book_id }: Props) => {
  const [members, setMembers] = useState<MemberProps[]>([]);
  const getMembers = async () => {
    setMembers(data);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <h2 style={{ color: "rgba(0, 123, 255, 1)" }}>5</h2>
          <p>正取人數</p>
        </div>
        <div className={styles.content}>
          <h2 style={{ color: "rgba(253, 126, 20, 1)" }}>2</h2>
          <p>備取人數</p>
        </div>
        <div className={styles.content}>
          <h2 style={{ color: "rgba(40, 167, 69, 1)" }}>3</h2>
          <p>簽到人數</p>
        </div>
      </div>
      <div className={styles.memberList}>
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
  );
};

export default Member;
