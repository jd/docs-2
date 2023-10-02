const gatsbyRemarkPlugins = [
  '@fec/remark-a11y-emoji/gatsby',
  {
    resolve: 'gatsby-remark-copy-linked-files',
    options: {
      destinationDir: f => `${f.name}`
    }
  },
  {
    resolve: 'gatsby-remark-autolink-headers',
    options: {
      icon: false
    }
  },
  {
    resolve: `gatsby-remark-images`,
    options: {
      maxWidth: 1200,
    },
  },
  'gatsby-remark-graphviz',
];

const plugins = [
  'gatsby-plugin-svgr',
  '@chakra-ui/gatsby-plugin',
  'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      icon: 'src/assets/favicon.svg'
    }
  },
  {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `docs.mergify.com`,
      },
  },
  'gatsby-plugin-offline',
  {
    resolve: 'gatsby-plugin-webfonts',
    options: {
      fonts: {
        google: [
          {
            family: 'Source Sans Pro',
            variants: ['400', '600', '700']
          },
          {
            family: 'Source Code Pro',
            variants: ['400', '600']
          },
          {
            family: 'Poppins',
            variants: ['400', '600']
          }
        ]
      }
    }
  },
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      extensions: ['.mdx', '.md'],
      gatsbyRemarkPlugins,
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: gatsbyRemarkPlugins
    }
  },
  'gatsby-plugin-local-docs', // local plugin
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: '/',
      path: 'src/content'
    }
  },
  {
    resolve: `gatsby-plugin-netlify`,
    options: {
      headers: {
        "/*": [
          "Cache-control: public, max-age=600, no-transform",
          "Content-Security-Policy: default-src 'self' https:; " +
            "frame-ancestors 'none'; " +
            "script-src 'self' https: 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline' https:; " +
            "img-src 'self' data: https:; " +
            "manifest-src 'self' data:",
        ]
      },
      allPageHeaders: [],
      mergeSecurityHeaders: true,
      mergeCachingHeaders: true,
      transformHeaders: (headers, path) => headers,
      generateMatchPathRewrites: true,
    },
  }
];


const config = {
  pathPrefix: '/' + process.env.PR_NUMBER + '/docs',
  trailingSlash: 'ignore',
  siteMetadata: {
    siteUrl: 'https://docs.mergify.com'
  },
  plugins
};

export default config;
