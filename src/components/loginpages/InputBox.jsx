import React from 'react'

const InputBox = ({
    name,
    labelName,
    labelClass = "",
    forValue = "",
    typeValue,
    inputClass,
    onchange,
    value,

}) => {

    // console.log("value: ", value)

    return (
        <div className="group">
            <label
                htmlFor={forValue}
                className={labelClass} >
                {labelName}</label>
            <input
                name={name}
                id={forValue}
                type={typeValue}
                className={inputClass}
                value={value[name] ? value[name] : ""}
                onChange={onchange} />
        </div>
    )
}

export default InputBox