import React, { useState, useEffect } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import styles from "./DateRangeFilter.module.css";
import { Alert } from "react-bootstrap";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeFilter = ({ onDateChange }: DateRangeFilterProps) => {
  const today = dayjs().startOf('day'); // 設定為當天 00:00:00
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(today);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(today);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化時觸發一次 onDateChange
    onDateChange(today.toDate(), today.toDate());
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate.isAfter(endDate)) {
        setError("結束日期不能早於開始日期");
        onDateChange(null, null);
      } else {
        setError(null);
        onDateChange(
          startDate.toDate(),  // 將 dayjs 轉換為 Date 物件
          endDate.toDate()
        );
      }
    }
  }, [startDate, endDate]);

  return (
    <div className={styles.container}>
      <h3>日期範圍</h3>
      <div className={styles.dateRangeContainer}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <div className={styles.dateInput}>
            <DatePicker
              label="開始日期"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              // minDate={dayjs()}
              slotProps={{
                textField: {
                  size: "small",
                  className: "form-control"
                }
              }}
            />
          </div>
          <div className={styles.separator}>~</div>
          <div className={styles.dateInput}>
            <DatePicker
              label="結束日期"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate || dayjs()}
              slotProps={{
                textField: {
                  size: "small",
                  className: "form-control"
                }
              }}
            />
          </div>
        </LocalizationProvider>
      </div>
      {error && (
        <Alert variant="danger" className={styles.error}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default DateRangeFilter;
