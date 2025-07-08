import { ExternalLink, Users } from "lucide-react";
import styles from "./RedirectButton.module.scss";

interface Props {
  size?: 'small' | 'medium' | 'large';
  position?: 'fixed' | 'inline';
}

const RedirectButton = ({ size = 'medium', position = 'fixed' }: Props) => {
  const handleRedirectToUserSystem = () => {
    window.open("https://kindreachbadminton.com/", "_blank");
  };

  return (
    <button
      className={`${styles.redirectButton} ${styles[size]} ${styles[position]}`}
      onClick={handleRedirectToUserSystem}
      title="前往球友揪團系統"
    >
      <div className={styles.iconWrapper}>
        <Users size={size === 'small' ? 14 : size === 'medium' ? 16 : 18} />
      </div>
      <span className={styles.text}>球友版</span>
      <ExternalLink size={size === 'small' ? 10 : size === 'medium' ? 12 : 14} className={styles.externalIcon} />
    </button>
  );
};

export default RedirectButton;
