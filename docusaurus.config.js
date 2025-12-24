// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'High Time Workflow',
  tagline: 'Документация по процессам и экспериментам',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://amoeba164.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/high-time-workflow/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Amoeba164', // Usually your GitHub org/user name.
  projectName: 'high-time-workflow', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Amoeba164/high-time-workflow/tree/main/',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Текущая версия',
              path: '/',
            },
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'High Time Workflow',
        logo: {
          alt: 'High Time Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          {
            href: 'https://github.com/Amoeba164/high-time-workflow',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              {label: 'Введение', to: '/docs/intro'},
              {label: 'Уроки', to: '/docs/lessons/lesson-0'},
            ],
          },
          {
            title: 'Ресурсы',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Amoeba164/high-time-workflow',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} High Time Project. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
