import React from 'react';
import loadergif from './loader.gif';

const Loader = ({
    className = "",
    width = "50",
    height = "50"
}) => {
    return (
        <img
            className={className}
            width={width}
            height={height}
            src={loadergif}
            alt='loading...' />

        // <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    )
}

export default Loader