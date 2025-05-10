import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Line.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import axios from "axios";
import { apiPrefix, auth } from "@/utils/firebase";
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";

const Line = () => {
  const [invite, setInvite] = useState<string>("");
  const [errors, setErrors] = useState<boolean>(false);
  const dispatch = useDispatch();
  

  // https://line.me/ti/g/xxxx
  const getDefaultInvite = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setInvite(data["default_line"]);
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
    getDefaultInvite();
  }, []);

  useEffect(() => {
    if (errors && invite) setErrors(false);
  }, [invite]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!invite || !invite.includes("https://line.me/ti/g/")) {
      setErrors(true);
      return;
    }

    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/setting/updateDefault`,
        {
          target: "default_line",
          value: invite,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      dispatch(setModalState({ title: "設定成功", message: "修改成功", level: ModalLevel.SUCCESS }));

    } catch (err) {
      console.error(err);
      dispatch(setModalState({ title: "設定失敗", message: "修改失敗", level: ModalLevel.ERROR }));
    } finally {
      dispatch(setModalShow(true));
    }
    dispatch(setLoading2(false));
  };

  return (
    <>
      <HeaderSmall title="Line 社群設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="invite" className={`form-label ${styles.smLabel}`}>
              邀請連結
            </label>
            <input
              id="invite"
              type="text"
              className="form-control mb-1"
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
            />
            {errors && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫 Line 邀請連結
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

export default Line;
