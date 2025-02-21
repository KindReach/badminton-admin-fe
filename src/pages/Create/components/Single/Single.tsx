import styles from "./Single.module.css";
import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CreateSessionType } from "@/utils/types";
import { Mode } from "@/state/publish/publish";
import { setLoading2 } from "@/state/loading/loading";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";

const schema = z.object({
  place_name: z
    .string({ required_error: "請填寫場地" })
    .min(1, { message: "請填寫場地名稱" }),
  location: z
    .string({ required_error: "請填寫場地連結" })
    .min(1, { message: "請填寫地圖連結" }),
  time: z.string({ required_error: "請選擇時間" }),
  amount_of_court: z
    .string({ required_error: "請填寫場地數量" })
    .refine((value) => /^[0-9]+$/.test(value), { message: "場地數量格式錯誤" }),
  limit_of_member: z
    .string({ required_error: "請填寫人數限制" })
    .refine((value) => /^[0-9]+$/.test(value), { message: "人數限制格式錯誤" }),
  description: z.string(),
  price: z
    .string({ required_error: "請填價格" })
    .refine((value) => /^[0-9]+$/.test(value), { message: "價格格式錯誤" }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  addNewSession: (session: CreateSessionType, isMulti: boolean) => void;
  setShow: (key: any) => void;
}

const Single = ({ addNewSession, setShow }: Props) => {
  const [date, setDate] = useState<string | null>(null);
  const [errorOfTime, setErrorOfTime] = useState<boolean>(false);
  const [errorOfDate, setErrorOfDate] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorOfDate && date) setErrorOfDate(false);
    if (errorOfTime && startTime && endTime) setErrorOfTime(false);
    if ( startTime && endTime && startTime >= endTime ) {
      setErrorOfTime(true);
    }
  }, [startTime, endTime, date]);

  const {
    register,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createNewData = () => {
    const formData = getValues();
    
    /**
     * This Field is used to check date and time is vaild or not.
     * It can throws some message
     */
    let isOK = true;
    if (!date) {
      // console.log("Error on date");
      setErrorOfDate(true);
      isOK = false;
    }

    if (!startTime || !endTime) {
      console.log("Error on time");
      setErrorOfTime(true);
      isOK = false;
    }

    // console.log(startTime, " ", endTime);

    if ( startTime && endTime && startTime >= endTime) {
      setErrorOfTime(true);
      isOK = true;
    }

    if (!isOK) return;

    // add a new data of session to the session list.
    // In single case, the session can't be double create.
    addNewSession({
      place_name: formData.place_name,
      location: formData.location,
      date: date || "",
      start_time: startTime || "",
      end_time: endTime || "",
      limit_of_member: Number(formData.limit_of_member),
      amount_of_court: Number(formData.amount_of_court),
      price: Number(formData.price),
      description: formData.description,
    }, false);
    setShow(true);    
  }


  
  const getDefaultData = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/createSession/getDefaultSetting`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      // console.log(data);
      setValue('place_name', data['default_place_name']);
      setValue('location', data['default_location']);
      setValue('price', data['default_price']);
    } catch ( err ) {
      console.log( err );
    }
    requestAnimationFrame(() => {
      // 確保在下一個畫面更新週期才關閉 loading
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  }

  useEffect(() => {
    getDefaultData();
  }, [])

  return (
    <form onSubmit={(e) => e.preventDefault() } className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <div className="mb-3">
          <p className={styles.title}  ><SlLocationPin style={{
            marginRight: "5px"
          }} />地點資訊</p>
          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            場地名稱
          </label>
          <input
            {...register("place_name")}
            id="place_name"
            type="text"
            className="form-control mb-1"
            // placeholder="狐智御"
            // maxLength={10}
          />
          {errors.place_name && (
            <Alert variant="danger" className={styles.alert}>
              {errors.place_name.message}
            </Alert>
          )}
        </div>
        <div className="mb-3">
          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            地圖連結
          </label>
          <input
            {...register("location")}
            id="location"
            type="text"
            className="form-control mb-1"
          />
          {errors.location && (
            <Alert variant="danger" className={styles.alert}>
              {errors.location.message}
            </Alert>
          )}
        </div>
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title} ><FaRegClock style={{ marginRight: '5px'}}  />時間設定</p>
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
            min={new Date().toISOString().split('T')[0]}
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
          <div className={styles.timeGroup}>
            <input
              type="time"
              className="form-control mb-1"
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <h1>~</h1>
          <div className={styles.timeGroup}>
            <input
              type="time"
              className="form-control mb-1"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        {errorOfTime && (
          <Alert variant="danger" className={styles.alert}>
            請設定正常時間
          </Alert>
        )}
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title} ><GoPeople style={{
          marginRight: "5px"
        }}  />人數與價格</p>

        <label
          htmlFor="amount_of_court"
          className={`form-label ${styles.smLabel}`}
        >
          場地數量
        </label>
        <input
          {...register("amount_of_court")}
          id="amount_of_court"
          type="number"
          className="form-control mb-1"
          // placeholder="狐智御"
          // maxLength={10}
        />
        {errors.amount_of_court && (
          <Alert variant="danger" className={styles.alert}>
            {errors.amount_of_court.message}
          </Alert>
        )}

        <label
          htmlFor="limit_of_member"
          className={`form-label ${styles.smLabel}`}
        >
          人數上限
        </label>
        <input
          {...register("limit_of_member")}
          id="limit_of_member"
          type="number"
          className="form-control mb-1"
          // placeholder="狐智御"
          // maxLength={10}
        />
        {errors.limit_of_member && (
          <Alert variant="danger" className={styles.alert}>
            {errors.limit_of_member.message}
          </Alert>
        )}

        <label htmlFor="price" className={`form-label ${styles.smLabel}`}>
          費用設定
        </label>
        <input
          {...register("price")}
          id="price"
          type="number"
          className="form-control mb-1"
          // placeholder="狐智御"
          // maxLength={10}
        />
        {errors.price && (
          <Alert variant="danger" className={styles.alert}>
            {errors.price.message}
          </Alert>
        )}
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title} ><IoAlertCircleOutline style={{ 
           marginRight: "5px"
        }} />備註資訊</p>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className={styles.smLabel}>球種、場地號碼...</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("description")}
            max={1000}
          />
        </Form.Group>
      </div>
      <button className={styles.publish} onClick={createNewData}>
         預覽
      </button>
    </form>
  );
};

export default Single;
