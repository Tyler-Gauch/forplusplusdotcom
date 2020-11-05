import React from 'react';
import { Link } from 'react-router-dom';

const Unknown = () => {
    return (
        <div>
            Sorry an unknown error has occured please try again! If this continues please <Link to="/contacts">contact us!</Link>
        </div>
    );
};

export default Unknown;