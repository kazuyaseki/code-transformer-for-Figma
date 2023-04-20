import { RestEndpointMethodTypes } from '@octokit/rest';
import { Base64 } from 'js-base64';
import { octokit } from './githubClient';

const decodeFileContent = (
  componentName: string,
  data: RestEndpointMethodTypes['repos']['getContent']['response']['data']
) => {
  if ('type' in data && data.type === 'file') {
    return { componentName, content: Base64.decode(data.content) };
  }
  return null;
};

type getContentArgs = {
  owner: string;
  repo: string;
  path: string;
};

export const fetchComponentFileContent = async (
  componentDirectoryPaths: getContentArgs[]
) => {
  for (let i = 0; i < componentDirectoryPaths.length; i++) {
    const { owner, repo, path } = componentDirectoryPaths[i];
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return decodeFileContent(path, data);
    } catch (e) {
      console.log('Component not found for ' + path);
    }
  }

  return null;
};
