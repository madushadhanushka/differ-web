import React from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"
import Helmet from "react-helmet"

import "../css/typography.css"

export default class Template extends React.Component {
  static propTypes = {
    children: PropTypes.func,
  }

  render() {
    return (
      <div>
        <Helmet
          title="DifferApp - Smart Text File Comparison Tool to find difference between two JSON, XML and Property files"
          meta={[
            { name: "description", content: "Differ is an online and desktop diff tool to compare text, JSON, XML and Property to find the difference between two text files" },
            { name: "keywords", content: "online diff, diff, diff tool, quick diff, quickdiff, online diff tool, diff checker, smart diff" },
          ]}
        />
        <div
          style={{
            background: `#292929`,
            marginBottom: `1.45rem`,
          }}
        >
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `1.45rem 1.0875rem`,
            }}
          >
            <h1 style={{ margin: 0 }}>
              <Link
                to="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Differ App - Compare two files easily
              </Link>
            </h1>
            <h2 style={{
              fontSize: '15px',
              color: '#dddddd',
              lineHeight: '18px'
            }}>Differ App is an easy tool to compare two files smartly. You can compare JSON, XML and properties without considering their structural positions. Download desktop app to use it offline along with folder comparison feature.</h2>
          </div>
        </div>
        <div
          style={{
            margin: `0 auto`,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          {this.props.children()}
        </div>
      </div>
    )
  }
}
