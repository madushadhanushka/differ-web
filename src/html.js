import React from "react"
import PropTypes from "prop-types"

const BUILD_TIME = new Date().getTime()

export default class HTML extends React.Component {
  static propTypes = {
    body: PropTypes.string,
  }

  render() {
    let css
    if (process.env.NODE_ENV === "production") {
      css = (
        <style
          dangerouslySetInnerHTML={{
            __html: require("!raw!../public/styles.css"),
          }}
        />
      )
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="google-site-verification" content="SunVbBEDzklHGUzbegVL2fSEdU7d4f8vL8h3ZyvFAQw" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
          <link rel="icon" type="image/png" sizes="16x16" href="favicon.ico"></link>
          <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />
          {this.props.headComponents}
          {css}
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}
