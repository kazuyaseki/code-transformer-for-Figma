import { paginateRest } from '@octokit/plugin-paginate-rest';
import { Octokit } from '@octokit/rest';

const MyOctokit = Octokit.plugin(paginateRest);

export const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
});
