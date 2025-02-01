import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Setting.module.css";
import { BsBuilding } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { FiDollarSign } from "react-icons/fi";
import { CgMail } from "react-icons/cg";
import { BsShieldShaded } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "@/utils/firebase";

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
    },
    {
      title: "場地設定",
      icon: <SlLocationPin size={20} />,
      description: "設定預設場地",
      goWhere: "location",
    },
    {
      title: "價格設定",
      icon: <FiDollarSign size={20} />,
      description: "設定預設價格",
      goWhere: "pricing",
    },
    {
      title: "隱私權",
      icon: <BsShieldShaded size={20} />,
      description: "隱私權相關條款",
      goWhere: "private_rules",
    },
  ];

  const handleLogout = async () => {
    await auth.signOut();
  }

  return (
    <>
      <HeaderSmall title="設定" />
      <div className={styles.container}>
        {settingInner.map((item, index) => (
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
