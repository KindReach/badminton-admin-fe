import styles from "./Single.module.css";
import { Form, Alert } from "react-bootstrap";
import { SlLocationPin } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { IoAlertCircleOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs"; // 新增場次分類圖標
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CreateSessionType } from "@/utils/types";
import { setLoading2 } from "@/state/loading/loading";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // 引入繁體中文語系

// 定義場地數據類型
interface Venue {
  place_name: string;
  address: string; // 行政區
  location: string; // 地圖連結
  region: string; // 區域（縣市）
}

// 新增場次分類類型
interface SessionCategory {
  name: string;
  color: string;
  description: string;
}

// interface FormData {
//   place_name: string;
//   location: string;
//   region: string;
//   amount_of_court: string;
//   limit_of_member: string;
//   description: string;
//   price: string;
//   is_public: boolean;
//   categories: string[]; // 新增場次分類欄位
// }

interface NumberErrors {
  amount_of_court?: string;
  limit_of_member?: string;
  price?: string;
}

interface Props {
  addNewSession: (session: CreateSessionType, isMulti: boolean) => void;
  setShow: (key: any) => void;
}

const Single = ({ addNewSession, setShow }: Props) => {
  const [formData, setFormData] = useState<CreateSessionType>({
    date: "",
    start_time: "",
    end_time: "",
    place_name: "",
    location: "",
    region: "",
    amount_of_court: 0,
    limit_of_member: 0,
    description: "",
    price: 0,
    is_public: false,
    categories: [], // 初始化場次分類為空陣列
  });

  // 場次分類選項
  const sessionCategories: SessionCategory[] = [
    { name: '休閒', color: '#4ADE80', description: '輕鬆友好的氛圍，適合放鬆打球' },
    { name: '競技', color: '#F43F5E', description: '較高強度，適合有經驗的球友切磋' },
    { name: '社交', color: '#3B82F6', description: '以交友社交為主的輕鬆場次' },
    { name: '訓練', color: '#FACC15', description: '專注於技術提升和系統性訓練' },
    { name: '初學', color: '#8B5CF6', description: '歡迎新手，有耐心指導' }
  ];

  // 處理分類切換
  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      if (prev.categories.includes(categoryId)) {
        return { ...prev, categories: prev.categories.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categories: [...prev.categories, categoryId] };
      }
    });
  };

  useEffect(() => {
    if ( formData.categories.length > 0 ) {
      setErrorOfCategories(false);
    }
  }, [formData.categories])

  // 新增場地資料庫相關狀態
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const [date, setDate] = useState<string | null>(null);
  const [errorOfTime, setErrorOfTime] = useState<boolean>(false);
  const [errorOfDate, setErrorOfDate] = useState<boolean>(false);
  const [errorOfCourt, setErrorOfCourt] = useState<boolean>(false);
  const [errorOfLimit, setErrorOfLimit] = useState<boolean>(false);
  const [errorOfPrice, setErrorOfPrice] = useState<boolean>(false);
  const [errorOfCategories, setErrorOfCategories] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const dispatch = useDispatch();

  // 時間驗證
  useEffect(() => {
    if (errorOfDate && date) setErrorOfDate(false);
    if (errorOfTime && startTime && endTime) setErrorOfTime(false);
    if (startTime && endTime && endTime !== "00:00" && startTime >= endTime) {
      setErrorOfTime(true);
    }
  }, [startTime, endTime, date]);

  // 數字輸入驗證
  useEffect(() => {
    if (formData.amount_of_court) {
      if (formData.amount_of_court <= 0) {
        setErrorOfCourt((prev) => true);
      } else {
        setErrorOfCourt((prev) => false);
      }
    }

    if (formData.limit_of_member) {
      if (formData.limit_of_member <= 0) {
        setErrorOfLimit((prev) => true); //"人數限制必須大於 0";
      } else {
        setErrorOfLimit((prev) => false);
      }
    }

    if (formData.price) {
      if (formData.price <= 0) {
        setErrorOfPrice((prev) => true); //"價格必須大於 0";
      } else {
        setErrorOfPrice((prev) => false);
      }
    }
  }, [formData.amount_of_court, formData.limit_of_member, formData.price]);

  // 獲取場地資料
  const fetchVenues = async () => {
    dispatch(setLoading2(true));
    try {
      // 在實際應用中，您需要替換這個部分以連接到您的 API
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/getCourts`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const venueData = data as Venue[];

      setVenues(venueData);

      // 提取不重複的區域
      const uniqueRegions = [
        ...new Set(venueData.map((venue: Venue) => venue.region)),
      ].filter(Boolean);
      setRegions(uniqueRegions);
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading2(false));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 如果是場地名稱，處理自動完成建議
    if (name === "place_name") {
      let filtered = venues;

      // 如果選擇了區域，先按區域過濾
      if (formData.region) {
        filtered = filtered.filter((venue) => venue.region === formData.region);
      }

      // 再按名稱過濾
      filtered = filtered.filter((venue) =>
        venue.place_name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredVenues(filtered);
      setShowSuggestions(value.length > 0);
    }
  };

  // 選擇場地
  const selectVenue = (venue: Venue) => {
    setFormData((prev) => ({
      ...prev,
      place_name: venue.place_name,
      location: venue.location,
    }));
    setShowSuggestions(false);
  };

  // 選擇區域 - 修改後會清除場地信息
  const selectRegion = (region: string) => {
    setFormData((prev) => ({ ...prev, region }));
    setShowRegionFilter(false);

    // 清除場地名稱和地圖連結
    setFormData((prev) => ({
      ...prev,
      place_name: "",
      location: "",
    }));

    // 清除建議列表
    setFilteredVenues([]);
    setShowSuggestions(false);
  };

  // 重置區域篩選 - 同樣清除場地信息
  const resetRegion = () => {
    setFormData((prev) => ({
      ...prev,
      region: "",
    }));

    // 清除場地名稱和地圖連結
    setFormData((prev) => ({
      ...prev,
      place_name: "",
      location: "",
      regtion: "",
    }));

    // 清除建議列表
    setFilteredVenues([]);
    setShowSuggestions(false);
  };

  const handleStartTimeChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setStartTime(value.format("HH:mm"));
    } else {
      setStartTime(null);
    }
  };

  const handleEndTimeChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setEndTime(value.format("HH:mm"));
    } else {
      setEndTime(null);
    }
  };

  const createNewData = () => {
    let isOK = true;

    // 時間驗證
    if (!date) {
      setErrorOfDate(true);
      isOK = false;
    }

    if (!startTime || !endTime) {
      setErrorOfTime(true);
      isOK = false;
    }

    if (startTime && endTime) {
      // 如果結束時間是 00:00，視為隔天凌晨，不進行時間比較
      if (endTime !== "00:00" && startTime >= endTime) {
        setErrorOfTime(true);
        isOK = false;
      }
    }

    // 數字輸入驗證
    if ( formData.amount_of_court <= 0 ) {
      setErrorOfCourt(true);
      isOK = false;
    }

    if ( formData.limit_of_member <= 0 ) {
      setErrorOfLimit(true);
      isOK = false;
    }

    if ( formData.price <= 0 ) {
      setErrorOfPrice(true);
      isOK = false;
    }

    // check categories
    if ( formData.categories.length === 0 ) {
      setErrorOfCategories(true);
      isOK = false;
    }

    if (!isOK) return;

    addNewSession(
      {
        place_name: formData.place_name,
        location: formData.location,
        region: formData.region,
        date: date || "",
        start_time: startTime || "",
        end_time: endTime || "",
        limit_of_member: Number(formData.limit_of_member),
        amount_of_court: Number(formData.amount_of_court),
        price: Number(formData.price),
        description: formData.description,
        is_public: formData.is_public,
        categories: formData.categories, // 添加場次分類資料
      },
      false
    );
    setShow(true);
  };

  const getDefaultData = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(
        `${apiPrefix}/createSession/getDefaultSetting`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      setFormData((prev) => ({
        ...prev,
        place_name: data["default_place_name"],
        location: data["default_location"],
        region: data["default_region"],
        price: data["default_price"],
      }));
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading2(false));
  };

  useEffect(() => {
    getDefaultData();
    fetchVenues(); // 獲取場地資料
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <div className="mb-3">
          <p className={styles.title}>
            <SlLocationPin
              style={{
                marginRight: "5px",
              }}
            />
            地點資訊
          </p>

          {/* 新增區域篩選 */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className={`form-label ${styles.smLabel}`}>
                區域 (選填)
              </label>
              <button
                type="button"
                onClick={resetRegion} // 使用新的重置函數
                className={`btn btn-link p-0 ${
                  !formData.region ? "d-none" : ""
                }`}
                style={{ fontSize: "14px", textDecoration: "none" }}
              >
                重置
              </button>
            </div>
            <div className="position-relative">
              <div
                onClick={() => setShowRegionFilter(!showRegionFilter)}
                className="form-control d-flex justify-content-between align-items-center cursor-pointer"
                style={{ cursor: "pointer" }}
              >
                <span className={formData.region ? "" : "text-muted"}>
                  {formData.region || "選擇區域"}
                </span>
                <IoFilterOutline />
              </div>

              {/* 區域選擇下拉清單 */}
              {showRegionFilter && (
                <ul
                  className="position-absolute w-100 mt-1 list-group shadow-sm"
                  style={{
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                  onTouchMove={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {regions.map((region) => (
                    <li
                      key={region}
                      onClick={() => selectRegion(region)}
                      className={`list-group-item ${
                        formData.region === region ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      {region}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            場地名稱
          </label>
          <div className="position-relative">
            <input
              name="place_name"
              id="place_name"
              type="text"
              className="form-control mb-1"
              value={formData.place_name}
              onChange={handleInputChange}
              required
            />

            {/* 自動完成建議清單 */}
            {showSuggestions && filteredVenues.length > 0 && (
              <ul
                className="position-absolute w-100 list-group shadow-sm"
                style={{
                  zIndex: 1000,
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
                onTouchMove={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
              >
                {filteredVenues.map((venue) => (
                  <li
                    key={venue.address}
                    onClick={() => selectVenue(venue)}
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                  >
                    <div>{venue.place_name}</div>
                    <small className="text-muted">{venue.address}</small>
                  </li>
                ))}
              </ul>
            )}

            {/* 無結果提示 */}
            {showSuggestions &&
              filteredVenues.length === 0 &&
              formData.place_name && (
                <div className="position-absolute w-100 p-2 text-center bg-light border rounded">
                  <small className="text-muted">找不到符合的場地</small>
                  {formData.region && (
                    <div>
                      <small className="text-muted">
                        已篩選區域: {formData.region}
                      </small>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="place_name"
            className={`form-label ${styles.smLabel}`}
          >
            地圖連結
          </label>
          <input
            name="location"
            id="location"
            type="text"
            className="form-control mb-1"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="is_public" className={`form-label ${styles.smLabel}`}>
            場次狀態
          </label>
          <select
            name="is_public"
            id="is_public"
            className="form-control mb-1"
            value={formData.is_public ? "public" : "private"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_public: e.target.value === "public",
              }))
            }
            required
          >
            <option value="public">公開</option>
            <option value="private">私有</option>
          </select>
        </div>
      </div>

      {/* 其餘部分保持不變 */}
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <FaRegClock style={{ marginRight: "5px" }} />
          時間設定
        </p>
        <label className={`form-label ${styles.smLabel}`}>日期</label>

        <div className={styles.calendar}>
          <input
            type="date"
            className="form-control mb-1"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
          {errorOfDate && (
            <Alert variant="danger" className={styles.alert}>
              請設定正常日期
            </Alert>
          )}
        </div>

        <label className={`form-label ${styles.smLabel}`}>時間</label>

        <div className={styles.time}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-tw"
          >
            <div className={styles.timeGroup}>
              <TimePicker
                label="開始時間"
                value={startTime ? dayjs(`2023-01-01T${startTime}`) : null}
                onChange={handleStartTimeChange}
                minutesStep={10}
                slotProps={{
                  textField: {
                    className: "form-control mb-1",
                    size: "small",
                  },
                }}
                format="HH:mm"
              />
            </div>
            <h1>~</h1>
            <div className={styles.timeGroup}>
              <TimePicker
                label="結束時間"
                value={endTime ? dayjs(`2023-01-01T${endTime}`) : null}
                onChange={handleEndTimeChange}
                minutesStep={10}
                slotProps={{
                  textField: {
                    className: "form-control mb-1",
                    size: "small",
                  },
                }}
                format="HH:mm"
              />
            </div>
          </LocalizationProvider>
        </div>
        {errorOfTime && (
          <Alert variant="danger" className={styles.alert}>
            請設定正常時間
          </Alert>
        )}
      </div>
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <GoPeople
            style={{
              marginRight: "5px",
            }}
          />
          人數與價格
        </p>

        <label
          htmlFor="amount_of_court"
          className={`form-label ${styles.smLabel}`}
        >
          場地數量
        </label>
        <input
          name="amount_of_court"
          id="amount_of_court"
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.amount_of_court}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              amount_of_court: Number.parseInt(event.target.value),
            }))
          }
          required
        />
        {errorOfCourt && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確場數
          </Alert>
        )}

        <label
          htmlFor="limit_of_member"
          className={`form-label ${styles.smLabel}`}
        >
          人數上限
        </label>
        <input
          name="limit_of_member"
          id="limit_of_member"
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.limit_of_member}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              limit_of_member: Number.parseInt(event.target.value),
            }))
          }
          required
        />
        {errorOfLimit && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確人數上限
          </Alert>
        )}

        <label htmlFor="price" className={`form-label ${styles.smLabel}`}>
          費用設定
        </label>
        <input
          name="price"
          id="price"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="form-control mb-1"
          value={formData.price}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              price: Number.parseInt(event.target.value),
            }))
          }
          required
        />
        {errorOfPrice && (
          <Alert variant="danger" className={styles.alert}>
            請設定正確價格
          </Alert>
        )}
      </div>

      {/* 新增場次分類區塊 */}
      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <BsListTask
            style={{
              marginRight: "5px",
            }}
          />
          場次分類
        </p>
        <p className={styles.categoryDescription}>選擇適合此場次的分類（可複選）</p>
        
        <div className={styles.categoryGrid}>
          {sessionCategories.map(category => (
            <button
              key={category.name}
              type="button"
              className={`${styles.categoryItem} ${formData.categories.includes(category.name) ? styles.categorySelected : ''}`}
              onClick={() => toggleCategory(category.name)}
              style={{
                '--category-color': category.color,
                '--category-bg-color': `${category.color}15`,
                '--category-icon-bg': `${category.color}25`,
              } as React.CSSProperties}
            >
              <div className={styles.iconContainer}>
                <div className={styles.categoryIcon}></div>
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>
        {errorOfCategories && (
          <Alert variant="danger" className={styles.alert}>
            請設定至少一個分類
          </Alert>
        )}
        
        <div className={styles.helpText}>
          <p className={styles.helpTitle}>分類說明：</p>
          {sessionCategories.map(category => (
            <p key={category.name} className={styles.helpItem}>
              <span style={{ color: category.color }}>• {category.name}</span> - {category.description}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <p className={styles.title}>
          <IoAlertCircleOutline
            style={{
              marginRight: "5px",
            }}
          />
          備註資訊
        </p>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className={styles.smLabel}>球種、場地號碼...</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            max={1000}
          />
        </Form.Group>
      </div>
      <button className={styles.publish} onClick={createNewData}>
        預覽
      </button>
      <button className={styles.publish2} onClick={createNewData}>
        預覽
      </button>
    </form>
  );
};

export default Single;