import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import styles from "./Location.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoading2 } from "@/state/loading/loading";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";
import { IoFilterOutline } from "react-icons/io5"; // 新增篩選圖標
import { ModalLevel, setModalShow, setModalState } from "@/state/modal/modal";

// 定義場地數據類型
interface Venue {
  place_name: string;
  address: string; // 行政區
  location: string; // 地圖連結
  region: string; // 區域（縣市）
}

const Location = () => {
  const [placeName, setPlaceName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errorOfName, setErrorOfName] = useState<boolean>(false);
  const [errorOfLocation, setErrorOfLocation] = useState<boolean>(false);
  const [errorOfRegion, setErrorOfRegion] = useState<boolean>(false);

  // 新增場地資料庫相關狀態
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const dispatch = useDispatch();

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
      console.error(err);
    }
    dispatch(setLoading2(false));
  };

  const getDefaultPlace = async () => {
    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setSelectedRegion(data["default_region"]);
      setPlaceName(data["default_place_name"]);
      setLocation(data["default_location"]);
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame(() => {
      // 確保在下一個畫面更新週期才關閉 loading
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  };

  useEffect(() => {
    getDefaultPlace();
    fetchVenues(); // 獲取場地資料
  }, []);

  useEffect(() => {
    if (errorOfName && placeName) setErrorOfName(false);
    if (errorOfLocation && location) setErrorOfLocation(false);
  }, [placeName, location]);

  // 處理場地名稱輸入
  const handlePlaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlaceName(value);

    let filtered = venues;

    // 如果選擇了區域，先按區域過濾
    if (selectedRegion) {
      filtered = filtered.filter((venue) => venue.region === selectedRegion);
    }

    // 再按名稱過濾
    filtered = filtered.filter((venue) =>
      venue.place_name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredVenues(filtered);
    setShowSuggestions(value.length > 0);
  };

  // 選擇場地
  const selectVenue = (venue: Venue) => {
    setPlaceName(venue.place_name);
    setLocation(venue.location);
    setShowSuggestions(false);
  };

  // 選擇區域 - 會清除場地信息
  const selectRegion = (region: string) => {
    setSelectedRegion(region);
    setShowRegionFilter(false);

    // 清除場地名稱和地圖連結
    setPlaceName("");
    setLocation("");

    // 清除建議列表
    setFilteredVenues([]);
    setShowSuggestions(false);
  };

  // 重置區域篩選 - 同樣清除場地信息
  const resetRegion = () => {
    setSelectedRegion("");

    // 清除場地名稱和地圖連結
    setPlaceName("");
    setLocation("");

    // 清除建議列表
    setFilteredVenues([]);
    setShowSuggestions(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let isOK = true;

    if (!selectedRegion) {
      setErrorOfRegion(true);
      isOK = false;
    }

    if (!placeName) {
      setErrorOfName(true);
      isOK = false;
    }

    if (!location) {
      setErrorOfLocation(true);
      isOK = false;
    }

    if (!isOK) return;

    dispatch(setLoading2(true));
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${apiPrefix}/setting/updateDefault`,
        {
          target: "default_location",
          value: [placeName, location, selectedRegion],
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      dispatch(setModalState({ message: data, title: "設定成功", level: ModalLevel.SUCCESS }));
      

    } catch (err) {
      console.error(err);
      dispatch(setModalState({ message: err as string, title: "設定失敗", level: ModalLevel.ERROR }));
    } finally {
      dispatch(setModalShow(true));
    }
    requestAnimationFrame(() => {
      // 確保在下一個畫面更新週期才關閉 loading
      requestAnimationFrame(() => {
        dispatch(setLoading2(false));
      });
    });
  };

  return (
    <>
      <HeaderSmall title="場地資訊設定" />
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          {/* 區域篩選 */}
          <div className={styles.inputGroup}>
            <div className="d-flex justify-content-between align-items-center">
              <label className={`form-label ${styles.smLabel}`}>
                區域 (選填)
              </label>
              <button
                type="button"
                onClick={resetRegion}
                className={`btn btn-link p-0 ${
                  !selectedRegion ? "d-none" : ""
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
                <span className={selectedRegion ? "" : "text-muted"}>
                  {selectedRegion || "選擇區域"}
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
                      onClick={() => {
                        selectRegion(region);
                        setErrorOfRegion(false);
                      }}
                      className={`list-group-item ${
                        selectedRegion === region ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      {region}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errorOfRegion && (
              <Alert variant="danger" className={styles.alert}>
                請正確填地區
              </Alert>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="place_name"
              className={`form-label ${styles.smLabel}`}
            >
              場館名稱
            </label>
            <div className="position-relative">
              <input
                id="place_name"
                type="text"
                className="form-control mb-1"
                value={placeName}
                onChange={handlePlaceNameChange}
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
              {showSuggestions && filteredVenues.length === 0 && placeName && (
                <div className="position-absolute w-100 p-2 text-center bg-light border rounded">
                  <small className="text-muted">找不到符合的場地</small>
                  {selectedRegion && (
                    <div>
                      <small className="text-muted">
                        已篩選區域: {selectedRegion}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
            {errorOfName && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫場館名稱
              </Alert>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="location"
              className={`form-label ${styles.smLabel}`}
            >
              地圖連結
            </label>
            <input
              id="location"
              type="text"
              className="form-control mb-1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errorOfLocation && (
              <Alert variant="danger" className={styles.alert}>
                請正確填寫地圖連結
              </Alert>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            確定更改
          </button>
        </form>
      </div>
    </>
  );
};

export default Location;
