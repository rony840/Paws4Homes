const DisplayPair = ({ label, value, isLongText, customValueClass }) => {
  const valueClass = customValueClass ? customValueClass : (isLongText ? 'display-long-text' : 'display-value');

  return (
    <div className="input-pair">
      <label>{label}</label>
      <div className={valueClass}>
        {value}
      </div>
    </div>
  );
};


  
  export default DisplayPair;
  