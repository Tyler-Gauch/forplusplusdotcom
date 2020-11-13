import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import "../../css/components/Markdown.scss";
import renderers from "./MarkdownRenderers";

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