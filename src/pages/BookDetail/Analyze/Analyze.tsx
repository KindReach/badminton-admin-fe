import styles from "./Analyze.module.css";

interface brickProps {
  content: string;
  description: string;
  color: string;
  background_color: string;
}

const Brick = ({
  content,
  description,
  color,
  background_color,
}: brickProps) => {
  return (
    <div
      className={styles.brick}
      style={{ backgroundColor: `${background_color}` }}
    >
      <h2 style={{ color: `${color}` }}>{content}</h2>
      <p>{description}</p>
    </div>
  );
};

const Analyze = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h2>基本統計</h2>
        <div className={styles.bricks}>
          <Brick
            content="5"
            description="正取人數"
            color="rgba(0, 123, 255, 1)"
            background_color="rgba(184, 218, 255, 1)"
          />
          <Brick
            content="90%"
            description="出席率"
            color="rgba(40, 167, 69, 1)"
            background_color="rgba(195, 230, 203, 1)"
          />
          <Brick
            content="2"
            description="候補人數"
            color="rgba(253, 126, 20, 1)"
            background_color="rgba(255, 229, 204, 1)"
          />
          <Brick
            content="24"
            description="開放人數"
            color="rgba(111, 66, 193, 1)"
            background_color="rgba(214, 187, 251, 1)"
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <h2>收入統計</h2>
        <div className={styles.content}>
          <div className={styles.description}>
            <h2>預計收入</h2>
            <p>NT$ 1000</p>
          </div>
          <div className={styles.description}>
            <h2>每人費用</h2>
            <p>NT$ 200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
