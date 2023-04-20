// create a function that returns a string with the command to checkout a PR
// the command should be in the format of `git checkout -b <branch> origin/<branch>`
export const getCheckoutCommandForPR = (branch: string) => {
  return `git checkout -b ${branch} origin/${branch}`;
};
