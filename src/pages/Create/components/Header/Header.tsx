import { setMultiState, setSingleState } from "@/state/publish/publish";
import styles from "./Header.module.css";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";

interface Props {
  title: string;
  categories: string[];
  setCategory: (key: string) => void;
  category: string;
}

const Header = ({ title, categories, category, setCategory }: Props) => {
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
      <div className={styles.categoryContainer}>
        <div className={styles.categories}>
          <p onClick={() => setCategory(categories[0])}>{categories[0]}</p>
          <p onClick={() => setCategory(categories[1])}>{categories[1]}</p>
          <div
            className={styles.obj}
            style={{
              right: `${category === categories[0] ? "49%" : "3%"}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
