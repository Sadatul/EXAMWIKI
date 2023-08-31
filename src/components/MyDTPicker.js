import React from "react";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

export default function MyDTPicker({ metaData, setMetaData }) {
    const renderDay = (props, currentDate, selectedDate) => {
        // Adds 0 to the days in the days view
        return <td {...props}>{currentDate.date()}</td>;
    };

    const renderMonth = (props, month, year, selectedDate) => {
        // Display the month index in the months view
        return <td {...props}>{month}</td>;
    };

    const renderYear = (props, year, selectedDate) => {
        // Just display the last 2 digits of the year in the years view
        return <td {...props}>{year % 100}</td>;
    };

    return (
        <Datetime
            dateFormat="DD-MM-YYYY" timeFormat="hh:mm a"
            onChange={(e) => {
                let tmp = { ...metaData };
                tmp.datetime = e.toDate();
                setMetaData(tmp);
            }
            }
            renderDay={renderDay}
            renderMonth={renderMonth}
            renderYear={renderYear}
        />
    );
}