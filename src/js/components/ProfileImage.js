import React from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-bootstrap';
import "../../css/components/ProfileImage.css";

export const ProfileImage = ({src, alt}) => {

    return (
        <Image src={src} alt={alt} roundedCircle fluid className="ProfileImage-user"/>
    );

}

ProfileImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};