import styles from "./Header.module.css";
import { IoChevronBack } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { useNavigate } from "react-router-dom";

interface Props {
  place_name: string;
  team_name: string;
  date: string;
  time: string;
  amount_of_member: number;
  amount_of_total: number;
  nav_title: string;
}

const Header = ({
  place_name,
  team_name,
  date,
  time,
  amount_of_total,
  amount_of_member,
  nav_title,
}: Props) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <IoChevronBack
          color="white"
          size="22"
          fontWeight={900}
          onClick={() => navigate(-1)}
        />
        <p>{nav_title}</p>
      </div>
      <h2>{place_name}</h2>
      <p>{team_name}</p>
      <div className={styles.info}>
        <p>
          <IoCalendarClearOutline style={{ marginRight: "5px" }} />
          {date}
        </p>
        <p>
          <FaRegClock style={{ marginRight: "5px" }} />
          {time}
        </p>
        <p>
          <GoPeople style={{ marginRight: "5px" }} />
          {amount_of_member}/{amount_of_total}
        </p>
      </div>
    </div>
  );
};

export default Header;
