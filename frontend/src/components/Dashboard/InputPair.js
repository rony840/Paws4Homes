const InputPair = ({ label, id, placeholder, inputType, options, isTextArea, value, onChange }) => {
    return (
      <div className="input-pair">
        <label htmlFor={id}>{label}</label>
        {isTextArea ? (
          <textarea id={id} placeholder={placeholder} value={value} onChange={onChange}></textarea>
        ) : inputType === "dropdown" ? (
          <select id={id} value={value} onChange={onChange}>
            {options.map((option, index) => (
              <option key={index} value={option.value}disabled={option.disabled} 
              selected={option.selected}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input type="text" id={id} placeholder={placeholder} value={value} onChange={onChange} />
        )}
      </div>
    );
  };
  
  export default InputPair;
  