import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Pricing.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import axios from "axios";
import { apiPrefix, auth } from "@/utils/firebase";
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";

const Pricing = () => {
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState<boolean>(false);
  const dispatch = useDispatch();
  

  const getDefaultPrice = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setPrice(data["default_price"]);
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
    getDefaultPrice();
  }, []);

  useEffect(() => {
    if (errors && price && price >= 0) setErrors(false);
  }, [price]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (price && price < 0) {
      setErrors(true);
      return;
    }

    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/setting/updateDefault`,
        {
          target: "default_price",
          value: price,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      dispatch(setModalState({title: "成功", message: "預設價格已更新", level: ModalLevel.SUCCESS}));
    } catch (err) {
      console.error(err);
      dispatch(setModalState({title: "錯誤", message: "更新預設價格失敗", level: ModalLevel.ERROR}));
    } finally {
      dispatch(setLoading2(false));
      dispatch(setModalShow(true));
    }
    
  };

  return (
    <>
      <HeaderSmall title="價格設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={`form-label ${styles.smLabel}`}>
              預設價格
            </label>
            <input
              id="price"
              type="number"
              className="form-control mb-1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫預設價格
              </Alert>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            確定更改
          </button>
        </form>
      </div>
    </>
  );
};

export default Pricing;
