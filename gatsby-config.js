
module.exports = {
  siteMetadata: {
    title: `Differ App`,
    siteUrl: `https://differ.netlify.com`,
  },
  plugins: [`gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: "UA-140800454-1",
    },
  },`gatsby-plugin-sitemap`]
};
