import styles from "./SignList.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data.json";
import { FaRegClock } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { IoSearchOutline, IoChevronBack } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { Offcanvas } from "react-bootstrap";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import DateRangeFilter from "@/components/DateRangeFilter/DateRangeFilter";

interface BookDataProps {
  book_id: string;
  place_name: string;
  team_name: string;
  time: string;
  date?: string;
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

  // 定義三種狀態的顏色配置
  const getStateColor = (state: string) => {
    switch (state) {
      case "即將開始":
        return {
          color: "rgba(0, 123, 255, 1)", // 藍色
          backgroundColor: "rgba(184, 218, 255, 1)",
        };
      case "進行中":
        return {
          color: "rgba(40, 167, 69, 1)", // 綠色
          backgroundColor: "rgba(195, 230, 203, 1)",
        };
      case "已結束":
        return {
          color: "rgba(128, 128, 128, 1)", // 灰色
          backgroundColor: "rgba(211, 211, 211, 1)",
        };
      default:
        return {
          color: "rgba(0, 123, 255, 1)", // 藍色（預設）
          backgroundColor: "rgba(184, 218, 255, 1)",
        };
    }
  };

  const stateColors = getStateColor(state);

  return (
    <div className={styles.bookContainer} onClick={goSign}>
      <h1>
        {place_name}（{book_id.substring(0, 3)}）
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
          color: stateColors.color,
          backgroundColor: stateColors.backgroundColor,
        }}
      >
        {state}
      </p>
    </div>
  );
};

const Header = ({
  setSearch,
  setDisplayData,
  bookData,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setDisplayData: React.Dispatch<React.SetStateAction<BookDataProps[]>>;
  bookData: BookDataProps[];
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const myFilter = () => {
    if (!startDate || !endDate || !bookData) return;

    setDisplayData(
      bookData.filter((item) => {
        if (!item.date) return false;
        const dateObj = new Date(item.date);
        return dateObj >= startDate && dateObj <= endDate;
      })
    );
    setShow(false);
  };

  const handleDateChange = (
    curStartDate: Date | null,
    curEndDate: Date | null
  ) => {
    setStartDate(curStartDate);
    setEndDate(curEndDate);
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
        <p>簽到列表</p>
      </div>
      <div className={styles.functions}>
        <IoSearchOutline
          size={22}
          fontWeight={900}
          color="white"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "10px",
            zIndex: "50",
          }}
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="搜尋場次或團隊..."
        />
        <button onClick={() => setShow((prev) => !prev)}>
          <FiFilter color="white" size={22} />
        </button>
        <Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="bottom"
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>篩選條件</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DateRangeFilter onDateChange={handleDateChange} />
            <button className={styles.btn} onClick={myFilter}>
              套用篩選
            </button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

const SignList = () => {
  const [bookData, setBookData] = useState<BookDataProps[]>([]);
  const [displayData, setDisplayData] = useState<BookDataProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();

  const getBookDataOfActive = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/signed/getSignedList`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setBookData(data);
      setDisplayData(data);
    } catch (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
    dispatch(setLoading2(false));
  };

  useEffect(() => {
    getBookDataOfActive();
  }, []);

  useEffect(() => {
    if (!search) {
      setDisplayData(bookData);
    } else {
      setDisplayData(
        bookData.filter(
          (item) =>
            item.place_name.includes(search) ||
            item.team_name.includes(search) ||
            item.book_id.includes(search)
        )
      );
    }
  }, [search, bookData]);

  return (
    <>
      <Header
        setSearch={setSearch}
        setDisplayData={setDisplayData}
        bookData={bookData}
      />
      <div className={styles.count}>
        <p>場次數量：</p>
        <p>{displayData.length} 筆場次</p>
      </div>
      <div className={styles.listContainer}>
        {displayData.map((item, index) => (
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
