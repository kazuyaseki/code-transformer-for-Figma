import { getChunkReplaceMarker } from '../utils/integrateChunkCodes';

export const buildPromptForGeneratingCode = (
  node: string,
  propsSummaries: string[],
  previousCode?: string
) => {
  const nodeStr = node.replaceAll('\\', '');
  return `You are a frontent engineer. Convert this Figma JSON object into Web Component, TypeScript code, only output css and html template as 2 parts

Output use json format, use "html" and "css" as key

## Figma JSON
${nodeStr}

${
  propsSummaries.length > 0
    ? `## Props summaries
${propsSummaries.map((summary) => `### ${summary}`).join('\n\n')}`
    : ''
}
${
  previousCode
    ? `## Previous code
${previousCode}
`
    : ''
}

## constraints
- Do not write anything besides code
- Do not add <style> in html output
- Do not add javascript code in html output

## html constraints
- try to avoid write styles in template
- component does not take any props
- make sure the HTML output matches the Figma JSON structure

## css constraints
- Avoid use same classname for different component
- Do not change or drop any CSS style values that exist in the JSON.
- If element exist isImg set true, set the element to img with width and height from figma json, don't set src or alt for this img element
- If CSS has a padding value, set the box-sizing to border-box.
- if css contains top, left, right, bottom props, set position to absolute
- if css contains top, left, right, bottom props, set parrent css position to relative
- set outermost layer postion to relative`;
};

export const buildPromptForGeneratingCodeForChunk = (
  node: string,
  propsSummaries: string[],
  previousCode?: string
) => {
  const nodeStr = node.replaceAll('\\', '');
  return `Convert this Figma JSON object into React, TypeScript, Tailwind code.

## Figma JSON
${nodeStr}

${
  propsSummaries.length > 0
    ? `## Props summaries
${propsSummaries.map((summary) => `### ${summary}`).join('\n\n')}`
    : ''
}
${
  previousCode
    ? `## Previous code
${previousCode}
`
    : ''
}

## constraints
- do not omit any details in JSX
- if string value other than hex or rgb() format is specified for color property, it is design token vairable. it is defined with the name in kebab-case in tailwind.config.js
- if "typography" property is specified, it is defined in tailwind config as typography token that has multiple properties such as font-family, font-size, font-weight, line-height
- if a layer contains more than 1 same name child layers, define it with ul tag and create array of appropriate dummy data within React component and use map method to render in JSX
- use export rather than default export
- if Props summaries are provided for the components used in JSON, write props that are required in code props and omit props that only exist in Figma JSON
- if there are components without Props summaries, just write as <ComponentName /> with properties in Figma variant
${previousCode ? '- do not change previous code' : ''}
- Write only JSX
for instance if the result code is like below:
\`\`\`
import { Hoge } from "hoge";

export const ExampleComponent = () => {
    return <div>....</div>
}
\`\`\`

Then output only

\`\`\`
<div>....</div>
\`\`\``;
};

export const buildPromptForStorybook = (
  codeString: string,
  componentName: string
) => {
  return `Write storybook for the following component in Component Story Format (CSF).

\`\`\`tsx
${codeString}
\`\`\`

## constraints
- Do not write anything besides storybook code
- import component from the same directory
- do not have to write stories for componnents used in ${componentName}
`;
};

export const buildPromptForSuggestingBranchNameCommitMessagePrTitle = (
  codeString: string
) => {
  return `Suggest

- branch name
- commit message
- PR title
- component name

for the following code

\`\`\`tsx
${codeString}
\`\`\`

## constraints
out put as JSON in following property names, do not include new line since this string is going to be parsed with JSON.parse

{ "branchName": "branch name", "commitMessage": "commit message", "prTitle": "PR title", "componentName": "component name" }
`;
};

export const buildPromptForPropsSummary = (
  componentName: string,
  codeString: string
) => {
  return `Write Summaries of Props of ${componentName} component in the following code

## Code

\`\`\`tsx
${codeString}
\`\`\`

## constraints
- start with a sentence "{ComponentName} component:"
- write list of props with TS type
`;
};

export const buildPromptForComparingCode = (
  node: string,
  html: string,
  css: string
) => {
  const nodeStr = node.replaceAll('\\', '');
  return `Validate if HTML and CSS is align with FIGMA JSON.
## HTML
${html}
## CSS
${css}
## Figma JSON
${nodeStr}

## constraints
- validate width, height, color, size as basic styles
- validate relative position, including left, top distance to root class except root class.
- show result for each class, list properties match figma but no need to show value, list properties mismatch figma and the mismatch values`;
};