import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
var diff = require('diff')
import { Diff2Html } from 'diff2html'
import 'react-gh-like-diff/lib/diff2html.min.css';
export default class Index extends React.Component {
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
    console.log("mounted")
    /*<![CDATA[/* */
      var _pop = _pop || [];
      _pop.push(['siteId', 3394399]);
      _pop.push(['minBid', 0]);
      _pop.push(['popundersPerIP', 0]);
      _pop.push(['delayBetween', 0]);
      _pop.push(['default', false]);
      _pop.push(['defaultPerDay', 0]);
      _pop.push(['topmostLayer', false]);
      (function() {
        var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
        var s = document.getElementsByTagName('script')[0]; 
        pa.src = '//c1.popads.net/pop.js';
        pa.onerror = function() {
          var sa = document.createElement('script'); sa.type = 'text/javascript'; sa.async = true;
          sa.src = '//c2.popads.net/pop.js';
          s.parentNode.insertBefore(sa, s);
        };
        s.parentNode.insertBefore(pa, s);
      })();
    /*]]>/* */
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
    var changesOth = diff.createPatch("Changes", this.state.valueOne, this.state.valueTwo)
    var diffHtml = Diff2Html.getPrettyHtml(
      changesOth,
      { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
    );
    document.getElementById("diff_content").innerHTML = diffHtml;
  }
  compXML() {
    console.log("XML document")
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    var convert = require('xml-js')

    var xmldom = require('xmldom')
    var documentOne = (new xmldom.DOMParser()).parseFromString(value1)
    var documentTwo = (new xmldom.DOMParser()).parseFromString(value2)
    var c14n = require('xml-c14n')()
    var diff = require('diff')
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
        var diffHtml = Diff2Html.getPrettyHtml(
          changesOth,
          { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
        );
        document.getElementById("diff_content").innerHTML = diffHtml;
      }.bind(this))
    }.bind(this))

  }
  compJson() {
    console.log("Json document")
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    const json = require('json-keys-sort')
    var sortedJson1, sortedJson2
    try {
      sortedJson1 = JSON.stringify(json.sort(JSON.parse(value1), true), null, 4)
      sortedJson2 = JSON.stringify(json.sort(JSON.parse(value2), true), null, 4)
    } catch (jsonError) {
      console.warn("Error while parsing JSON")
      return
    }
    var changesOth = diff.createPatch("Changes", sortedJson1, sortedJson2)
    var diffHtml = Diff2Html.getPrettyHtml(
      changesOth,
      { inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side' }
    );
    document.getElementById("diff_content").innerHTML = diffHtml;
  }
  compProp() {
    var value1 = this.state.valueOne
    var value2 = this.state.valueTwo
    console.log("property file")
    const { parse } = require('dot-properties')
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
    var diffHtml = Diff2Html.getPrettyHtml(
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
        <ul>
          <span className="text_span">
            <div>First text to compare</div>
            <textarea name="fileOne" value={this.state.valueOne} onChange={this.handleOneChange} rows={20} cols={70} spellCheck="false" />
          </span>
          <span className="text_span">
            <div>Second text to compare</div>
            <textarea name="fileTwo" value={this.state.valueTwo} onChange={this.handleTwoChange} rows={20} cols={70} spellCheck="false" />
          </span>
          <span className="text_span">
            <div className="download_wrap">
              <div className="div_title">Download Desktop Application</div>
              <img className="image_title" src="screen.png" width = "390px"/>
              <div className="links_ls">
                <div className="downlink"><a className="down_a" href="https://www.dropbox.com/s/kvwtlfo1sgbvb2o/differ-linux.zip?dl=1">Linux</a></div>
                <div className="downlink"><a className="down_a" href="https://www.dropbox.com/s/j42llwmpa8d9zir/differ-mac.zip?dl=1">Mac</a></div>
                <div className="downlink"><a className="down_a" href="https://www.dropbox.com/s/uvp1gh8k6ekg2ef/differ-win.zip?dl=1">Windows</a></div>
            </div>
            <div className="git_des">
              <br/>
              Check this project on Github
              <br/>
            <a className="down_a" href="https://github.com/madushadhanushka/differ"><img className="image_git" src="differicon.png" width = "200px"/></a>
            </div>
            
            </div>
          </span>
        </ul>
        <div className="button_div">
          <span className="radio_button"><input type="radio" name="selType" value="Plain" checked={this.state.compMode === "Plain"} onChange={this.onPlainChanged} />Plain&nbsp;&nbsp;</span>
          <span className="radio_button"><input class="radio" type="radio" name="selType" value="XML" checked={this.state.compMode === "XML"} onChange={this.onXMLChanged} />XML&nbsp;&nbsp;</span>
          <span className="radio_button"><input class="radio" type="radio" name="selType" value="JSON" checked={this.state.compMode === "JSON"} onChange={this.onJsonChanged} />JSON&nbsp;&nbsp;</span>
          <span className="radio_button"><input class="radio" type="radio" name="selType" value="Property" checked={this.state.compMode === "Property"} onChange={this.onPropChanged} />Property</span>
          <button className="submit_button" type="submit" onClick={this.getDiff}>Compare</button>
        </div>
        <br />
        <div id="diff_content"></div>

      </div>
    );
  }
}
