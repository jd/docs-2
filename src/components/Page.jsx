import {
  Box,
  Button,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  chakra,
} from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import { dirname, join } from 'path-browserify';
import PropTypes from 'prop-types';
import React, {
  Fragment, createElement, useMemo,
} from 'react';

import { FaComment, FaGithub } from 'react-icons/fa';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import { rehype } from 'rehype';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeReact from 'rehype-react';

import {
  MarkdownCodeBlock,
} from '../chakra-helpers/CodeBlock';

import {
  MultiCodeBlock,
  MultiCodeBlockContext,
} from '../chakra-helpers/MultiCodeBlock';

import { PathContext } from '../utils';

import Blockquote from './Blockquote';
import CodeColumns from './CodeColumns';
import ExpansionPanel, {
  ExpansionPanelList,
  ExpansionPanelListItem,
} from './ExpansionPanel';

import { TOTAL_HEADER_HEIGHT } from './Header';
import InlineCode from './InlineCode';
import PageLayout, { usePageLayoutProps } from './PageLayout';
import RelativeLink, { ButtonLink } from './RelativeLink';

import TableOfContents from './TableOfContents';

// these must be imported after MarkdownCodeBlock
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup-templating'; // needed by django
import 'prismjs/components/prism-django'; // alias to jinja2
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

const LIST_SPACING = 4;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const NESTED_LIST_STYLES = {
  [['ul', 'ol']]: {
    mt: 3,
    fontSize: 'md',
    lineHeight: 'normal',
  },
};

const components = {
  h1: (props) => <Heading as="h1" size="2xl" {...props} />,
  h2: (props) => <Heading as="h2" size="xl" {...props} />,
  h3: (props) => <Heading as="h3" size="lg" {...props} />,
  h4: (props) => <Heading as="h4" size="md" {...props} />,
  h5: (props) => <Heading as="h5" size="sm" {...props} />,
  h6: (props) => <Heading as="h6" size="xs" {...props} />,
  ul: (props) => (
    <UnorderedList
      spacing={LIST_SPACING}
      sx={{
        ...NESTED_LIST_STYLES,
        ul: {
          listStyleType: 'circle',
        },
      }}
      {...props}
    />
  ),
  ol: (props) => (
    <OrderedList spacing={LIST_SPACING} sx={NESTED_LIST_STYLES} {...props} />
  ),
  li: (props) => (
    <ListItem
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 3,
          },
        },
      }}
      {...props}
    />
  ),
  p: Text,
  a: RelativeLink,
  pre: MarkdownCodeBlock,
  table: (props) => (
    <Box
      rounded="md"
      borderWidth={1}
      overflow="auto"
      sx={{ table: { borderWidth: 0 } }}
    >
      <Table {...props} />
    </Box>
  ),
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: (props) => (
    <Td
      sx={{
        fontSize: 'md',
      }}
      {...props}
    />
  ),
  blockquote: Blockquote,
  undefined: Fragment, // because remark-a11y-emoji adds <undefined> around stuff
};

export const mdxComponents = {
  ...components,
  inlineCode: InlineCode,
  code: InlineCode,
  Button, // TODO: consider making pages import this from @chakra-ui/react
  ExpansionPanel,
  ExpansionPanelList,
  ExpansionPanelListItem,
  MultiCodeBlock,
  CodeColumns,
  ButtonLink,
};

const { processSync } = rehype()
  .data('settings', { fragment: true })
  .use(autolinkHeadings, { behavior: 'wrap' })
  .use(rehypeReact, {
    createElement,
    Fragment,
    components: {
      ...components,
      code: InlineCode,
    },
  });

export default function Page({
  file, pageContext, uri, children,
}) {
  const [language, setLanguage] = useLocalStorage('language');

  const {
    name,
    childMdx,
    childMarkdownRemark,
    basePath,
    relativePath,
  } = file;

  const { frontmatter, headings } = childMdx || childMarkdownRemark;
  const { title, description, toc } = frontmatter;

  const pageProps = usePageLayoutProps({
    pageContext,
    title,
    description,
  });

  const scrollMarginTop = useMemo(
    () => `calc(${pageProps.paddingTop} + ${TOTAL_HEADER_HEIGHT}px)`,
    [pageProps.paddingTop],
  );

  const editOnGitHub = useMemo(() => {
    const repo = 'https://github.com/mergifyio/docs';

    const repoPath = ['tree', 'main', 'src', 'content'];

    repoPath.push(relativePath);

    return (
      <Button
        as="a"
        href={`${repo}/${join(...repoPath)}`}
        variant="link"
        size="lg"
        leftIcon={<FaGithub />}
      >
        Edit on GitHub
      </Button>
    );
  }, [relativePath]);

  const pathContext = useMemo(() => ({
    uri,
    basePath,
    path: name === 'index' ? uri : dirname(uri),
  }), [basePath, name, uri]);
  const multiCodeBlockContext = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <PathContext.Provider
      value={pathContext}
    >
      <PageLayout
        {...pageProps}
        description={description}
        subtitle={description && (
          <chakra.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            lineHeight="normal"
            mt={{ base: 2, md: 3 }}
            fontWeight="normal"
          >
            {description}
          </chakra.h2>
        )}
        aside={
            toc !== false ? (
              // hide the table of contents on the home page
              <chakra.aside
                display={{ base: 'none', xl: 'flex' }}
                flexDirection="column"
                ml={{ base: 10, xl: 16 }}
                w={250}
                flexShrink="0"
                pos="sticky"
                top={scrollMarginTop}
                maxH={`calc(100vh - ${scrollMarginTop} - ${pageProps.paddingBottom})`}
              >
                <Heading size="md" mb="3">
                  {title}
                </Heading>
                <TableOfContents headings={headings} />
                <Stack align="flex-start" spacing="3" mt="8">
                  {editOnGitHub}
                  <Button
                    as="a"
                    href="https://github.com/Mergifyio/mergify/discussions"
                    variant="link"
                    size="lg"
                    leftIcon={<FaComment />}
                  >
                    Discuss in forums
                  </Button>
                </Stack>
              </chakra.aside>
            ) : null
          }
        contentProps={{
          css: {
            [HEADINGS]: {
              scrollMarginTop,
            },
          },
          sx: {
            [HEADINGS]: {
              a: {
                color: 'inherit',
              },
              code: {
                bg: 'none',
                p: 0,
                color: 'secondary',
                whiteSpace: 'normal',
              },
            },
            '>': {
              ':not(:last-child)': {
                mb: 6,
              },
              ':not(style) +': {
                [HEADINGS]: {
                  mt: 10,
                  mb: 4,
                },
              },
            },
          },
        }}
      >
        <MultiCodeBlockContext.Provider value={multiCodeBlockContext}>
          {childMdx ? (
            <MDXProvider components={mdxComponents}>
              {children}
            </MDXProvider>
          ) : (
            processSync(childMarkdownRemark.html).result
          )}
        </MultiCodeBlockContext.Provider>
        <Box display={{ lg: 'none' }}>{editOnGitHub}</Box>
      </PageLayout>
    </PathContext.Provider>
  );
}

Page.propTypes = {
  file: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};
