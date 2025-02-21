import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Location.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";

const Location = () => {
  const [placeName, setPlaceName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errorOfName, setErrorOfName] = useState<boolean>(false);
  const [errorOfLocation, setErrorOfLocation] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getDefaultPlce = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log(data);
      setPlaceName(data["default_place_name"]);
      setLocation(data["default_location"]);
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
    getDefaultPlce();
  }, []);

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
    
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/setting/updateDefault`,
        {
          target: "default_locatoin",
          value: [
            placeName,
            location
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log(data);
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
