import { useState, FormEvent } from "react";
import styles from "./Login.module.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import Logo from "@images/KindReachPadding.png";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Login = () => {
  const brandName = "KindReach";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Login successful:", userCredential.user);
      // navigate("/dashboard"); // 或你想導航的路徑
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.code));
    }
  };

  // 處理錯誤訊息
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "無效的電子郵件格式";
      case "auth/user-disabled":
        return "此帳號已被停用";
      case "auth/user-not-found":
        return "找不到此帳號";
      case "auth/wrong-password":
        return "密碼錯誤";
      default:
        return "登入失敗，請稍後再試";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandContainer}>
        <img src={Logo} alt="brand" />
        <h2>{brandName}</h2>
        <p>管理員後台</p>
      </div>
      <Form onSubmit={handleLogin} className={styles.formContainer}>
        <InputGroup className="mb-3" hasValidation>
          <InputGroup.Text
            className="bg-white border-end-0"
            style={{ borderRadius: "50px 0 0 50px" }}
          >
            <MdEmail className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="email"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            className="border-start-0"
            style={{
              borderRadius: "0 50px 50px 0",
              border: "2px solid #e8e8e8",
            }}
            autoComplete="off"
            required
            isInvalid={false}
          />
          {false && (
            <Form.Control.Feedback type="invalid">
              請輸入電子郵件
            </Form.Control.Feedback>
          )}
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text
            className="bg-white border-end-0"
            style={{ borderRadius: "50px 0 0 50px" }}
          >
            <RiLockPasswordLine className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-start-0"
            style={{
              borderRadius: "0 50px 50px 0",
              border: "2px solid #e8e8e8",
            }}
            required
          />
        </InputGroup>

        <Button
          type="submit"
          className={styles.btn}
          style={{ borderRadius: "50px", padding: "10px" }}
        >
          登入
        </Button>
      </Form>
    </div>
  );
};

export default Login;
