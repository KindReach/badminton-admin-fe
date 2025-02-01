import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Pricing.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

const Pricing = () => {
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState<boolean>(false);

  useEffect(() => {
    if (errors && price && price >= 0) setErrors(false);
  }, [price]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (price && price < 0) {
      setErrors(true);
      return;
    }
  };

  return (
    <>
      <HeaderSmall title="價格設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup} >
            <label
              htmlFor="price"
              className={`form-label ${styles.smLabel}`}
            >
              預設價格
            </label>
            <input id="price" type="number" className="form-control mb-1" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
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
