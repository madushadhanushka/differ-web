
import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import "../css/differ.css"
var diff = require('diff')
var convert = require('xml-js')
var c14n = require('xml-c14n')()
var diff = require('diff')
var xmldom = require('xmldom')
const json = require('json-keys-sort')
const { parse } = require('dot-properties')
export const Head = () => <title>Home Page</title>
export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueOne: '',
      valueTwo: '',
      compMode: 'Plain'
    };
    this.handleOneChange = this.handleOneChange.bind(this)
    this.handleTwoChange = this.handleTwoChange.bind(this)
    this.onPlainChanged = this.onPlainChanged.bind(this)
    this.onXMLChanged = this.onXMLChanged.bind(this)
    this.onJsonChanged = this.onJsonChanged.bind(this)
    this.onPropChanged = this.onPropChanged.bind(this)

    this.getDiff = this.getDiff.bind(this)
  }
  componentDidMount() {
    this.getDiff()
    console.log("mounted")
  }
  compareIntegerList(a, b) {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    if (typeof a.attributes !== 'undefined' && typeof b.attributes !== 'undefined') {
      for (var attItem in a.attributes) {
        if (typeof b.attributes[attItem] !== 'undefined') {
          if (a.attributes[attItem] < b.attributes[attItem]) {
            return -1
          }
          if (a.attributes[attItem] > b.attributes[attItem]) {
            return 1
          }
        }
      }
    }
    return 0
  }
  sortJsonRecord(object) {
    var sortedObj = {}
    var keys = Object.keys(object)
    for (var index in keys) {
      var key = keys[index]
      if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
        sortedObj[key] = this.sortJsonRecord(object[key])
      } else if ((object[key] instanceof Array)) {
        object[key].sort(this.compareIntegerList)
        sortedObj[key] = []
        for (var child in object[key]) {
          sortedObj[key].push(this.sortJsonRecord(object[key][child]))
        }
      } else {
        sortedObj[key] = object[key]
      }
    }
    return sortedObj
  }
  compPlain() {
    const Diff2html = require('diff2html');
    var changesOth = diff.createPatch("Changes", this.state.valueOne, this.state.valueTwo)
    var diffHtml = Diff2html.html(
      changesOth,
      { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
    );
    document.getElementById("diff_content").innerHTML = diffHtml;
  }
  compXML() {
    const Diff2html = require('diff2html');
    console.log("XML document")
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    var documentOne = (new xmldom.DOMParser()).parseFromString(value1)
    var documentTwo = (new xmldom.DOMParser()).parseFromString(value2)
    var canonicaliser = c14n.createCanonicaliser('http://www.w3.org/2001/10/xml-exc-c14n#WithComments')
    canonicaliser.canonicalise(documentOne, function (err1, res1) {
      if (err1) {
        return console.warn(err1.stack)
      }
      canonicaliser.canonicalise(documentTwo, function (err2, res2) {
        if (err2) {
          return console.warn(err2.stack)
        }
        var options = { compact: false, ignoreComment: true, spaces: 4 }
        try {
          var result4 = convert.xml2js(res1, { object: false, ignoreComment: true, compact: false, spaces: 4, sanitize: true })
          var result4Two = convert.xml2js(res2, { object: false, ignoreComment: true, compact: false, spaces: 4, sanitize: true })
        } catch (parseError) {
          console.warn("Error while parsing XML")
          return
        }
        console.log("initial", result4)
        var sorted = this.sortJsonRecord(result4)
        console.log("sorted", sorted)
        var sortedTwo = this.sortJsonRecord(result4Two)
        var resultOne = convert.js2xml(sorted, options)
        var resultTwo = convert.js2xml(sortedTwo, options)
        var changesOth = diff.createPatch("Changes", resultOne, resultTwo)
        var diffHtml = Diff2html.html(
          changesOth,
          { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
        );
        document.getElementById("diff_content").innerHTML = diffHtml;
      }.bind(this))
    }.bind(this))

  }
  compJson() {
    const Diff2html = require('diff2html');
    console.log("Json document")
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    var sortedJson1, sortedJson2
    try {
      sortedJson1 = JSON.stringify(json.sort(JSON.parse(value1), true), null, 4)
      sortedJson2 = JSON.stringify(json.sort(JSON.parse(value2), true), null, 4)
    } catch (jsonError) {
      console.warn("Error while parsing JSON")
      return
    }
    var changesOth = diff.createPatch("Changes", sortedJson1, sortedJson2)
    var diffHtml = Diff2html.html(
      changesOth,
      { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
    );
    document.getElementById("diff_content").innerHTML = diffHtml;
  }
  compProp() {
    const Diff2html = require('diff2html');
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    console.log("property file")
    var linesPro1 = parse(value1)
    var linesPro2 = parse(value2)
    var strProList1 = []
    var strProList2 = []
    for (var proItem1 in linesPro1) {
      strProList1.push(proItem1 + ' = ' + linesPro1[proItem1])
    }
    for (var proItem2 in linesPro2) {
      strProList2.push(proItem2 + ' = ' + linesPro2[proItem2])
    }
    strProList1.sort()
    strProList2.sort()
    var proStr1 = ''
    var proStr2 = ''
    for (var proIteml1 in strProList1) {
      proStr1 += strProList1[proIteml1] + '\n'
    }
    for (var proIteml2 in strProList2) {
      proStr2 += strProList2[proIteml2] + '\n'
    }
    var changesOth = diff.createPatch("Changes", proStr1, proStr2)
    var diffHtml = Diff2html.html(
      changesOth,
      { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
    );
    document.getElementById("diff_content").innerHTML = diffHtml;
  }

  getDiff() {
    document.getElementById("diff_content").innerHTML = ''
    if (this.state.compMode === 'Plain') {
      this.compPlain()
    } else if (this.state.compMode === 'XML') {
      this.compXML()
    } else if (this.state.compMode === 'JSON') {
      this.compJson()
    } else if (this.state.compMode === 'Property') {
      this.compProp()
    }
  };
  handleOneChange(event) {
    this.setState({ valueOne: event.target.value });
  }
  handleTwoChange(event) {
    this.setState({ valueTwo: event.target.value });
  }
  onPlainChanged(event) {
    console.log("plain")
    this.setState({ compMode: 'Plain' })
  }
  onXMLChanged(event) {
    console.log("xml")
    this.setState({ compMode: 'XML' })
  }
  onJsonChanged(event) {
    console.log("json")
    this.setState({ compMode: 'JSON' })
  }
  onPropChanged(event) {
    console.log("prop")
    this.setState({ compMode: 'Property' })
  }
  render() {
    return (

      <div>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"></link>
        <div class="container">
        <div class="row">
    <div class="col-sm">
    <div>First text to compare</div>
            <textarea className="textEditArea" name="fileOne" value={this.state.valueOne} onChange={this.handleOneChange} rows={20} spellCheck="false" />
    </div>
    <div class="col-sm">
    <div>Second text to compare</div>
            <textarea className="textEditArea" name="fileTwo" value={this.state.valueTwo} onChange={this.handleTwoChange} rows={20} spellCheck="false" />
    </div>
  </div>
  <div className="button_div">
          Compare as 
          <span title="Compare as a plain text" className="radio_button"><input type="radio" name="selType" value="Plain" checked={this.state.compMode === "Plain"} onChange={this.onPlainChanged} />Plain&nbsp;&nbsp;</span>
          <span title="Compare as a XML document" className="radio_button"><input class="radio" type="radio" name="selType" value="XML" checked={this.state.compMode === "XML"} onChange={this.onXMLChanged} />XML&nbsp;&nbsp;</span>
          <span title="Compare as a JSON document" className="radio_button"><input class="radio" type="radio" name="selType" value="JSON" checked={this.state.compMode === "JSON"} onChange={this.onJsonChanged} />JSON&nbsp;&nbsp;</span>
          <span title="Compare as a property file" className="radio_button"><input class="radio" type="radio" name="selType" value="Property" checked={this.state.compMode === "Property"} onChange={this.onPropChanged} />Property</span>
          <button className="submit_button" type="submit" onClick={this.getDiff}>Compare</button>
        </div>
        <br />
        <div id="diff_content"></div>
</div>
        
        <div className="div_desc">
          <h1>Smart File Comparison Tool for Developers</h1>
          <h2>Differ is Smart</h2>
          <p>Have you ever endedup with a mess when you comparing two XML or JSON files. Traditional diff tools cannot identify the structure 
          of a XML or JSON file. Differ provide an elagent way of comparing two XML, JSON or Property files. You can tryout online version in
          here. Folder comparison support provided by the desktop application.
          </p>

          <h2>How Differ App Works</h2>
          <p>
            Differ is based on Javascript language. Therefore It's platform independent. Differ desktop application running on electronJS.  
            you can run Differ application on Mac, Windows and Linux environment. 
          </p>
          <p>
          Differ support two types of comparison. It support regular plain text comparison. Other than plain text comparison, It also
            support structural comparsion. Differ app support three types of file structures. Differ app can compare following types of 
            files structurally.
          </p>
          <li>XML</li>
          <li>JSON</li>
          <li>Property</li>
          <p>
            Differ app can read these file format and convert these files into its cannonical representation. If two files structure are same, 
            then canonicalised form of the two files should be also same. Differ apply diff on the cannonical representation of the files and 
            show the difference.
          </p>
        </div>
        <span className="text_span">
            <div className="download_wrap">
              <div className="div_title">Download Desktop Application</div>
              <img className="image_title" src="screen.png" width = "390px"/>
            <div className="git_des">
              <br/>
              Check this project on Github
              <br/>
            <a className="down_a" href="https://github.com/madushadhanushka/differ"><img className="image_git" src="differicon.png" width = "200px"/></a>
            </div>
            
            </div>
          </span>
        
      </div>
    );
  }
}
