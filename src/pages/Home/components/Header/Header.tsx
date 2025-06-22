import { useEffect, useState } from "react";
import { ExternalLink, Users } from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const curDate = new Date();
    const formattedDate = curDate.toLocaleDateString("ja-JP"); // 格式為 YYYY/MM/DD
    setDate(formattedDate);
  }, []);

  const handleRedirectToUserSystem = () => {
    window.open("https://kindreachbadminton.com/", "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.titleSection}>
          <p>{date}</p>
          <h2>管理員控制台</h2>
        </div>

        <button
          className={styles.redirectBtn}
          onClick={handleRedirectToUserSystem}
          title="前往球友揪團系統"
        >
          <Users size={16} />
          <span>球友版</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};

export default Header;
