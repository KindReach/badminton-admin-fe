import Header from "@/components/Header/Header";
import styles from "./Signed.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import data from "./data.json";
import dataOfMembers from "./members.json";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegQuestionCircle } from "react-icons/fa";

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
  user_name: string;
  profile_picture: string;
  booking_time?: string;
  is_show: boolean;
  is_accept?: boolean;
}

const Member = ({ user_name, profile_picture, is_show }: MemberProps) => {
  const color = ["rgba(40, 167, 69, 1)", "gray"];
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    if (is_show) {
      setState(0);
    } else {
      setState(1);
    }
  }, []);

  return (
    <div className={styles.member}>
      <div className={styles.profile}>
        <div className={styles.headContainer}>
          <img src={profile_picture} alt="head image" />
        </div>
        <h2>{user_name}</h2>
      </div>
      {state ? (
        <p className={styles.state} style={{ color: `rgba(40, 167, 69, 1)` }}>
          <FiCheckCircle style={{ marginRight: "2px" }} /> 已簽到
        </p>
      ) : (
        <button className={`${styles.state} ${styles.btn}`}>簽到</button>
      )}
    </div>
  );
};

const Signed = () => {
  const [searchParams] = useSearchParams();

  // 提取 book_id
  const book_id = searchParams.get("book_id");

  const [bookData, setBookData] = useState<HeaderProps>({
    place_name: "",
    team_name: "",
    date: "",
    time: "",
    amount_of_member: 0,
    limit_of_member: 0,
    total_of_court: 0,
  });

  const [members, setMembers] = useState<MemberProps[]>([]);

  useEffect(() => {
    setBookData(data);
    dataOfMembers.sort((a, b) => Number(b.is_show) - Number(a.is_show));
    setMembers(dataOfMembers);
  }, []);

  return (
    <div className={styles.container}>
      <Header
        place_name={bookData.place_name}
        team_name={bookData.team_name}
        date={bookData.date}
        time={bookData.time}
        amount_of_total={bookData.total_of_court * bookData.limit_of_member}
        amount_of_member={bookData.amount_of_member}
        nav_title="簽到表"
      />

      <div className={styles.memberList}>
        {members.map(
          (item, index) =>
            item.is_accept && (
              <Member
                key={index}
                user_name={item.user_name}
                profile_picture={item.profile_picture}
                is_show={item.is_show}
              />
            ),
        )}
      </div>
    </div>
  );
};

export default Signed;
