import styles from "./Members.module.css";
import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import data from "./data.json";
import MemberCard from "./components/MemberCard/MemberCard";
import { MemberProps } from "@/utils/types";

interface Props {
  title: string;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const Category = ({ title, category, setCategory }: Props) => {
  return (
    <p
      onClick={() => setCategory(title)}
      style={{
        color: `${title === category ? `rgba(0, 123, 255, 1)` : "gray"}`,
        borderBottom: `${title === category ? "1.5px solid rgba(0, 123, 255, 1)" : "0px solid gray"}`,
      }}
    >
      {title}
    </p>
  );
};

const Members = () => {
  const categories = ["正常會員", "已封鎖"];
  const [category, setCategory] = useState<string>(categories[0]);
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  const [displayMember, setDisplayMember] = useState<MemberProps[]>([]);

  useEffect(() => {
    if (category === categories[0]) {
      setDisplayMember(memberData.filter((item) => item.is_block === false));
    } else {
      setDisplayMember(memberData.filter((item) => item.is_block));
    }
  }, [category, memberData]);

  useEffect(() => {
    setMemberData(data);
  }, []);

  return (
    <>
      <HeaderSmall title="會員管理" />

      <div className={styles.container}>
        <div className={styles.categories}>
          {categories.map((item, index) => (
            <Category
              title={item}
              key={index}
              category={category}
              setCategory={setCategory}
            />
          ))}
        </div>
        <div className={styles.membersContainer}>
          {displayMember.map((item, index) => (
            <MemberCard
              profile_picture={item.profile_picture}
              user_name={item.user_name}
              amount_of_no_show={item.amount_of_no_show}
              amount_of_book={item.amount_of_book}
              is_block={item.is_block}
              add_time={item.add_time}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Members;
