import { octokit } from './githubClient';

type ContentFile = {
  path: string;
  content: string;
};

const baseBranch = 'main';

async function createBranch(owner: string, repo: string, branch: string) {
  // // get sha of main branch
  const { data: baseBranchRef } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  try {
    return await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseBranchRef.object.sha,
    });
  } catch (e) {
    console.log(e);
    console.log(JSON.stringify(e));
  }
}

async function pushFilesToBranch(
  owner: string,
  repo: string,
  branch: string,
  files: ContentFile[],
  newBranchRefSha: string,
  commitMessage: string
) {
  const currentCommit = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: newBranchRefSha,
  });

  const newTree = await octokit.git.createTree({
    owner,
    repo,
    base_tree: currentCommit.data.tree.sha,
    tree: files.map((file) => ({
      path: file.path,
      mode: '100644',
      content: file.content,
    })),
  });

  const newCommit = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: newTree.data.sha,
    parents: [currentCommit.data.sha],
  });

  return await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.data.sha,
  });
}

async function createPR(
  owner: string,
  repo: string,
  branch: string,
  title: string
) {
  return await octokit.pulls.create({
    owner,
    repo,
    title,
    head: branch,
    base: 'main',
  });
}

export async function createBranchAndPRWithMultipleFiles(
  owner: string,
  repo: string,
  branch: string,
  prTitle: string,
  commitMessage: string,
  files: ContentFile[]
) {
  const currentBranch = await createBranch(owner, repo, branch);

  if (!currentBranch) return;

  await pushFilesToBranch(
    owner,
    repo,
    branch,
    files,
    currentBranch?.data.object.sha,
    commitMessage
  );

  const result = await createPR(owner, repo, branch, prTitle);

  return result;
}

export const openPRInBrowser = (prUrl: string) => {
  window.open(prUrl, '_blank');
};
