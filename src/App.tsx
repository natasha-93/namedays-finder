import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return [year, month, day].join("-");
};

const isValidDateStr = (date: string) => !Number.isNaN(Date.parse(date));

function App() {
  const [countryOptions, setCountryOptions] = useState(["us"]);
  const [country, setCountry] = useState(countryOptions[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [namedays, setNamedays] = useState([]);

  useEffect(() => {
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    if (Number.isNaN(month) || Number.isNaN(day)) return;

    fetch(`https://api.abalin.net/namedays?month=${month}&day=${day}`)
      .then((response) => {
        return response.json();
      })
      .then(({ data }) => {
        setCountryOptions(Object.keys(data.namedays));
        setNamedays(data.namedays[country].split(", "));
      });
  }, [selectedDate, country]);

  return (
    <div>
      <h2>Name Days Finder</h2>
      <p className={styles.dayLabels}>
        Names for:
        {/* {["Yesterday", "Today", "Tomorrow"].map((day) => (
          <button
            className={clsx(styles.dayButton, {
              [styles.selected]: day.toLowerCase() === selectedDay,
            })}
            key={day}
            onClick={(e) => setSelectedDay(day.toLowerCase())}
          >
            {day}
          </button>
        ))} */}
        <input
          type="date"
          value={formatDate(selectedDate)}
          onChange={(e) => {
            if (isValidDateStr(e.target.value)) {
              setSelectedDate(new Date(e.target.value));
            }
          }}
        />
      </p>
      <ul>
        {namedays.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        {countryOptions.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
