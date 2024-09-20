import React from 'react';  
import { h, JSX } from 'preact';

interface MockHtmlResProps {  
    htmlString: string;  
    cssString: string;
} 

const MockHtmlRes: React.FC<MockHtmlResProps> = ({ htmlString, cssString }) => {  
    const htmlWithCss = `<style>${cssString}</style>${htmlString}`;
    return (  
      <div dangerouslySetInnerHTML={{ __html: htmlWithCss }}></div>
    );  
  };    
    
export default MockHtmlRes;  