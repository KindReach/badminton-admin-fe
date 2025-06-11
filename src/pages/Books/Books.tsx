import { useNavigate } from "react-router-dom";
import styles from "./Book.module.css";
import { IoChevronBack, IoAddOutline, IoSearchOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FiFilter, FiCalendar } from "react-icons/fi";
import { Offcanvas } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { RootState } from "@/state/store";
import { setCategory } from "@/state/sessionState/sessionState";

interface HeaderProps {
  setSearch: Dispatch<SetStateAction<string>>;
  setDisplayData: Dispatch<SetStateAction<BookProps[]>>;
  bookData: BookProps[];
  category: string;
}

const categories = ["全部場次", "報名中", "進行中",  "尚未開放", "已結束"];

const Header = ({
  setSearch,
  setDisplayData,
  category,
  bookData,
}: HeaderProps) => {
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
    { label: "三個月", days: 90 }
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
    setDisplayData(bookData.filter(item => 
      category === categories[0] || item.state === category
    ));
  };

  const applyFilter = () => {
    if (!startDate || !endDate || !bookData) return;
    
    setDisplayData(
      bookData.filter((item) => {
        if (!(category === categories[0] || category === item.state))
          return false;

        const dateObj = new Date(item.date);
        return dateObj >= startDate && dateObj <= endDate;
      }),
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
    curEndDate: Date | null,
  ) => {
    setStartDate(curStartDate);
    setEndDate(curEndDate);
    setActiveQuickFilter("");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.nav}>
        <IoChevronBack
          color="#6b7280"
          size="22"
          fontWeight={900}
          onClick={() => navigate(-1)}
        />
        <p>場次管理</p>
      </div>

      <div className={styles.functions}>
        <div className={styles.searchContainer}>
          <IoSearchOutline
            size={18}
            className={styles.searchIcon}
          />
          <input
            value={searchValue}
            onChange={handleSearchChange}
            type="text"
            placeholder="搜尋場次、場地、球隊..."
          />
        </div>
        
        <button 
          className={`${styles.filterBtn} ${isFilterActive ? styles.active : ''}`}
          onClick={() => setShow(true)}
        >
          <FiFilter size={18} />
        </button>
        
        <button 
          className={styles.addBtn}
          onClick={() => navigate("/create")}
        >
          <IoAddOutline size={20} />
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
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(
                      e.target.value ? new Date(e.target.value) : null,
                      endDate
                    )}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>結束日期</label>
                  <input
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(
                      startDate,
                      e.target.value ? new Date(e.target.value) : null
                    )}
                  />
                </div>
              </div>

              <div className={styles.quickFilters}>
                <div className={styles.quickTitle}>快速選擇</div>
                <div className={styles.quickButtons}>
                  {quickFilterOptions.map((option) => (
                    <button
                      key={option.label}
                      className={activeQuickFilter === option.label ? styles.active : ''}
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

interface BookProps {
  book_id: string;
  place_name: string;
  team_name: string;
  date: string;
  time: string;
  state: string;
  limit_of_member: number;
  amount_of_member: number;
}

const Book = ({
  book_id,
  place_name,
  team_name,
  date,
  time,
  state,
  amount_of_member,
  limit_of_member,
}: BookProps) => {
  const color = [
    "rgba(0, 123, 255, 1)",
    "rgba(40, 167, 69, 1)",
    "rgba(215, 85, 0, 1)", "gray"
  ];

  const bgColor = [
    "rgba(184, 218, 255, 1)",
    "rgba(195, 230, 203, 1)",
    "rgba(255, 220, 180, 1)",
    "lightgray",
  ];
  const [curState, setCurState] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (state == "報名中") {
      setCurState(0);
    } else if (state == "進行中") {
      setCurState(1);
    } else if ( state === "尚未開放" ) {
      setCurState(2);
    } else {
      setCurState(3);
    }
  }, [state]);

  const goDetail = () => {
    navigate(`/detail?book_id=${book_id}`);
  };

  return (
    <div className={styles.bookContainer} onClick={goDetail}>
      <h1>
        {place_name}（{book_id.substring(0, 3)}）
      </h1>
      <h2>{team_name}</h2>
      <div className={styles.description}>
        <p>
          <IoCalendarClearOutline style={{ marginRight: "5px" }} />
          {date}
        </p>
        <p>
          <FaRegClock style={{ marginRight: "5px" }} />
          {time}
        </p>
        <p>
          <GoPeople style={{ marginRight: "5px" }} />
          {amount_of_member}/{limit_of_member}
        </p>
      </div>

      <p
        className={styles.state}
        style={{
          color: `${color[curState]}`,
          backgroundColor: `${bgColor[curState]}`,
        }}
      >
        {state}
      </p>
    </div>
  );
};

interface CategoryProps {
  category: string;
}

const Category = ({ category }: CategoryProps) => {
  
  const currentCategory = useSelector((state: RootState) => state.sessionState.category);
  const dispatch = useDispatch();

  const onChangeCategory = () => {
    dispatch(setCategory(category));
  }

  /**
   * color: `${currentCategory === category ? "rgba(0, 123, 255, 1)" : "gray"}`,
        backgroundColor: `${currentCategory === category ? "rgba(184, 218, 255, 1)" : "lightgray"}`,
   */

  return (
    <p
      onClick={onChangeCategory}
      style={{
        color: `${currentCategory === category ? "white" : "black"}`,
        backgroundColor: `${currentCategory === category ? "rgba(0, 123, 255, 1)" : "#F0F0F5"}`,
      }}
    >
      {category}
    </p>
  );
};

const Books = () => {
  const [bookData, setBookData] = useState<BookProps[]>([]);
  const [displayData, setDisplayData] = useState<BookProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const category = useSelector((state: RootState) => state.sessionState.category);
  const dispatch = useDispatch();

  const getBooks = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/courtSession/getBooks`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      
      const tmp: BookProps[] = data;
      tmp.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      );
      
      setBookData(tmp);
    } catch ( err ) {
      console.error(err);
    }
    dispatch(setLoading2(false));
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    if (!bookData.length) return;
    if (category === categories[0]) {
      setDisplayData(bookData);
    } else {
      setDisplayData(bookData.filter((item) => item.state === category));
    }
  }, [category, bookData]);

  useEffect(() => {
    if (!search) {
      setDisplayData(
        bookData.filter(
          (item) => category === categories[0] || item.state === category,
        ),
      );
    } else {
      setDisplayData(
        bookData.filter(
          (item) =>
            (category === categories[0] || item.state == category) &&
            (item.place_name.toLowerCase().includes(search.toLowerCase()) ||
              item.team_name.toLowerCase().includes(search.toLowerCase()) ||
              item.book_id.toLowerCase().includes(search.toLowerCase())),
        ),
      );
    }
  }, [search, bookData, category]);

  return (
    <div className={styles.container}>
      <Header
        setSearch={setSearch}
        category={category}
        setDisplayData={setDisplayData}
        bookData={bookData}
      />
      
      {search && (
        <div className={styles.searchResults}>
          <p>搜尋 "{search}" 找到 {displayData.length} 筆結果</p>
        </div>
      )}
      
      <div className={styles.categoryContainer}>
        {categories.map((item, index) => (
          <Category
            category={item}
            key={index}
          />
        ))}
      </div>
      
      <div className={styles.count} style={{ top: search ? '220px' : '190px' }}>
        <p>場次數量：</p>
        <p>{displayData.length} 筆場次</p>
      </div>
      
      <div className={styles.booksContainer} style={{ top: search ? '280px' : '250px' }}>
        {displayData.map((item, index) => (
          <Book
            key={index}
            book_id={item.book_id}
            place_name={item.place_name}
            team_name={item.team_name}
            date={item.date}
            time={item.time}
            state={item.state}
            amount_of_member={item.amount_of_member}
            limit_of_member={item.limit_of_member}
          />
        ))}
      </div>
    </div>
  );
};

export default Books;
