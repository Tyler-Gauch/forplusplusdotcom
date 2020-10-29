import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const renderers = {
    code: ({language, value}) => {
        if (value) {
            return <SyntaxHighlighter style={dark} language={language} children={value}/>
        }

        return null;
    }
};

const Markdown = ({children}) => {
    return (
        <ReactMarkdown
            renderers={renderers}
        >{children}</ReactMarkdown>
    );
};

export default Markdown;