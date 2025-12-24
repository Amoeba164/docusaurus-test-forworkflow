// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'High Time Workflow',
  tagline: 'Документация по процессам и экспериментам',
  favicon: 'img/favicon.ico',

  url: 'https://amoeba164.github.io',
  baseUrl: '/high-time-workflow/',

  organizationName: 'Amoeba164',
  projectName: 'high-time-workflow',
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
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Amoeba164/high-time-workflow/tree/main/',
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
        logo: { alt: 'High Time Logo', src: 'img/logo.svg' },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
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
            items: [{ label: 'Открыть docs', to: '/docs' }],
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
      // ВАЖНО: Algolia НЕ задаём вообще, иначе Docusaurus валидирует поля и падает
    }),
};

export default config;
