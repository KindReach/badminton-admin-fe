import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./TeamName.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

const TeamName = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [errors, setErrors] = useState<boolean>(false);

  useEffect(() => {
    if (errors && teamName) setErrors(false);
  }, [teamName]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamName) {
      setErrors(true);
      return;
    }
  };

  return (
    <>
      <HeaderSmall title="球隊設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup} >
            <label
              htmlFor="team_name"
              className={`form-label ${styles.smLabel}`}
            >
              場地名稱
            </label>
            <input id="team_name" type="text" className="form-control mb-1" />
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
