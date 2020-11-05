import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            Sorry, we couldn't find that page! Try checking out our <Link to="/courses">courses</Link>. If you believe this is a mistake please <Link to="/contacts">contact us!</Link>
        </div>
    );
};

export default NotFound;