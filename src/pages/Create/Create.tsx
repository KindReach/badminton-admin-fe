import { CreateSessionType } from "@/utils/types";
import Header from "./components/Header/Header";
import styles from "./Create.module.css";
import { useState } from "react";
import Single from "./components/Single/Single";
import MultiCreate from "./components/MultiCreate/MultiCreate";
import { Offcanvas } from "react-bootstrap";

interface Props {
  show: any;
  setShow: (key: any) => void;
}

const PublishCheck = ({ show, setShow }: Props) => {
  return (
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="top"
      backdrop="static"
    >
      <Offcanvas.Header
        closeButton
        style={{ borderBottom: "0.9px solid lightgray" }}
      >
        <Offcanvas.Title>Hello</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={styles.components}>
          <h1>Hello Hello</h1>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const Create = () => {
  const categories = ["單次新增", "批量新增"];
  const [category, setCategory] = useState<string>(categories[0]);
  const [createData, setCreateData] = useState<CreateSessionType[]>([]);
  const [show, setShow] = useState(false);

  const addNewSession = (session: CreateSessionType) => {
    setCreateData([...createData, session]);
  };

  return (
    <>
      <Header
        categories={categories}
        category={category}
        setCategory={setCategory}
        setShow={setShow}
        title="新增場次"
      />
      {category === categories[0] ? <Single /> : <MultiCreate />}
      <PublishCheck show={show} setShow={setShow} />
    </>
  );
};

export default Create;
