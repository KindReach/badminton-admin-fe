import { setMultiState, setSingleState } from "@/state/publish/publish";
import styles from "./Header.module.css";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";

interface Props {
  setShow: (key: any) => void;
  title: string;
  categories: string[];
  setCategory: (key: string) => void;
  category: string;
}

const Header = ({
  title,
  categories,
  category,
  setCategory,
  setShow,
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const singleState = useSelector(
    (state: RootState) => state.publish.single_state,
  );
  const multiState = useSelector(
    (state: RootState) => state.publish.multi_state,
  );

  const handleBeforePublish = () => {
    if (category === categories[0]) {
      dispatch(setSingleState(!singleState));
    } else {
      dispatch(setMultiState(!multiState));
    }
    setShow(true);
  };

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
      <p className={styles.publish} onClick={handleBeforePublish}>
        發佈
      </p>
    </div>
  );
};

export default Header;
