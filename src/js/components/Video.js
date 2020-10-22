import React from 'react';
import PropTypes from 'prop-types';
import '../../css/components/Video.scss'

const Video = (props) => (
    <div className="Video-container">
        <iframe
            {...props}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        />
    </div>
);

Video.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    src: PropTypes.string
};

Video.defaultProps = {
    width: "560",
    height: "315"
};

export default Video;