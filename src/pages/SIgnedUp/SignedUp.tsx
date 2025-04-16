import React, { useState, FormEvent, ChangeEvent } from "react";
import styles from "./Signed.module.css"
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  teamName: string; // 球隊名稱
}

const SignedUp: React.FC = () => {
  const navigation = useNavigate(); 
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamName: "", // 球隊名稱
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    // 密碼驗證
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("兩次密碼輸入不一致");
      dispatch(setModalState({ title: "錯誤", message: "兩次密碼輸入不一致", level: ModalLevel.ERROR }));
      dispatch(setModalShow(true));
      setIsSubmitting(false);
      return;
    } else {
      setPasswordError("");
    }
    
    try {
      await axios.post("http://127.0.0.1:5008/kindreach-badminton/us-central1/adminAPIServer/signedup", formData);
      setSubmitted(true);
    } catch ( err: any ) {
      console.error("註冊失敗:", err);
      dispatch(setModalState({ title: "錯誤", message: "註冊失敗  " + err.response.data, level: ModalLevel.ERROR }));
      dispatch(setModalShow(true));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.successView}>
            <div className={styles.successIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.checkIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className={styles.successTitle}>註冊成功！</h2>
            <p className={styles.successMessage}>
              感謝您的註冊，點擊返回登入頁面。
            </p>
            <button
              className={styles.submitButton}
              onClick={() => {setSubmitted(false); navigation("/");}}
            >
              返回登入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.formCard}>
          {/* 頂部漸層色彩條 */}
          <div className={styles.gradientBar}></div>

          <div className={styles.formContent}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>創建管理員帳號</h1>
              <p className={styles.formSubtitle}>填寫以下欄位來申請管理員帳號</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formFields}>
                {/* 姓名欄位 */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.inputLabel}>
                    姓名
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="請輸入您的姓名"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* 電子郵件欄位 */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>
                    電子郵件
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* 密碼欄位 */}
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.inputLabel}>
                    密碼
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={styles.input}
                      placeholder="請設置至少8位密碼"
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeClosed className={styles.eyeIcon} />
                      ) : (
                        <Eye className={styles.eyeIcon} />
                      )}
                    </button>
                  </div>
                  <p className={styles.passwordHint}>密碼必須包含至少8個字符</p>
                </div>

                {/* 確認密碼欄位 */}
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.inputLabel}>
                    確認密碼
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className={styles.input}
                      placeholder="請再次輸入密碼"
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeClosed className={styles.eyeIcon} />
                      ) : (
                        <Eye className={styles.eyeIcon} />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className={styles.errorMessage}>{passwordError}</p>
                  )}
                </div>

                {/* 球隊名稱欄位 */}
                <div className={styles.formGroup}>
                  <label htmlFor="teamName" className={styles.inputLabel}>
                    球隊名稱
                  </label>
                  <input
                    id="teamName"
                    name="teamName"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="請輸入您的球隊名稱"
                    value={formData.teamName}
                    onChange={handleChange}
                  />
                </div>

                {/* 提交按鈕 */}
                <div className={styles.formGroup}>
                  <button type="submit" className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ""}`} disabled={isSubmitting}>
                    {isSubmitting ? "註冊中..." : "創建帳號"}
                  </button>
                </div>
              </div>
            </form>

            {/* 底部信息 */}
            <div className={styles.loginLink}>
              <p>
                已有帳號？{" "}
                <a href="/" className={styles.loginAnchor}>
                  立即登入
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 底部版權信息 */}
        <div className={styles.footer}>
          <p>© 2025 KindReach 羽球系統 | 版權所有</p>
        </div>
      </div>
    </div>
  );
};

export default SignedUp;
