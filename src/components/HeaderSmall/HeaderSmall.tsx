import styles from "./HeaderSmall.module.scss";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

const HeaderSmall = ({ title, subtitle, rightAction }: Props) => {
  const navigate = useNavigate();
  const [isBackHovered, setIsBackHovered] = useState(false);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.nav}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
        >
          <ChevronLeft
            color="white"
            size={22}
            strokeWidth={2.5}
            className={`${styles.backIcon} ${isBackHovered ? styles.hovered : ''}`}
          />
        </button>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {rightAction && (
          <div className={styles.rightAction}>
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSmall;
