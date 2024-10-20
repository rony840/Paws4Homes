import React from 'react';

const CustomDropdown = ({ label, options, onChange }) => {
  return (
    <div className="dropdown-container">
      <div className="dropdown-label">{label}</div>
      <div className="dropdown">
        <select className="dropdown-select" onChange={onChange}>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M14.3136 2L8.15679 8.1568L2 2" stroke="black" stroke-width="2.77056" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;
