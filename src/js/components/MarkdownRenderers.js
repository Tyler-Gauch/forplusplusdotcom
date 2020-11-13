import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ExpandableImage from './ExpandableImage';

/**
 * alt format:
 * [This is alt text]
 * [:small This is alt text]
 * [:small,other This is alt text]
 */
const parseAltText = (alt) => {
    const result = {altText: alt, type: "expandable"};
    
    if (alt.startsWith(":")) {
        const [type, altText] = alt.split(/ (.+)/);
        result.altText = altText;
        result.type = type.substring(1);
    }

    return result;
}

const imageRenderer = ({src, alt}) => {
    if (src) {
        const {altText, type} = parseAltText(alt);

        switch (type) {
            case "button":
                return (
                    <img
                         src={src}
                         alt={altText}
                         className={`image button`}
                    />
                );
            default:
                return (
                    <ExpandableImage src={src} />
                );
        }

        
    }

    return null;
};

const codeRenderer = ({language, value}) => {
    if (value) {
        return <SyntaxHighlighter style={dark} language={language} children={value}/>
    }

    return null;
};

export default {
    code: codeRenderer,
    image: imageRenderer
};