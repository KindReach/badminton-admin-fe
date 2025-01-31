// DateRangeFilter.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import styles from "./DateRangeFilter.module.css";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };

  return (
    <div className={styles.container}>
      <h3>日期範圍</h3>
      <div className={styles.calendarContainer}>
        <div className={styles.calendar}>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="yyyy/月/dd"
            className={styles.picker}
          />
          <Calendar size={20} />
        </div>

        <span>至</span>

        <div className={styles.calendar}>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            // minDate={startDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="yyyy/月/dd"
            className={styles.picker}
          />
          <Calendar className="" size={20} />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
