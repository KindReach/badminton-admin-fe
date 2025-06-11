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
  const averageCostPerCourt =
    amount_of_court > 0 ? totalExpectedRevenue / amount_of_court : 0;
  const efficiencyRatio =
    amount_of_court > 0 ? confirmedMembers / amount_of_court : 0;

  return (
    <div className={styles.container}>
      {/* 基本統計 */}
      <div className={styles.contentContainer}>
        <h2>基本統計</h2>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.primary}`}>
            <FiUserCheck className={styles.statIcon} />
            <span className={styles.statValue}>{confirmedMembers}</span>
            <p className={styles.statLabel}>正取人數</p>
          </div>
          <div className={`${styles.statCard} ${styles.success}`}>
            <FiPercent className={styles.statIcon} />
            <span className={styles.statValue}>{rateOfShow}%</span>
            <p className={styles.statLabel}>出席率</p>
          </div>
          <div className={`${styles.statCard} ${styles.warning}`}>
            <FiGrid className={styles.statIcon} />
            <span className={styles.statValue}>{amount_of_court}</span>
            <p className={styles.statLabel}>開放場數</p>
          </div>
          <div className={`${styles.statCard} ${styles.purple}`}>
            <FiUsers className={styles.statIcon} />
            <span className={styles.statValue}>{limit_of_member}</span>
            <p className={styles.statLabel}>開放人數</p>
          </div>
        </div>
      </div>

      {/* 報名進度 */}
      <div className={styles.contentContainer}>
        <h2>報名進度</h2>
        <div className={styles.progressStats}>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>報名進度</span>
              <span className={styles.progressValue}>
                {confirmedMembers}/{limit_of_member}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.primary}`}
                style={{ width: `${fillRate}%` }}
              ></div>
            </div>
          </div>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>出席進度</span>
              <span className={styles.progressValue}>{rateOfShow}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.success}`}
                style={{ width: `${rateOfShow}%` }}
              ></div>
            </div>
          </div>
          {waitingMembers > 0 && (
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>候補人數</span>
                <span className={styles.progressValue}>{waitingMembers} 人</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.warning}`}
                  style={{
                    width: `${Math.min(
                      100,
                      (waitingMembers / limit_of_member) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 收入統計 */}
      <div className={styles.contentContainer}>
        <h2>收入統計</h2>
        <div className={styles.financeGrid}>
          <div className={styles.financeCard}>
            <div className={styles.financeHeader}>
              <FiDollarSign className={styles.financeIcon} />
              <h3 className={styles.financeTitle}>預計總收入</h3>
            </div>
            <div className={styles.financeAmount}>
              NT$ {totalExpectedRevenue.toLocaleString()}
            </div>
            <p className={styles.financeSubtext}>
              基於 {amount_of_member} 位報名者
            </p>
          </div>
          <div className={styles.financeCard}>
            <div className={styles.financeHeader}>
              <BiCoinStack className={styles.financeIcon} />
              <h3 className={styles.financeTitle}>確認收入</h3>
            </div>
            <div className={styles.financeAmount}>
              NT$ {confirmedRevenue.toLocaleString()}
            </div>
            <p className={styles.financeSubtext}>
              基於 {confirmedMembers} 位正取者
            </p>
          </div>
          <div className={styles.financeCard}>
            <div className={styles.financeHeader}>
              <FiTarget className={styles.financeIcon} />
              <h3 className={styles.financeTitle}>每人費用</h3>
            </div>
            <div className={styles.financeAmount}>
              NT$ {price.toLocaleString()}
            </div>
            <p className={styles.financeSubtext}>單人場地費用</p>
          </div>
        </div>
      </div>

      {/* 效率指標 */}
      <div className={styles.contentContainer}>
        <h2>效率指標</h2>
        <div className={styles.efficiencyMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{fillRate.toFixed(1)}%</div>
            <p className={styles.metricLabel}>報名滿額率</p>
            <p
              className={`${styles.metricTrend} ${
                fillRate >= 80 ? styles.positive : styles.neutral
              }`}
            >
              {fillRate >= 80 ? "報名狀況良好" : "仍有名額"}
            </p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{efficiencyRatio.toFixed(1)}</div>
            <p className={styles.metricLabel}>每場平均人數</p>
            <p className={`${styles.metricTrend} ${styles.neutral}`}>
              人數/場地比
            </p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>
              NT$ {averageCostPerCourt.toFixed(0)}
            </div>
            <p className={styles.metricLabel}>每場平均收入</p>
            <p className={`${styles.metricTrend} ${styles.neutral}`}>
              收入效率
            </p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{waitingMembers}</div>
            <p className={styles.metricLabel}>候補人數</p>
            <p
              className={`${styles.metricTrend} ${
                waitingMembers > 0 ? styles.positive : styles.neutral
              }`}
            >
              {waitingMembers > 0 ? "需求超出供給" : "尚未滿額"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
