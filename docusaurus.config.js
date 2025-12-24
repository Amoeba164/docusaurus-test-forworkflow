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

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Amoeba164/high-time-workflow/tree/main/',
          // Версионирование
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
        blog: false, // Отключаем блог, он вам не нужен
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
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
              {
                label: 'Введение',
                to: '/docs/intro',
              },
              {
                label: 'Уроки',
                to: '/docs/lessons/lesson-0',
              },
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
      // Поиск по документации
      algolia: {
        // Если настроите Algolia DocSearch, раскомментируйте и добавьте ключи
        // appId: 'YOUR_APP_ID',
        // apiKey: 'YOUR_SEARCH_API_KEY',
        // indexName: 'YOUR_INDEX_NAME',
      },
    }),
};

export default config;
