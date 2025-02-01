import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Location.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

const Location = () => {
  const [placeName, setPlaceName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errorOfName, setErrorOfName] = useState<boolean>(false);
  const [errorOfLocation, setErrorOfLocation] = useState<boolean>(false);


  useEffect(() => {
    if (errorOfName && placeName) setErrorOfName(false);
    if (errorOfLocation && location) setErrorOfLocation(false);
  }, [placeName, location]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let isOK = true;
    if (!placeName) {
      setErrorOfName(true);
      isOK = false;
    } 
    if (!location) {
      setErrorOfLocation(true);
      isOK = false;
    }

    if (!isOK) return;
  };

  return (
    <>
      <HeaderSmall title="場地資訊設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup} >
            <label
              htmlFor="place_name"
              className={`form-label ${styles.smLabel}`}
            >
              場館名稱
            </label>
            <input id="place_name" type="text" className="form-control mb-1" value={placeName} onChange={(e) => setPlaceName(e.target.value)}/>
            {errorOfName && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫場館名稱
              </Alert>
            )}
          </div>
          <div className={styles.inputGroup} >
            <label
              htmlFor="location"
              className={`form-label ${styles.smLabel}`}
            >
              地圖連結
            </label>
            <input id="location" type="text" className="form-control mb-1" value={location} onChange={(e) => setLocation(e.target.value)}  />
            {errorOfLocation && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫地圖連結
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

export default Location;
