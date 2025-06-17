import styles from "./Members.module.css";
import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MemberCard from "./components/MemberCard/MemberCard";
import { MemberProps } from "@/utils/types";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface Props {
  title: string;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  amountOfMember: number[];
}

const Category = ({ title, category, setCategory, amountOfMember }: Props) => {
  return (
    <p
      onClick={() => setCategory(title)}
      style={{
        color: `${title === category ? `rgba(0, 123, 255, 1)` : "gray"}`,
        borderBottom: `${
          title === category
            ? "1.5px solid rgba(0, 123, 255, 1)"
            : "0px solid gray"
        }`,
      }}
    >
      {title} ({ title === "正常會員" ? amountOfMember[0] : amountOfMember[1] })
    </p>
  );
};

const Members = () => {
  const categories = ["正常會員", "已封鎖"];
  const [category, setCategory] = useState<string>(categories[0]);
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  const [displayMember, setDisplayMember] = useState<MemberProps[]>([]);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [amountOfMember, setAmountOfMember] = useState<number[]>([0, 0]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (category === categories[0]) {
      setDisplayMember(memberData.filter((item) => item.is_blocked === false));
    } else {
      setDisplayMember(memberData.filter((item) => item.is_blocked));
    }
  }, [category, memberData]);

  useEffect(() => {
    setAmountOfMember([
      memberData.filter((item) => item.is_blocked === false).length,
      memberData.filter((item) => item.is_blocked).length,
    ]);
  }, [memberData]);

  const getMembers = async () => {
    try {
      dispatch(setLoading2(true));
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/members/getMembers`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      data.sort((a: MemberProps, b: MemberProps) => {
        return new Date(b.add_time).getTime() - new Date(a.add_time).getTime();
      });
      setMemberData(data);
    } catch (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    } finally {
      dispatch(setLoading2(false));
    }
  };

  useEffect(() => {
    getMembers();
  }, [updateStatus]);

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
              amountOfMember={amountOfMember}
            />
          ))}
        </div>
        <div className={styles.membersContainer}>
          {displayMember.map((item, index) => (
            <MemberCard
              user_id={item.user_id}
              profile_picture={item.profile_picture}
              user_name={item.user_name}
              amount_of_no_show={item.amount_of_no_show}
              amount_of_book={item.amount_of_book}
              is_blocked={item.is_blocked}
              add_time={item.add_time}
              setUpdateStatus={setUpdateStatus}
              membership_plan={item.membership_plan}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Members;
