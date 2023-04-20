import { octokit } from './githubClient';

async function getAllRepoDirectories(
  owner: string,
  repo: string,
  branch: string,
  directory: string
): Promise<string[]> {
  const fileList: string[] = [];

  try {
    const response = (await octokit.paginate(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        owner: owner,
        repo: repo,
        tree_sha: branch,
        recursive: 1,
      }
    )) as { tree: { path: string; type: 'blob' | 'tree' }[] }[];

    response.forEach((chunk) => {
      chunk.tree.forEach((file) => {
        if (file.type === 'tree' && file.path.startsWith(directory)) {
          fileList.push(file.path);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }

  return fileList;
}

export const fetchDirectoryNames = async (owner: string, repo: string) => {
  const files = await getAllRepoDirectories(
    owner,
    repo,
    'main',
    'projects/app/src'
  );

  return files;
};
