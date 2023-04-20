import { getChunkReplaceMarker } from '../utils/integrateChunkCodes';

export const buildPromptForGeneratingCode = (
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
- component does not take any props
- do not omit any details in JSX
- Do not write anything besides code
- import components from @/components directory
- if string value other than hex or rgb() format is specified for color property, it is design token vairable. it is defined with the name in kebab-case in tailwind.config.js
- if "typography" property is specified, it is defined in tailwind config as typography token that has multiple properties such as font-family, font-size, font-weight, line-height
- if a layer contains more than 1 same name child layers, define it with ul tag and create array of appropriate dummy data within React component and use map method to render in JSX
- use export rather than default export
- if Props summaries are provided for the components used in JSON, write props that are required in code props and omit props that only exist in Figma JSON
- if child is chunk, render it as ${getChunkReplaceMarker(
    'nodeId of chunk'
  )}, it will later be used to replace with another code
- if there are components without Props summaries, just write as <ComponentName /> with properties in Figma variant
${previousCode ? '- do not change previous code' : ''}`;
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
