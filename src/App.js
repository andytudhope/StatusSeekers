import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import statusSeekerContract from './utils/statusSeeker'
import Loading from './components/Loading'
import KeywordOrganizer from './components/KeywordOrganizer';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      keywords: []
    }
  }

  componentDidMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
          statusSeeker: statusSeekerContract.withProvider(results.web3.currentProvider)
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  getKeyWord = async (e) => {
    e.preventDefault()

    // Generate random number between 0 and 11. Once we have implemented QR code support
    // this id will be generated when the users scans the QR and the corresponding word
    // will be returned without giving away it's position in the array.
    var id = Math.floor((Math.random() * 11));

    const result = await this.state.statusSeeker.getWord(id)

    this.setState({
      keywords: this.state.keywords.concat([result.toString()])
    })
  }

  moveKeyword = (dragIndex, hoverIndex) => {
    const dragKeyword = this.state.keywords[dragIndex]
    let keywords = [...this.state.keywords]
    keywords.splice(dragIndex, 1)
    keywords.splice(hoverIndex, 0, dragKeyword)

    this.setState({ keywords })
  }

  _renderGame = () => {
    const {
      keywords
    } = this.state

    return (
      <div>
        <div className="button-kw-container">
          <button className="button-kw" onClick={this.getKeyWord}>Get Key Word</button>
        </div>
        <p>Your lucky one of twelve key words is (drumroll):</p>
        <KeywordOrganizer keywords={keywords} moveKeyword={this.moveKeyword} />
      </div>
    )
  }

  render() {

    if (!this.state.web3) {
      return (<Loading></Loading>)
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Status Community</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart Contract Seekers</h1>
              <p>The below will show a stored key word that is part of a 12 word phrase that can be used to reconstruct a private key in order to earn a reward.</p>
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right call and only then diplay the result to the seeker.</p>
              {this._renderGame()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
