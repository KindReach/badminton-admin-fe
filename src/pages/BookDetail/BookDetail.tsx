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
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

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
  const [rateOfShow, setRateOfShow] = useState<number>(0);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);

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

  const dispatch = useDispatch();
  const getSessionInfo = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/courtSession/getDetail`, {
        params: {
          book_id: book_id,
        },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setBookData(data);
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame(() => {
      // 確保在下一個畫面更新週期才關閉 loading
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  };

  useEffect(() => {
    getSessionInfo();
  }, [updateStatus]);

  useEffect(() => {
    if (!bookData.book_id) {
      dispatch(setLoading2(true));
    } else {
      dispatch(setLoading2(false));
    }
    // console.log("bookData: ", bookData);
  }, [bookData]);

  return (
    <div className={styles.container}>
      <Header
        place_name={bookData.place_name}
        team_name={bookData.team_name}
        amount_of_member={bookData.amount_of_member}
        amount_of_total={bookData.limit_of_member}
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
            amount_of_member={bookData.amount_of_member}
            limit_of_member={bookData.limit_of_member}
            total_of_court={bookData.total_of_court}
            time={bookData.time}
            is_opening={bookData.is_opening}
            price={bookData.price}
            setUpdateStatus={setUpdateStatus}
          />
        </Tab>
        <Tab eventKey="member" title="名單管理">
          <Member book_id={bookData.book_id} setRateofShow={setRateOfShow} />
        </Tab>
        <Tab eventKey="analyze" title="統計資訊">
          <Analyze
            limit_of_member={bookData.limit_of_member}
            amount_of_court={bookData.total_of_court}
            amount_of_member={bookData.amount_of_member}
            price={bookData.price}
            rateOfShow={rateOfShow}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BookDetail;
