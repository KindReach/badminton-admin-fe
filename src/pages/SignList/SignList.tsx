import styles from "./SignList.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data.json";
import { FaRegClock } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/state/loading/loading";

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
          color: `${
            state != "進行中" ? "rgba(0, 123, 255, 1)" : "rgba(40, 167, 69, 1)"
          }`,
          backgroundColor: `${
            state != "進行中"
              ? "rgba(184, 218, 255, 1)"
              : "rgba(195, 230, 203, 1)"
          }`,
        }}
      >
        {state}
      </p>
    </div>
  );
};

const SignList = () => {
  const [bookData, setBookData] = useState<BookDataProps[]>([]);
  const dispatch = useDispatch();
  const getBookDataOfActive = async () => {
    dispatch(setLoading(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/signed/getSignedList`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setBookData(data);
    } catch (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getBookDataOfActive();
  }, []);

  return (
    <>
      <HeaderSmall title="簽到列表" />
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
