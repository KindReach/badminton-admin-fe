import Header from "@/components/Header/Header";
import styles from "./BookDetail.module.css";
import data from "./data.json";
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Basic from "./Basic/Basic";
import Member from "./Member/Member";
import Analyze from "./Analyze/Analyze";
import { useSearchParams } from "react-router-dom";

interface BookInfo {
  book_id: string;
  place_name: string;
  team_name: string;
  date: string;
  time: string;
  amount_of_member: number;
  location: string;
  limit_of_member: number;
  total_of_court: number;
  is_opening: boolean;
  price: number;
}

const BookDetail = () => {
  const [searchParams] = useSearchParams();

  // 提取 book_id
  const book_id = searchParams.get("book_id");
  const [bookData, setBookData] = useState<BookInfo>({
    book_id: "",
    place_name: "",
    team_name: "",
    date: "",
    time: "",
    amount_of_member: 0,
    location: "",
    limit_of_member: 0,
    total_of_court: 0,
    is_opening: false,
    price: 0,
  });

  useEffect(() => {
    setBookData(data);
  }, []);

  // useEffect(() => {
  //   console.log("bookData: ", bookData);
  // }, [bookData]);

  return (
    <div className={styles.container}>
      <Header
        place_name={bookData.place_name}
        team_name={bookData.team_name}
        amount_of_member={bookData.amount_of_member}
        amount_of_total={bookData.total_of_court * bookData.limit_of_member}
        date={bookData.date}
        time={bookData.time}
        nav_title="場次詳情"
      />
      <Tabs
        defaultActiveKey="basic"
        id="fill-tab-example"
        className="mb-3"
        // fill
      >
        <Tab eventKey="basic" title="基本資訊">
          <Basic
            book_id={bookData.book_id}
            place_name={bookData.place_name}
            location={bookData.location}
            limit_of_member={bookData.limit_of_member}
            total_of_court={bookData.total_of_court}
            time={bookData.time}
            is_opening={bookData.is_opening}
            price={bookData.price}
          />
        </Tab>
        <Tab eventKey="member" title="名單管理">
          <Member book_id={bookData.book_id} />
        </Tab>
        <Tab eventKey="analyze" title="統計資訊">
          <Analyze />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BookDetail;
