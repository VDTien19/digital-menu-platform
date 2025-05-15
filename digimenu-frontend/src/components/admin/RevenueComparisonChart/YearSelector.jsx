import React from 'react';

const YearSelector = ({ allYears, visibleYears, onChange }) => {
    const toggleYear = (year) => {
        if (visibleYears.includes(year)) {
            onChange(visibleYears.filter((y) => y !== year));
        } else {
            onChange([...visibleYears, year]);
        }
    };

    return (
        <div className="flex gap-3 flex-wrap">
            {allYears.map((year) => (
                <label key={year} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={visibleYears.includes(year)}
                        onChange={() => toggleYear(year)}
                    />
                    <span>{year}</span>
                </label>
            ))}
        </div>
    );
};

export default YearSelector;
