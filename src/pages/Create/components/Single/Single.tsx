import styles from "./Single.module.css";
import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

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

const Single = () => {
  const [date, setDate] = useState<string | null>(null);
  const [firstSubmit, setFirstSubmit] = useState<boolean>(true);
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const [errorOfTime, setErrorOfTime] = useState<boolean>(false);
  const [errorOfDate, setErrorOfDate] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    if (errorOfDate && date) setErrorOfDate(false);
    if (errorOfTime && startTime && endTime) setErrorOfTime(false);
  }, [startTime, endTime, date]);

  const singleState = useSelector(
    (state: RootState) => state.publish.single_state,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const checkDateAndTime = () => {
    let isInvalid = false;

    if (!date) {
      setErrorOfDate(true);
      isInvalid = true;
    }

    if (!startTime || !endTime) {
      setErrorOfDate(true);

      setErrorOfTime(true);
      isInvalid = true;
    }

    if (isInvalid) return;
  };
  const onSubmit = async () => {
    alert("GOOD");
  };

  useEffect(() => {
    if (firstSubmit) {
      setFirstSubmit(false);
      return;
    }
    console.log("COOL ON SINGLE PUBLISH");
    checkDateAndTime();
    handleSubmit(onSubmit)();
  }, [singleState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <div className="mb-3">
          <p>地點資訊</p>

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
            // placeholder="狐智御"
            // maxLength={10}
          />
          {errors.location && (
            <Alert variant="danger" className={styles.alert}>
              {errors.location.message}
            </Alert>
          )}
        </div>
      </div>
      <div className={styles.inputGroup}>
        <p>時間設定</p>
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
        <p>人數與價格</p>

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
        <p>備註資訊</p>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className={styles.smLabel}>球種、場地號碼...</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("description")}
            max={1000}
            // placeholder="請輸入欲授課方向、參與人數估計或是其他您遇到的難題等等"
          />
        </Form.Group>
      </div>
    </form>
  );
};

export default Single;
