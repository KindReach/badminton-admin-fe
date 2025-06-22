import styles from "./HeaderSmall.module.css";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
}

const HeaderSmall = ({ title }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.nav}>
        <IoChevronBack
          color="white"
          size="22"
          fontWeight={900}
          onClick={() => navigate(-1)}
        />
        <p>{title}</p>
      </div>
    </div>
  );
};

export default HeaderSmall;
