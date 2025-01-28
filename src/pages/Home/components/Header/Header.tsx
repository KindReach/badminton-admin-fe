import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const Header = () => {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const curDate = new Date();
    const formattedDate = curDate.toLocaleDateString("ja-JP"); // 格式為 YYYY/MM/DD
    setDate(formattedDate);
  }, []);
  return (
    <div className={styles.container}>
      <p>{date}</p>
      <h2>管理員控制台</h2>
    </div>
  );
};

export default Header;
