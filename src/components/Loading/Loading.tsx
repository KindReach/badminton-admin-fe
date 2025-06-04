import React from 'react';
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
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          
          {/* 用戶管理圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon2}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 7c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5 5-2.24 5-5zM12 14c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
            </svg>
          </div>
          
          {/* 設定圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon3}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
          </div>
          
          {/* 數據分析圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon4}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,9.2h3V19H5V9.2z M10.6,5h2.8v14h-2.8V5z M16.2,13H19v6h-2.8V13z"/>
            </svg>
          </div>
          
          {/* 安全圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon5}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1 s3.1,1.39,3.1,3.1V8z"/>
            </svg>
          </div>
          
          {/* 通知圖標 */}
          <div className={`${styles.floatingIcon} ${styles.icon6}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z M18,16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-0.83-0.67-1.5-1.5-1.5 s-1.5,0.67-1.5,1.5v0.68C7.63,5.36,6,7.92,6,11v5l-2,2v1h16v-1L18,16z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoading;