import { CreateSessionType } from "@/utils/types";
import Header from "./components/Header/Header";
import styles from "./Create.module.css";
import { useEffect, useState } from "react";
import Single from "./components/Single/Single";
import MultiCreate from "./components/MultiCreate/MultiCreate";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";

interface Props {
  show: any;
  setShow: (key: any) => void;
  sessions: CreateSessionType[];
}

const PublishCheck = ({ show, setShow, sessions }: Props) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [amountOfSession, setAmountOfSession] = useState<number>(0);

  useEffect(() => {
    if (!sessions) return;
    let curPrice = 0;
    sessions.forEach((item) => (curPrice += item.price * item.limit_of_member));
    setTotalPrice(curPrice);
    setAmountOfSession(sessions.length);
  }, [sessions]);

  const handleSubmit = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/createSession/createSession`,
        {
          sessions: sessions,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setShow(false);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="top"
      backdrop="static"
    >
      <Offcanvas.Header
        closeButton
        style={{ borderBottom: "0.9px solid lightgray" }}
      >
        <Offcanvas.Title>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            確認發佈
          </button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className={styles.checkContainer}>
          <div className={styles.totalCal}>
            <p>共 {amountOfSession} 個場次</p>
            <p>預計總收入：NT${totalPrice}</p>
          </div>
          <div className={styles.sessionsContainer}>
            {sessions.map((item, index) => {
              return (
                <div className={styles.session} key={index}>
                  <h1>{item.place_name}</h1>
                  <div className={styles.description}>
                    <p>
                      <IoCalendarClearOutline style={{ marginRight: "5px" }} />
                      {item.date}
                    </p>
                    <p>
                      <FaRegClock style={{ marginRight: "5px" }} />
                      {item.start_time}~{item.end_time}
                    </p>
                    <p>
                      <GoPeople style={{ marginRight: "5px" }} />
                      上限 {item.limit_of_member} 人
                    </p>
                  </div>
                  <p className={styles.price}>NT$ {item.price} /人</p>
                </div>
              );
            })}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const Create = () => {
  const categories = ["單次新增", "批量新增"];
  const [category, setCategory] = useState<string>(categories[0]);
  const [createData, setCreateData] = useState<CreateSessionType[]>([]);
  const [show, setShow] = useState(false);
  const singleState = useSelector(
    (state: RootState) => state.publish.single_state
  );

  const addNewSession = (session: CreateSessionType, isMulti: boolean) => {
    if (isMulti) {
      setCreateData([...createData, session]);
    } else {
      setCreateData([session]);
    }
  };

  // useEffect(() => {
  //   console.log("create data: ", createData);
  // }, [createData]);

  return (
    <>
      <Header
        categories={categories}
        category={category}
        setCategory={setCategory}
        title="新增場次"
      />
      {category === categories[0] ? (
        <Single addNewSession={addNewSession} setShow={setShow} />
      ) : (
        <MultiCreate />
      )}
      <PublishCheck show={show} setShow={setShow} sessions={createData} />
    </>
  );
};

export default Create;
