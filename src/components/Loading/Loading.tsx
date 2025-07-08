import React from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  TrendingUp, 
  Shield, 
  Bell 
} from 'lucide-react';
import styles from './Loading.module.css';

interface AdminLoadingProps {
  className?: string;
}

const AdminLoading: React.FC<AdminLoadingProps> = ({ className }) => {
  return (
    <div className={`${styles.loadingContainer} ${className || ''}`}>
      {/* 背景網格和掃描線 */}
      <div className={styles.backgroundPattern}>
        <svg className={styles.patternSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#e2e8f0" strokeWidth="0.1"/>
            </pattern>
            <linearGradient id="scanLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
                <animate attributeName="stop-opacity" 
                  values="0;0.6;0" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4">
                <animate attributeName="stop-opacity" 
                  values="0.4;0.8;0.4" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0">
                <animate attributeName="stop-opacity" 
                  values="0;0.6;0" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
          
          {/* 掃描線 */}
          <line x1="0" y1="30" x2="100" y2="30" 
                stroke="url(#scanLineGradient)" 
                strokeWidth="0.3" 
                className={styles.scanLine1}>
          </line>
          <line x1="0" y1="70" x2="100" y2="70" 
                stroke="url(#scanLineGradient)" 
                strokeWidth="0.2" 
                className={styles.scanLine2}>
          </line>
        </svg>
      </div>

      {/* 主要載入內容 */}
      <div className={styles.mainContent}>
        {/* Logo 容器 */}
        <div className={styles.logoContainer}>
          {/* 外圈旋轉光環 */}
          <div className={styles.spinningRing}></div>
          
          {/* 內圈脈搏環 */}
          <div className={styles.pulseRing}></div>
          
          {/* 管理員 Logo */}
          <div className={styles.logo}>
            <svg viewBox="0 0 100 100" className={styles.logoSvg}>
              <defs>
                <linearGradient id="logoGradient">
                  <stop stopColor="#3b82f6" offset="0%"></stop>
                  <stop stopColor="#2563eb" offset="100%"></stop>
                </linearGradient>
              </defs>
              <g transform="matrix(1.5624988824137098,0,0,1.5624988824137098,-1.5624277294199018,-1.5810893715576853)" 
                 fill="url(#logoGradient)">
                <g>
                  <g>
                    <path d="M43.3477,2.457L33.881,21.4003c-0.1699,0.3398-0.5098,0.5597-0.8896,0.5597c-0.3799,0-0.7298-0.2199-0.8997-0.5597    L22.6251,2.457c-0.1899-0.3797-0.11-0.8496,0.1899-1.1495c0.2999-0.3099,0.7697-0.3799,1.1496-0.19l9.1868,4.5584l8.8469-4.5584    c0.3798-0.1899,0.8497-0.12,1.1596,0.18C43.4676,1.6074,43.5476,2.0772,43.3477,2.457z"></path>
                  </g>
                  <g>
                    <path d="M21.9453,32.9962c0,0.3799-0.2099,0.7297-0.5499,0.8997L2.4522,43.3625c-0.15,0.0699-0.2999,0.1099-0.4499,0.1099    c-0.2599,0-0.5198-0.1099-0.7098-0.2999c-0.2999-0.2998-0.3799-0.7596-0.1899-1.1495l4.5584-9.1867l-4.5484-8.847    c-0.1999-0.3799-0.13-0.8497,0.1799-1.1595c0.2999-0.3099,0.7697-0.38,1.1596-0.19l18.9432,9.4666    C21.7354,32.2765,21.9453,32.6263,21.9453,32.9962z"></path>
                  </g>
                  <g>
                    <path d="M43.1678,64.6949c-0.1999,0.19-0.4499,0.2899-0.7098,0.2899c-0.1499,0-0.2999-0.03-0.4499-0.0999l-9.1867-4.5583    l-8.8368,4.5483c-0.3899,0.2-0.8597,0.13-1.1696-0.17c-0.2999-0.3098-0.3799-0.7798-0.1899-1.1595l9.4666-18.9434    c0.1699-0.3398,0.5198-0.5597,0.8997-0.5597c0.3799,0,0.7197,0.2199,0.8896,0.5597l9.4667,18.9434    C43.5376,63.9252,43.4676,64.3951,43.1678,64.6949z"></path>
                  </g>
                  <g>
                    <path d="M61.9112,18.7269l-20.0889,6.701c-0.3605,0.1202-0.7563,0.0353-1.0249-0.2333c-0.2686-0.2686-0.3605-0.6715-0.2404-1.032    L47.258,4.0738c0.1342-0.4028,0.5229-0.6785,0.9471-0.6785c0.4312-0.0071,0.8129,0.2756,0.9472,0.6785l3.2727,9.7193l9.479,3.0324    c0.4028,0.1343,0.6856,0.516,0.6927,0.9472C62.5967,18.211,62.3211,18.5998,61.9112,18.7269z"></path>
                  </g>
                  <g>
                    <path d="M17.775,62.6086c-0.2757-0.007-0.5231-0.1131-0.7069-0.2969c-0.106-0.106-0.1908-0.2333-0.2474-0.3888l-3.2728-9.7192    l-9.4647-3.0324c-0.4171-0.1343-0.6998-0.516-0.7068-0.9472c0.007-0.4312,0.2828-0.82,0.6856-0.9542l20.0889-6.7011    c0.3605-0.1202,0.7634-0.0282,1.032,0.2404c0.2686,0.2686,0.3534,0.6644,0.2333,1.0249l-6.701,20.0889    C18.5809,62.3258,18.1991,62.6086,17.775,62.6086z"></path>
                  </g>
                  <g>
                    <path d="M4.062,18.7269l20.0889,6.701c0.3605,0.1202,0.7563,0.0353,1.0249-0.2333c0.2686-0.2686,0.3605-0.6715,0.2404-1.032    L18.7151,4.0738c-0.1342-0.4028-0.5229-0.6785-0.9471-0.6785c-0.4312-0.0071-0.8129,0.2756-0.9472,0.6785l-3.2727,9.7193    l-9.479,3.0324c-0.4028,0.1343-0.6856,0.516-0.6927,0.9472C3.3764,18.211,3.6521,18.5998,4.062,18.7269z"></path>
                  </g>
                  <g>
                    <path d="M48.1981,62.6086c0.2757-0.007,0.5231-0.1131,0.7069-0.2969c0.106-0.106,0.1908-0.2333,0.2474-0.3888l3.2728-9.7192    l9.4647-3.0324c0.4171-0.1343,0.6998-0.516,0.7068-0.9472c-0.007-0.4312-0.2828-0.82-0.6856-0.9542l-20.0889-6.7011    c-0.3605-0.1202-0.7634-0.0282-1.032,0.2404s-0.3534,0.6644-0.2333,1.0249l6.701,20.0889    C47.3923,62.3258,47.774,62.6086,48.1981,62.6086z"></path>
                  </g>
                  <g>
                    <path d="M65,42.4728c0,0.5499-0.4498,0.9996-0.9996,0.9996c-0.0099,0-0.0199,0-0.0199,0c-0.15,0-0.3099-0.04-0.4499-0.1099    l-18.9433-9.4666c-0.3398-0.17-0.5498-0.5198-0.5498-0.8997c0-0.3699,0.2099-0.7197,0.5498-0.8897l18.9433-9.4666    c0.3899-0.19,0.8497-0.12,1.1496,0.19c0.3099,0.2998,0.3898,0.7597,0.1899,1.1495l-4.5484,9.1868l4.4685,8.6869    C64.9201,42.023,65,42.2329,65,42.4728z"></path>
                  </g>
                  <g>
                    <path d="M38.6594,32.9962c0,3.1289-2.5391,5.6779-5.668,5.6779c-3.1289,0-5.668-2.549-5.668-5.6779    c0-3.1189,2.5391-5.6679,5.668-5.6679C36.1203,27.3283,38.6594,29.8773,38.6594,32.9962z"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* 進度條 */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}></div>
          <div className={styles.progressGlow}></div>
        </div>

        {/* 載入文字區域 */}
        <div className={styles.loadingTextArea}>
          <div className={styles.mainText}>
            <span className={styles.typingText}>管理系統載入中</span>
            <span className={styles.dots}>...</span>
          </div>
          <div className={styles.statusText}>正在初始化儀表板</div>
        </div>

        {/* 浮動管理圖標 */}
        <div className={styles.floatingIcons}>
          {/* 圖表圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon1}`}>
            <BarChart3 />
          </div>
          
          {/* 用戶管理圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon2}`}>
            <Users />
          </div>
          
          {/* 設定圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon3}`}>
            <Settings />
          </div>
          
          {/* 數據分析圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon4}`}>
            <TrendingUp />
          </div>
          
          {/* 安全圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon5}`}>
            <Shield />
          </div>
          
          {/* 通知圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon6}`}>
            <Bell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoading;