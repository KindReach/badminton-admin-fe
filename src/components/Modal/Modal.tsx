import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setModalShow } from "@/state/modal/modal";
import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";
import styles from "./Modal.module.scss";

const Modals = () => {
  const { show, message, title, level } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setModalShow(false));
  };

  // 點擊遮罩關閉
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 阻止背景滾動
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  // 根據級別獲取圖標
  const getIcon = () => {
    switch (level) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'warning':
        return <AlertCircle className={styles.icon} />;
      case 'error':
        return <XCircle className={styles.icon} />;
      case 'info':
      default:
        return <Info className={styles.icon} />;
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${styles[level]}`}>
        {/* 頂部指示器 */}
        <div className={styles.indicator}></div>
        
        {/* 關閉按鈕 */}
        <button className={styles.closeBtn} onClick={handleClose}>
          <X />
        </button>

        {/* 內容區域 */}
        <div className={styles.modalContent}>
          {/* 圖標區域 */}
          <div className={`${styles.iconContainer} ${styles[level]}`}>
            {getIcon()}
          </div>

          {/* 文字內容 */}
          <div className={styles.textContent}>
            {title && (
              <h3 className={styles.title}>{title}</h3>
            )}
            <p className={styles.message}>{message}</p>
          </div>
        </div>

        {/* 按鈕區域 */}
        <div className={styles.modalActions}>
          <button 
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleClose}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modals;