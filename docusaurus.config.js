// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "너는 아직 자바스크립트를 모른다 📒",
  tagline: "자바스크립트는 언제 알 수 있을까",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.jpeg",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/p-acid/you-dont-know-JS-study",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/p-acid/you-dont-know-JS-study",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "You Don't Know JS Yet",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.jpeg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/p-acid/you-dont-know-JS-study",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Up & Going",
                to: "/docs/up-going/intro",
              },
            ],
          },
          {
            title: "Blog",
            items: [
              {
                label: "Samuel Park",
                href: "https://acid-log.vercel.app/",
              },
              {
                label: "Daisy Jeong",
                href: "https://github.com/Jeong-minji",
              },
              {
                label: "Hey-ho",
                href: "https://github.com/heyho-time",
              },
            ],
          },
          {
            title: "About",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/p-acid/you-dont-know-JS-study",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} You-dont-know-JS-study, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
