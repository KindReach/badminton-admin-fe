import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./TeamName.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

const TeamName = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [errors, setErrors] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getDefaultTeamName = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setTeamName(data["team_name"]);
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
    getDefaultTeamName();
  }, []);

  useEffect(() => {
    if (errors && teamName) setErrors(false);
  }, [teamName]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamName) {
      setErrors(true);
      return;
    }

    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/setting/updateDefault`,
        {
          target: "team_name",
          value: teamName,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
    dispatch(setLoading2(false));
  };

  return (
    <>
      <HeaderSmall title="球隊設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label
              htmlFor="team_name"
              className={`form-label ${styles.smLabel}`}
            >
              球隊名稱
            </label>
            <input
              id="team_name"
              type="text"
              className="form-control mb-1"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            {errors && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫球隊名稱
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

export default TeamName;
