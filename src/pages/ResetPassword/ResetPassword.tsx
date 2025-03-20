import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./ResetPassword.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { apiPrefix, auth } from "@/utils/firebase";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (errors && isValidEmail(email)) setErrors(false);
  }, [email]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrors(true);
      return;
    }

    dispatch(setLoading2(true));
    try {
      // 使用 Firebase Auth 發送重設密碼信件
      await sendPasswordResetEmail(auth, email);
      dispatch(setModalState({ 
        title: "提示", 
        message: "重設密碼信件已寄送，請檢查您的信箱", 
        level: ModalLevel.SUCCESS 
      }));
    } catch (err: any) {
      console.error(err);
      let errorMessage = "發送重設密碼信件失敗";
      if (err.code === 'auth/user-not-found') {
        errorMessage = "此信箱尚未註冊";
      }
      dispatch(setModalState({ 
        title: "錯誤", 
        message: errorMessage, 
        level: ModalLevel.ERROR 
      }));
    } finally {
      dispatch(setModalShow(true));
      dispatch(setLoading2(false));
      navigate("/");
    }
  };

  return (
    <>
      <HeaderSmall title="密碼重設" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label
              htmlFor="email"
              className={`form-label ${styles.smLabel}`}
            >
              您的 Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control mb-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫 Email
              </Alert>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            確定送出
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
