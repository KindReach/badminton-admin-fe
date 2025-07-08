import styles from "./Analyze.module.css";
import {
  FiUsers,
  FiPercent,
  FiGrid,
  FiUserCheck,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import { BiCoinStack } from "react-icons/bi";

interface Props {
  amount_of_member: number;
  amount_of_court: number;
  limit_of_member: number;
  price: number;
  rateOfShow: number;
}

const Analyze = ({
  amount_of_court,
  amount_of_member,
  limit_of_member,
  price,
  rateOfShow,
}: Props) => {
  // 計算各種統計數據
  const confirmedMembers = Math.min(limit_of_member, amount_of_member);
  const waitingMembers = Math.max(0, amount_of_member - limit_of_member);
  const fillRate =
    limit_of_member > 0 ? (confirmedMembers / limit_of_member) * 100 : 0;
  const totalExpectedRevenue = amount_of_member * price;
  const confirmedRevenue = confirmedMembers * price;

  return (
    <div className={styles.container}>
      {/* 基本統計 */}
      <div className={styles.statsSection}>
        <div className={styles.sectionHeader}>
          <h2>場次概況</h2>
          <span className={styles.subtitle}>基本統計資訊</span>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>正取人數</div>
            <div className={styles.statValue}>{confirmedMembers}</div>
            <div className={styles.statUnit}>人</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>出席率</div>
            <div className={styles.statValue}>{rateOfShow}</div>
            <div className={styles.statUnit}>%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>開放場數</div>
            <div className={styles.statValue}>{amount_of_court}</div>
            <div className={styles.statUnit}>場</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>開放人數</div>
            <div className={styles.statValue}>{limit_of_member}</div>
            <div className={styles.statUnit}>人</div>
          </div>
        </div>
      </div>

      {/* 報名進度 */}
      <div className={styles.progressSection}>
        <div className={styles.sectionHeader}>
          <h2>報名狀況</h2>
        </div>
        <div className={styles.progressList}>
          <div className={styles.progressItem}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>報名進度</span>
              <span className={styles.progressValue}>
                {confirmedMembers}/{limit_of_member}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(100, fillRate)}%` }}
              />
            </div>
            <div className={styles.progressPercent}>{fillRate.toFixed(0)}%</div>
          </div>
          
          {waitingMembers > 0 && (
            <div className={styles.progressItem}>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>候補人數</span>
                <span className={styles.progressValue}>{waitingMembers} 人</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.waiting}`}
                  style={{
                    width: `${Math.min(100, (waitingMembers / limit_of_member) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 收入統計 */}
      <div className={styles.financeSection}>
        <div className={styles.sectionHeader}>
          <h2>收入明細</h2>
        </div>
        <div className={styles.financeGrid}>
          <div className={styles.financeItem}>
            <div className={styles.financeLabel}>預計總收入</div>
            <div className={styles.financeValue}>
              NT$ {totalExpectedRevenue.toLocaleString()}
            </div>
            <div className={styles.financeNote}>
              {amount_of_member} 位報名者
            </div>
          </div>
          <div className={styles.financeItem}>
            <div className={styles.financeLabel}>確認收入</div>
            <div className={styles.financeValue}>
              NT$ {confirmedRevenue.toLocaleString()}
            </div>
            <div className={styles.financeNote}>
              {confirmedMembers} 位正取者
            </div>
          </div>
          <div className={styles.financeItem}>
            <div className={styles.financeLabel}>單人費用</div>
            <div className={styles.financeValue}>
              NT$ {price.toLocaleString()}
            </div>
            <div className={styles.financeNote}>
              每人場地費用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
