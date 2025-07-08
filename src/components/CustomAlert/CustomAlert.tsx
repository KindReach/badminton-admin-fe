import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import styles from "./CustomAlert.module.scss";

interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

const CustomAlert = ({ 
  variant = 'info', 
  children, 
  className = '', 
  size = 'medium',
  showIcon = true 
}: Props) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={size === 'small' ? 16 : size === 'medium' ? 18 : 20} />;
      case 'warning':
        return <AlertTriangle size={size === 'small' ? 16 : size === 'medium' ? 18 : 20} />;
      case 'error':
        return <XCircle size={size === 'small' ? 16 : size === 'medium' ? 18 : 20} />;
      case 'info':
      default:
        return <Info size={size === 'small' ? 16 : size === 'medium' ? 18 : 20} />;
    }
  };

  return (
    <div className={`${styles.alert} ${styles[variant]} ${styles[size]} ${className}`}>
      {showIcon && (
        <div className={styles.iconWrapper}>
          {getIcon()}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default CustomAlert;
