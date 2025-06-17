import styles from "./MemberCard.module.css";
import { MemberProps } from "@/utils/types";
import {
  LuCircleAlert,
  LuUser,
  LuCalendar,
  LuStar,
  LuCrown,
  LuChevronDown,
} from "react-icons/lu";
import { MdOutlineCancel } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Offcanvas } from "react-bootstrap";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";

interface Props extends MemberProps {
  setUpdateStatus: Dispatch<SetStateAction<boolean>>;
}

const MemberCard = ({
  user_id,
  user_name,
  profile_picture,
  is_blocked,
  amount_of_no_show,
  amount_of_book,
  add_time,
  setUpdateStatus,
  membership_plan,
}: Props) => {
  const stateConfig = useMemo(
    () => ({
      icons: [
        <FiCheckCircle key="normal" />,
        <LuCircleAlert key="warning" />,
        <MdOutlineCancel key="blocked" />,
      ],
      content: ["正常", "警告", "已封鎖"],
      colors: ["#3b82f6", "#f59e0b", "#ef4444"],
      bgColors: ["#eff6ff", "#fef3c7", "#fee2e2"],
    }),
    []
  );

  const membershipConfig = useMemo(
    () => ({
      general: {
        label: "一般會員",
        color: "#6b7280",
        bgColor: "#f9fafb",
        borderColor: "#d1d5db",
        icon: <LuUser size={16} />,
        gradient: "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)",
      },
      monthly: {
        label: "月繳會員",
        color: "#059669",
        bgColor: "#ecfdf5",
        borderColor: "#a7f3d0",
        icon: <LuCalendar size={16} />,
        gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      },
      seasonal: {
        label: "季繳會員",
        color: "#dc2626",
        bgColor: "#fef2f2",
        borderColor: "#fecaca",
        icon: <LuStar size={16} />,
        gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      },
      yearly: {
        label: "年繳會員",
        color: "#7c3aed",
        bgColor: "#faf5ff",
        borderColor: "#ddd6fe",
        icon: <LuCrown size={16} />,
        gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
      },
    }),
    []
  );

  useEffect(() => {
    setCurrentMembership(membership_plan || "general");
  }, [membership_plan]);

  const [state, setState] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(
    membership_plan || "general"
  );
  const [showMembershipDropdown, setShowMembershipDropdown] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">(
    "down"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setState(is_blocked ? 2 : 0);
  }, [is_blocked]);

  const noShowRate = useMemo(() => {
    return amount_of_book > 0
      ? ((amount_of_no_show / amount_of_book) * 100).toFixed(1)
      : 0;
  }, [amount_of_no_show, amount_of_book]);

  const handleSwitchBlock = async () => {
    if (isLoading) return;

    setIsLoading(true);
    dispatch(setLoading2(true));

    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.post(
        `${apiPrefix}/members/switchBlock`,
        { user_id },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setUpdateStatus((prev) => !prev);
      setShow(false);
    } catch (err) {
      console.error("封鎖狀態切換失敗:", err);
    } finally {
      setIsLoading(false);
      dispatch(setLoading2(false));
    }
  };

  // 計算下拉選單方向
  const calculateDropdownDirection = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 如果下方空間不足200px且上方空間充足，則向上展開
    if (spaceBelow < 200 && spaceAbove > 200) {
      setDropdownDirection("up");
    } else {
      setDropdownDirection("down");
    }
  };

  // 處理會員身份切換的函數
  const handleMembershipSwitch = async (newMembership: string) => {
    if (isLoading || newMembership === currentMembership) {
      setShowMembershipDropdown(false);
      return;
    }

    setIsLoading(true);
    dispatch(setLoading2(true));

    try {
      const { data } = await axios.post(
        `${apiPrefix}/members/updateMembership`,
        {
          user_id,
          membership_plan: newMembership,
        },
        {
          headers: {
            Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
          },
        }
      );

      console.log('====================================');
      console.log("會員身份更新成功:", data);
      console.log('====================================');

      // 暫時模擬成功的情況
      setCurrentMembership(newMembership);
      setUpdateStatus((prev) => !prev);
      setShowMembershipDropdown(false);
    } catch (err) {
      console.error("會員身份更新失敗:", err);
    } finally {
      setIsLoading(false);
      dispatch(setLoading2(false));
    }
  };

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMembershipDropdown(false);
      }
    };

    if (showMembershipDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMembershipDropdown]);

  const handleCardClick = () => {
    setShow(true);
  };

  return (
    <>
      <div className={styles.memberContainer} onClick={handleCardClick}>
        <div className={styles.profile}>
          <div className={styles.headContainer}>
            <img src={profile_picture} alt={`${user_name}的頭像`} />
            <div
              className={styles.membershipBadge}
              style={{
                background:
                  membershipConfig[
                    currentMembership as keyof typeof membershipConfig
                  ]?.gradient,
              }}
            >
              {
                membershipConfig[
                  currentMembership as keyof typeof membershipConfig
                ]?.icon
              }
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.nameRow}>
              <h2>{user_name}</h2>
              <span
                className={styles.membershipLabel}
                style={{
                  color:
                    membershipConfig[
                      currentMembership as keyof typeof membershipConfig
                    ]?.color,
                  backgroundColor:
                    membershipConfig[
                      currentMembership as keyof typeof membershipConfig
                    ]?.bgColor,
                  borderColor:
                    membershipConfig[
                      currentMembership as keyof typeof membershipConfig
                    ]?.borderColor,
                }}
              >
                {
                  membershipConfig[
                    currentMembership as keyof typeof membershipConfig
                  ]?.label
                }
              </span>
            </div>
            <p className={styles.time}>加入時間：{add_time}</p>
          </div>
        </div>

        <div className={styles.functions}>
          <div className={styles.statGroup}>
            <span className={styles.statNumber}>{amount_of_book}</span>
            <span className={styles.statLabel}>參與次數</span>
          </div>
          <div className={styles.statGroup}>
            <span className={styles.statNumber}>{amount_of_no_show}</span>
            <span className={styles.statLabel}>取消次數</span>
          </div>
          <div className={styles.statGroup}>
            <span className={`${styles.statNumber} ${styles.rateNumber}`}>
              {noShowRate}%
            </span>
            <span className={styles.statLabel}>取消率</span>
          </div>
        </div>

        <div
          className={styles.state}
          style={{
            color: stateConfig.colors[state],
            backgroundColor: stateConfig.bgColors[state],
          }}
        >
          {stateConfig.icons[state]}
          <span>{stateConfig.content[state]}</span>
        </div>

        <MdKeyboardArrowRight className={styles.arrowIcon} />
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="bottom"
        backdrop="static"
        className={styles.customOffcanvas}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>
            會員詳情
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className={styles.offcanvasBody}>
          <div className={styles.memberDetails}>
            <div className={styles.memberInfo}>
              <div className={styles.avatarContainer}>
                <img
                  src={profile_picture}
                  alt={`${user_name}的頭像`}
                  className={styles.largeAvatar}
                />
                <div
                  className={styles.largeMembershipBadge}
                  style={{
                    background:
                      membershipConfig[
                        currentMembership as keyof typeof membershipConfig
                      ]?.gradient,
                  }}
                >
                  {
                    membershipConfig[
                      currentMembership as keyof typeof membershipConfig
                    ]?.icon
                  }
                </div>
              </div>
              <h3>{user_name}</h3>

              <div className={styles.badgeContainer}>
                <div
                  className={styles.statusBadge}
                  style={{
                    color: stateConfig.colors[state],
                    backgroundColor: stateConfig.bgColors[state],
                  }}
                >
                  {stateConfig.icons[state]}
                  <span>{stateConfig.content[state]}</span>
                </div>

                <div
                  className={styles.membershipDisplay}
                  style={{
                    color:
                      membershipConfig[
                        currentMembership as keyof typeof membershipConfig
                      ]?.color,
                    backgroundColor:
                      membershipConfig[
                        currentMembership as keyof typeof membershipConfig
                      ]?.bgColor,
                    borderColor:
                      membershipConfig[
                        currentMembership as keyof typeof membershipConfig
                      ]?.borderColor,
                  }}
                >
                  {
                    membershipConfig[
                      currentMembership as keyof typeof membershipConfig
                    ]?.icon
                  }
                  <span>
                    {
                      membershipConfig[
                        currentMembership as keyof typeof membershipConfig
                      ]?.label
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>加入時間</span>
                <span className={styles.statValue}>{add_time}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>參與次數</span>
                <span className={styles.statValue}>{amount_of_book} 次</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>取消次數</span>
                <span className={styles.statValue}>{amount_of_no_show} 次</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>取消率</span>
                <span className={styles.statValue}>{noShowRate}%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>會員身份</span>
                <div className={styles.membershipSwitcher} ref={dropdownRef}>
                  <button
                    ref={buttonRef}
                    className={styles.membershipButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!showMembershipDropdown) {
                        calculateDropdownDirection();
                      }
                      setShowMembershipDropdown(!showMembershipDropdown);
                    }}
                    disabled={isLoading}
                    style={{
                      background:
                        membershipConfig[
                          currentMembership as keyof typeof membershipConfig
                        ]?.gradient,
                    }}
                  >
                    <div className={styles.membershipButtonContent}>
                      <div className={styles.membershipButtonIcon}>
                        {
                          membershipConfig[
                            currentMembership as keyof typeof membershipConfig
                          ]?.icon
                        }
                      </div>
                      <span className={styles.membershipButtonText}>
                        {
                          membershipConfig[
                            currentMembership as keyof typeof membershipConfig
                          ]?.label
                        }
                      </span>
                      <LuChevronDown
                        className={`${styles.membershipButtonArrow} ${
                          showMembershipDropdown ? styles.rotated : ""
                        }`}
                        size={14}
                      />
                    </div>
                  </button>

                  {showMembershipDropdown && (
                    <div
                      className={`${styles.membershipDropdownMenu} ${styles[dropdownDirection]}`}
                    >
                      {Object.entries(membershipConfig).map(([key, config]) => (
                        <button
                          key={key}
                          className={`${styles.membershipOption} ${
                            currentMembership === key
                              ? styles.activeMembershipOption
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMembershipSwitch(key);
                          }}
                          disabled={isLoading}
                        >
                          <div
                            className={styles.membershipOptionIcon}
                            style={{ background: config.gradient }}
                          >
                            {config.icon}
                          </div>
                          <span className={styles.membershipOptionLabel}>
                            {config.label}
                          </span>
                          {currentMembership === key && (
                            <div className={styles.membershipOptionCheck}>
                              <FiCheckCircle size={14} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${
                state === 2 ? styles.unblockBtn : styles.blockBtn
              }`}
              onClick={handleSwitchBlock}
              disabled={isLoading}
            >
              {isLoading ? "處理中..." : state === 2 ? "解除封鎖" : "封鎖會員"}
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MemberCard;
