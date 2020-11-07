import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import gfm from 'remark-gfm';

const renderers = {
    code: ({language, value}) => {
        if (value) {
            return <SyntaxHighlighter style={dark} language={language} children={value}/>
        }

        return null;
    }
};

const plugins = [
    gfm
];

const Markdown = ({children}) => {
    return (
        <ReactMarkdown
            plugins={plugins}
            renderers={renderers}
        >{children}</ReactMarkdown>
    );
};

export default Markdown;