import { useNavigate } from "react-router-dom";
import styles from "./Book.module.scss";
import { ChevronLeft, Plus, Search, Filter, Calendar, Clock, Users, ArrowRight, MapPin } from "lucide-react";
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
        <ChevronLeft
          color="white"
          size="22"
          strokeWidth={2.5}
          onClick={() => navigate(-1)}
          className={styles.backIcon}
        />
        <p>場次管理</p>
      </div>

      <div className={styles.functions}>
        <div className={styles.searchContainer}>
          <Search
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
          <Filter size={18} />
        </button>
        
        <button 
          className={styles.addBtn}
          onClick={() => navigate("/create")}
        >
          <Plus size={20} />
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
                <Calendar size={16} />
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
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getStateConfig = (state: string) => {
    switch (state) {
      case "報名中":
        return {
          color: "#3b82f6",
          backgroundColor: "#eff6ff",
          borderColor: "#dbeafe",
        };
      case "進行中":
        return {
          color: "#10b981",
          backgroundColor: "#ecfdf5",
          borderColor: "#a7f3d0",
        };
      case "尚未開放":
        return {
          color: "#f59e0b",
          backgroundColor: "#fef3c7",
          borderColor: "#fde68a",
        };
      case "已結束":
        return {
          color: "#64748b",
          backgroundColor: "#f8fafc",
          borderColor: "#e2e8f0",
        };
      default:
        return {
          color: "#3b82f6",
          backgroundColor: "#eff6ff",
          borderColor: "#dbeafe",
        };
    }
  };

  const stateConfig = getStateConfig(state);

  // 格式化日期顯示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天';
    } else {
      return date.toLocaleDateString('zh-TW', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const getOccupancyRate = () => {
    return (amount_of_member / limit_of_member) * 100;
  };

  const goDetail = () => {
    navigate(`/detail?book_id=${book_id}`);
  };

  return (
    <div 
      className={styles.bookContainer} 
      onClick={goDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header}>
        <div className={styles.placeInfo}>
          <h3 className={styles.placeName}>{place_name}</h3>
          <span className={styles.bookId}>#{book_id.substring(0, 6)}</span>
        </div>
        <div 
          className={styles.stateBadge}
          style={{
            color: stateConfig.color,
            backgroundColor: stateConfig.backgroundColor,
            borderColor: stateConfig.borderColor,
          }}
        >
          {state}
        </div>
      </div>

      <div className={styles.teamName}>{team_name}</div>

      <div className={styles.timeSection}>
        <div className={styles.timeInfo}>
          <div className={styles.infoItem}>
            <Calendar size={16} />
            <span>{formatDate(date)}</span>
          </div>
          <div className={styles.infoItem}>
            <Clock size={16} />
            <span>{time}</span>
          </div>
        </div>
        
        <div className={styles.memberInfo}>
          <Users size={16} />
          <span className={styles.memberCount}>
            {amount_of_member}/{limit_of_member}
          </span>
          <div className={styles.memberProgress}>
            <div 
              className={styles.progressBar}
              style={{
                width: `${getOccupancyRate()}%`,
                backgroundColor: stateConfig.color,
              }}
            />
          </div>
        </div>
      </div>

      <ArrowRight 
        className={`${styles.arrowIcon} ${isHovered ? styles.hovered : ''}`} 
        size={18} 
      />
    </div>
  );
};

interface CategoryProps {
  category: string;
}

const Category = ({ category }: CategoryProps) => {
  const currentCategory = useSelector((state: RootState) => state.sessionState.category);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const onChangeCategory = () => {
    dispatch(setCategory(category));
  }

  const isActive = currentCategory === category;

  return (
    <button
      className={`${styles.categoryBtn} ${isActive ? styles.active : ''}`}
      onClick={onChangeCategory}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {category}
    </button>
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
        {displayData.length > 0 ? (
          displayData.map((item, index) => (
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
          ))
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} className={styles.emptyIcon} />
            <h3>找不到符合條件的場次</h3>
            <p>請調整篩選條件或搜尋關鍵字</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;