import styles from "./SignList.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data.json";
import { FaRegClock } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { IoSearchOutline, IoChevronBack } from "react-icons/io5";
import { FiFilter, FiCalendar } from "react-icons/fi";
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
  const [searchValue, setSearchValue] = useState<string>("");
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("");

  const quickFilterOptions = [
    { label: "今天", days: 0 },
    { label: "本週", days: 7 },
    { label: "本月", days: 30 },
    { label: "三個月", days: 90 },
  ];

  const handleQuickFilter = (option: { label: string; days: number }) => {
    const today = new Date();
    const endDate = new Date();

    if (option.days === 0) {
      setStartDate(today);
      setEndDate(today);
    } else {
      endDate.setDate(today.getDate() + option.days);
      setStartDate(today);
      setEndDate(endDate);
    }

    setActiveQuickFilter(option.label);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveQuickFilter("");
    setIsFilterActive(false);
    setDisplayData(bookData);
  };

  const applyFilter = () => {
    if (!startDate || !endDate || !bookData) return;

    setDisplayData(
      bookData.filter((item) => {
        if (!item.date) return false;
        const dateObj = new Date(item.date);
        return dateObj >= startDate && dateObj <= endDate;
      })
    );

    setIsFilterActive(true);
    setShow(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearch(value);
  };

  const handleDateChange = (
    curStartDate: Date | null,
    curEndDate: Date | null
  ) => {
    setStartDate(curStartDate);
    setEndDate(curEndDate);
    setActiveQuickFilter("");
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
        <div className={styles.searchContainer}>
          <IoSearchOutline size={18} className={styles.searchIcon} />
          <input
            value={searchValue}
            onChange={handleSearchChange}
            type="text"
            placeholder="搜尋場次、場地、球隊..."
          />
        </div>

        <button
          className={`${styles.filterBtn} ${
            isFilterActive ? styles.active : ""
          }`}
          onClick={() => setShow(true)}
        >
          <FiFilter size={18} />
        </button>

        <Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="bottom"
          backdrop="static"
          className={styles.filterOffcanvas}
        >
          <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
            <Offcanvas.Title className={styles.offcanvasTitle}>
              篩選條件
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className={styles.offcanvasBody}>
            <div className={styles.dateFilterContainer}>
              <div className={styles.filterTitle}>
                <FiCalendar size={16} />
                日期範圍
              </div>

              <div className={styles.dateInputs}>
                <div className={styles.inputGroup}>
                  <label>開始日期</label>
                  <input
                    type="date"
                    value={
                      startDate
                        ? startDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleDateChange(
                        e.target.value ? new Date(e.target.value) : null,
                        endDate
                      )
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>結束日期</label>
                  <input
                    type="date"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      handleDateChange(
                        startDate,
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                </div>
              </div>

              <div className={styles.quickFilters}>
                <div className={styles.quickTitle}>快速選擇</div>
                <div className={styles.quickButtons}>
                  {quickFilterOptions.map((option) => (
                    <button
                      key={option.label}
                      className={
                        activeQuickFilter === option.label ? styles.active : ""
                      }
                      onClick={() => handleQuickFilter(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.clearBtn} onClick={clearFilters}>
                清除
              </button>
              <button
                className={styles.applyBtn}
                onClick={applyFilter}
                disabled={!startDate || !endDate}
              >
                套用篩選
              </button>
            </div>
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

      {search && (
        <div className={styles.searchResults}>
          <p>搜尋 "{search}" 找到 {displayData.length} 筆結果</p>
        </div>
      )}

      <div className={styles.count} style={{ top: search ? '175px' : '145px' }}>
        <p>場次數量：</p>
        <p>{displayData.length} 筆場次</p>
      </div>

      <div className={styles.listContainer} style={{ top: search ? '235px' : '205px' }}>
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
