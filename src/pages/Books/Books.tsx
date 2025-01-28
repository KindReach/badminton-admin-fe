import { useNavigate } from "react-router-dom";
import styles from "./Book.module.css";
import { IoChevronBack, IoAddOutline, IoSearchOutline } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { Offcanvas } from "react-bootstrap";
import { useState } from "react";
import DateRangeFilter from "./components/DateRangeFilter";

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
        <p>場次管理</p>
      </div>
      <IoAddOutline
        color="white"
        size={24}
        fontWeight={900}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      />

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
        <input type="text" placeholder="搜尋場次..." />
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
            <Offcanvas.Title>塞選條件</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DateRangeFilter onDateChange={handleDateChange} />{" "}
            <button className={styles.btn}>套用塞選</button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

const Books = () => {
  return (
    <div className={styles.container}>
      <Header />
    </div>
  );
};

export default Books;
