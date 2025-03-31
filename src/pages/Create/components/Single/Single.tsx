import styles from "./Single.module.css";
import { Form, Alert } from "react-bootstrap";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CreateSessionType } from "@/utils/types";
import { setLoading2 } from "@/state/loading/loading";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // 引入繁體中文語系

interface FormData {
  place_name: string;
  location: string;
  amount_of_court: string;
  limit_of_member: string;
  description: string;
  price: string;
  is_public: boolean;
}

interface NumberErrors {
  amount_of_court?: string;
  limit_of_member?: string;
  price?: string;
}

interface Props {
  addNewSession: (session: CreateSessionType, isMulti: boolean) => void;
  setShow: (key: any) => void;
}

const Single = ({ addNewSession, setShow }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    place_name: "",
    location: "",
    amount_of_court: "",
    limit_of_member: "",
    description: "",
    price: "",
    is_public: false,
  });

  const [date, setDate] = useState<string | null>(null);
  const [errorOfTime, setErrorOfTime] = useState<boolean>(false);
  const [errorOfDate, setErrorOfDate] = useState<boolean>(false);
  const [errorOfCourt, setErrorOfCourt] = useState<boolean>(false);
  const [errorOfLimit, setErrorOfLimit] = useState<boolean>(false);
  const [errorOfPrice, setErrorOfPrice] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const dispatch = useDispatch();

  // 保留原有的時間驗證
  useEffect(() => {
    if (errorOfDate && date) setErrorOfDate(false);
    if (errorOfTime && startTime && endTime) setErrorOfTime(false);
    if (startTime && endTime && endTime !== "00:00" && startTime >= endTime) {
      setErrorOfTime(true);
    }
  }, [startTime, endTime, date]);

  // 新增數字輸入驗證
  useEffect(() => {
    if (formData.amount_of_court) {
      if (!/^\d+$/.test(formData.amount_of_court)) {
        setErrorOfCourt((prev) => true); //"場地數量必須為數字大於 0";
      } else if (Number(formData.amount_of_court) <= 0) {
        setErrorOfCourt((prev) => true);
      } else {
        setErrorOfCourt((prev) => false);
      }
    }

    if (formData.limit_of_member) {
      if (!/^\d+$/.test(formData.limit_of_member)) {
        setErrorOfLimit((prev) => true); //"人數限制必須為數字";
      } else if (Number(formData.limit_of_member) <= 0) {
        setErrorOfLimit((prev) => true); //"人數限制必須大於 0";
      } else {
        setErrorOfLimit((prev) => false);
      }
    }

    if (formData.price) {
      if (!/^\d+$/.test(formData.price)) {
        setErrorOfPrice((prev) => true); //"價格必須為數字";
      } else if (Number(formData.price) <= 0) {
        setErrorOfPrice((prev) => true); //"價格必須大於 0";
      } else {
        setErrorOfPrice((prev) => false);
      }
    }
  }, [formData.amount_of_court, formData.limit_of_member, formData.price]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setStartTime(value.format("HH:mm"));
    } else {
      setStartTime(null);
    }
  };

  const handleEndTimeChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setEndTime(value.format("HH:mm"));
    } else {
      setEndTime(null);
    }
  };

  const createNewData = () => {
    let isOK = true;

    // 時間驗證
    if (!date) {
      setErrorOfDate(true);
      isOK = false;
    }

    if (!startTime || !endTime) {
      setErrorOfTime(true);
      isOK = false;
    }

    if (startTime && endTime) {
      // 如果結束時間是 00:00，視為隔天凌晨，不進行時間比較
      if (endTime !== "00:00" && startTime >= endTime) {
        setErrorOfTime(true);
        isOK = false;
      }
    }

    // 數字輸入驗證
    if (
      !formData.amount_of_court ||
      !formData.limit_of_member ||
      !formData.price
    ) {
      isOK = false;
    }

    if (!isOK) return;

    addNewSession(
      {
        place_name: formData.place_name,
        location: formData.location,
        date: date || "",
        start_time: startTime || "",
        end_time: endTime || "",
        limit_of_member: Number(formData.limit_of_member),
        amount_of_court: Number(formData.amount_of_court),
        price: Number(formData.price),
        description: formData.description,
        is_public: formData.is_public,
      },
      false
    );
    setShow(true);
  };

  const getDefaultData = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(
        `${apiPrefix}/createSession/getDefaultSetting`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      setFormData((prev) => ({
        ...prev,
        place_name: data["default_place_name"],
        location: data["default_location"],
        price: data["default_price"],
      }));
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading2(false));
  };

  useEffect(() => {
    getDefaultData();
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <div className="mb-3">
          <p className={styles.title}>
            <SlLocationPin
              style={{
                marginRight: "5px",
              }}
            />
            地點資訊
          </p>
          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            場地名稱
          </label>
          <input
            name="place_name"
            id="place_name"
            type="text"
            className="form-control mb-1"
            value={formData.place_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            地圖連結
          </label>
          <input
            name="location"
            id="location"
            type="text"
            className="form-control mb-1"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="is_public"
            className={`form-label ${styles.smLabel}`}
          >
            場次狀態
          </label>
          <select
            name="is_public"
            id="is_public"
            className="form-control mb-1"
            value={formData.is_public ? "public" : "private"}
            onChange={(e) =>
              setFormData((prev) => ({
          ...prev,
          is_public: e.target.value === "public",
              }))
            }
            required
          >
            <option value="public">公開</option>
            <option value="private">私有</option>
          </select>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <FaRegClock style={{ marginRight: "5px" }} />
          時間設定
        </p>
        <label
          // htmlFor="amount_of_court"
          className={`form-label ${styles.smLabel}`}
        >
          日期
        </label>

        <div className={styles.calendar}>
          <input
            type="date"
            className="form-control mb-1"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
          {errorOfDate && (
            <Alert variant="danger" className={styles.alert}>
              請設定正常日期
            </Alert>
          )}
        </div>

        <label className={`form-label ${styles.smLabel}`}>時間</label>

        <div className={styles.time}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-tw"
          >
            <div className={styles.timeGroup}>
              <TimePicker
                label="開始時間"
                value={startTime ? dayjs(`2023-01-01T${startTime}`) : null}
                onChange={handleStartTimeChange}
                minutesStep={10}
                slotProps={{
                  textField: {
                    className: "form-control mb-1",
                    size: "small",
                  },
                }}
                format="HH:mm"
              />
            </div>
            <h1>~</h1>
            <div className={styles.timeGroup}>
              <TimePicker
                label="結束時間"
                value={endTime ? dayjs(`2023-01-01T${endTime}`) : null}
                onChange={handleEndTimeChange}
                minutesStep={10}
                slotProps={{
                  textField: {
                    className: "form-control mb-1",
                    size: "small",
                  },
                }}
                format="HH:mm"
              />
            </div>
          </LocalizationProvider>
        </div>
        {errorOfTime && (
          <Alert variant="danger" className={styles.alert}>
            請設定正常時間
          </Alert>
        )}
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <GoPeople
            style={{
              marginRight: "5px",
            }}
          />
          人數與價格
        </p>

        <label
          htmlFor="amount_of_court"
          className={`form-label ${styles.smLabel}`}
        >
          場地數量
        </label>
        <input
          name="amount_of_court"
          id="amount_of_court"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.amount_of_court}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              amount_of_court: event.target.value,
            }))
          }
          required
        />
        {errorOfCourt && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確場數
          </Alert>
        )}

        <label
          htmlFor="limit_of_member"
          className={`form-label ${styles.smLabel}`}
        >
          人數上限
        </label>
        <input
          name="limit_of_member"
          id="limit_of_member"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.limit_of_member}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              limit_of_member: event.target.value,
            }))
          }
          required
        />
        {errorOfLimit && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確人數上限
          </Alert>
        )}

        <label htmlFor="price" className={`form-label ${styles.smLabel}`}>
          費用設定
        </label>
        <input
          name="price"
          id="price"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.price}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              price: event.target.value,
            }))
          }
          required
        />
        {errorOfPrice && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確價格
          </Alert>
        )}
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <IoAlertCircleOutline
            style={{
              marginRight: "5px",
            }}
          />
          備註資訊
        </p>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className={styles.smLabel}>球種、場地號碼...</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            max={1000}
          />
        </Form.Group>
      </div>
      <button className={styles.publish} onClick={createNewData}>
        預覽
      </button>
      <button className={styles.publish2} onClick={createNewData}>
        預覽
      </button>
    </form>
  );
};

export default Single;
