import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Setting.module.css";
import { BsBuilding } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { FiDollarSign } from "react-icons/fi";
import { CgMail } from "react-icons/cg";
import { BsShieldShaded } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { log } from "console";
import { useDispatch } from "react-redux";
import { setLoading } from "@/state/loading/loading";

interface NavProps {
  title: string;
  icon: any;
  description: string;
  content?: string;
  goWhere: string | null;
}

const NavComponent = ({
  title,
  icon,
  description,
  content,
  goWhere,
}: NavProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/setting/${goWhere}`);
  }

  return (
    <>
      <div className={styles.navContainer} onClick={handleNavigate}>
        <div className={styles.titleArea}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.title}>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        <MdKeyboardArrowRight
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "10px",
          }}
        />
        { content && <p className={styles.content} >{ content }</p>}
      </div>
    </>
  );
};

const Setting = () => {
  
  const settingInner: NavProps[] = [
    {
      title: "球隊設定",
      description: "管理球隊名稱",
      icon: <BsBuilding size={20} />,
      goWhere: "team_name",
      content: "ALL IN 羽球隊"
    },
    {
      title: "場地設定",
      icon: <SlLocationPin size={20} />,
      description: "設定預設場地",
      goWhere: "location",
      content: "ALL IN 運動館"
    },
    {
      title: "價格設定",
      icon: <FiDollarSign size={20} />,
      description: "設定預設價格",
      goWhere: "pricing",
      content: "200"
    },
    {
      title: "隱私權",
      icon: <BsShieldShaded size={20} />,
      description: "隱私權相關條款",
      goWhere: "private_rules",
    },
  ];

  const [defaultData, setDefaultData] = useState<NavProps[]>(settingInner);

  const handleLogout = async () => {
    await auth.signOut();
  }

  const dispatch = useDispatch();
  const getDefaultData = async () => {
    dispatch(setLoading(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      
      settingInner[0].content = data["team_name"];
      settingInner[1].content = data["default_place_name"];
      settingInner[2].content = data["default_price"];
      setDefaultData(settingInner);
      console.log(data);


    } catch ( err ) {
      console.error(err);
    }
    dispatch(setLoading(false));
  }

  useEffect(() => {
    getDefaultData();
  }, [])


  return (
    <>
      <HeaderSmall title="設定" />
      <div className={styles.container}>
        {defaultData.map((item, index) => (
          <NavComponent
            key={index}
            title={item.title}
            content={item.content}
            description={item.description}
            icon={item.icon}
            goWhere={item.goWhere}
          />
        ))}
        <button className={styles.logoutBtn} onClick={handleLogout} >登出</button>
        <div className={styles.version} >
          Version <p>1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default Setting;
