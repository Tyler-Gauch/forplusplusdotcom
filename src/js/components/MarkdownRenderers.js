import React from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ExpandableImage from './ExpandableImage';
import {Storage} from 'aws-amplify';

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

        console.log(src);

        switch (type) {
            case "button":
                return (
                    <img
                         src={src}
                         alt={altText}
                         className={`image button`}
                    />
                );
            case "s3":
                return (
                    <ExpandableImage src={Storage.get(src, {level: "public"})} />
                );
            default:
                return (
                    <ExpandableImage src={new Promise((resolve) => resolve(src))} />
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