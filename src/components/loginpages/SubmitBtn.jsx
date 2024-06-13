import React from 'react'
import Loader from '../loader/Loader'

const SubmitBtn = ({
    typeValue = "submit",
    classValue,
    value,
    onclick,
    loading = false,
}) => {
    return (
        <div className="group">
            {loading && <Loader width='50' height='50' />}
            {
                <input
                    style={loading ? { cursor: 'not-allowed', opacity: "0.5" } : {}}
                    disabled={loading}
                    type={typeValue}
                    className={classValue}
                    value={value}
                    onClick={onclick} />
            }
        </div>
    )
}

export default SubmitBtn