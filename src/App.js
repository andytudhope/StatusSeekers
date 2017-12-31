import React, { Component } from 'react'
import Config from '../truffle.js'
import getWeb3 from './utils/getWeb3'
import { connect } from 'react-redux'
import { addKeyword } from './actions'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      keyWord: ''
    }

    this.getKeyWord = this.getKeyWord.bind(this);
  }

  componentDidMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  getKeyWord(e) {
    e.preventDefault()
    this.props.dispatch(addKeyword(this.state.web3))
  }

  render() {
    const {
      currentKeyword,
      wordList,
    } = this.props

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
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right call
                and only then diplay the result to the seeker.</p>
              <div className="button-kw-container">
                {currentKeyword.isFetching ?
                  <p>Please wait, busy loading word</p>
                  : <button className="button-kw" onClick={this.getKeyWord}>Get Key Word</button>}
              </div>
              <p>Your lucky one of twelve key words is (drumroll):</p>
              <p className="center-text"><strong>{currentKeyword.word}</strong></p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentKeyword: state.currentKeyword,
    wordList: state.wordList,
  }
}

export default connect(mapStateToProps)(App)
