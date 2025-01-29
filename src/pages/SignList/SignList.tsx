import styles from "./SignList.module.css";
import { IoChevronBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data.json";
import { FaRegClock } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";

const Header = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    // 處理日期變更
    console.log("開始日期:", startDate);
    console.log("結束日期:", endDate);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.nav}>
        <IoChevronBack
          color="white"
          size="22"
          fontWeight={900}
          onClick={() => navigate(-1)}
        />
        <p>簽到表</p>
      </div>
    </div>
  );
};

interface BookDataProps {
  book_id: string;
  place_name: string;
  team_name: string;
  time: string;
  state: string;
  amount_of_member: number;
  total_of_member: number;
}

const Book = ({
  book_id,
  place_name,
  team_name,
  time,
  amount_of_member,
  total_of_member,
  state,
}: BookDataProps) => {
  const navigate = useNavigate();

  const goSign = () => {
    navigate(`/signed?book_id=${book_id}`);
  };

  return (
    <div className={styles.bookContainer} onClick={goSign}>
      <h1>
        {place_name}（{book_id.substring(5)}）
      </h1>
      <h2>{team_name}</h2>
      <div className={styles.functions}>
        <p>
          <FaRegClock style={{ marginRight: "5px" }} />
          {time}
        </p>
        <p>
          <GoPeople style={{ marginRight: "5px" }} />
          {amount_of_member}/{total_of_member}
        </p>
      </div>
      <p
        className={styles.state}
        style={{
          color: `${state != "進行中" ? "rgba(0, 123, 255, 1)" : "rgba(40, 167, 69, 1)"}`,
          backgroundColor: `${state != "進行中" ? "rgba(184, 218, 255, 1)" : "rgba(195, 230, 203, 1)"}`,
        }}
      >
        {state}
      </p>
    </div>
  );
};

const SignList = () => {
  const [bookData, setBookData] = useState<BookDataProps[]>([]);

  const getBookDataOfActive = async () => {
    setBookData(data);
  };

  useEffect(() => {
    getBookDataOfActive();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.listContainer}>
        {bookData.map((item, index) => (
          <Book
            key={index}
            book_id={item.book_id}
            place_name={item.place_name}
            team_name={item.team_name}
            time={item.time}
            state={item.state}
            amount_of_member={item.amount_of_member}
            total_of_member={item.total_of_member}
          />
        ))}
      </div>
    </>
  );
};

export default SignList;
