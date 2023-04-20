import { useEffect, useState } from 'preact/hooks';
import { fetchDirectoryNames } from '../github/fetchDirectoryNames';

export const useRepositoryDirectoryNames = () => {
  const [directoryNames, setDirectoryNames] = useState<string[]>([]);

  useEffect(() => {
    fetchDirectoryNames(
      process.env.REPOSITORY_OWNER || '',
      process.env.REPOSITORY_NAME || ''
    ).then((_directoryNames) => {
      setDirectoryNames(_directoryNames);
    });
  }, []);

  return { directoryNames };
};
