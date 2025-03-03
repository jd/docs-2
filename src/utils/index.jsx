import { useColorModeValue } from '@chakra-ui/react';
import { withPrefix } from 'gatsby';
import { join, relative } from 'path-browserify';
import { createContext } from 'react';

export const NavContext = createContext();
export const PathContext = createContext();

export const isUrl = (string) => /^https?:\/\//.test(string);

export const isPathActive = (path, uri) => !relative(
  // we need to prepend the path prefix to make this work properly in prod
  withPrefix(path),
  uri,
);
export const getFullPath = (path, basePath) => join('/', basePath, path);

export const flattenNavItems = (items) => items
  ?.flatMap((item) => (item.children ? [item, ...flattenNavItems(item.children)] : item)) ?? [];

export function useTagColors() {
  const bg = useColorModeValue('blue.100', 'blue.600');
  const textColor = useColorModeValue('blue.800', 'inherit');
  return [bg, textColor];
}
