import React from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const imageRenderer = ({src, alt}) => {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className="image"
            />
        );
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