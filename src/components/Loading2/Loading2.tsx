import styles from "./Loading.module.scss";

const Loading2 = () => {
  return (
    <div className={styles.backdrop}>
      <div>
        <div className={styles.shuttlecock}></div>
      </div>
    </div>
  );
};

export default Loading2;