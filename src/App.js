import React, { Component } from 'react'

import getWeb3 from './utils/getWeb3'
import statusSeekerContract from './utils/statusSeeker'
import Loading from './components/Loading'
import KeywordOrganizer from './components/KeywordOrganizer'
import CopyKeywords from './components/CopyKeywords'

import { connect } from 'react-redux'
import { addKeyword, moveKeywordInList } from './actions'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      keywords: [],
      statusSeeker: null,
    }

    this.getKeyWord = this.getKeyWord.bind(this);
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

  getKeyWord(e) {
    e.preventDefault()
    this.props.dispatch(addKeyword(this.state.statusSeeker))
  }

  _renderGame = () => {
    const {
      currentKeyword,
      wordList,
    } = this.props

    const moveKeyword = (dragIndex, hoverIndex) => {
      console.log('move keyword')
      this.props.dispatch(moveKeywordInList(dragIndex, hoverIndex))
    }

    return (
      <div>
        <div className="button-kw-container">
          {currentKeyword.isFetching ?
            <Loading size="27px" margin="4px"/>
            : <button className="button-kw" onClick={this.getKeyWord}>Get Key Word</button>}
        </div>
        {wordList.length > 0 &&
          <div>
            <p>You've found {wordList.length} {wordList.length === 1? 'word' : 'words'}! Look for a total of 12!</p>
            <KeywordOrganizer keywords={wordList} moveKeyword={moveKeyword} />
            {wordList.length === 12 &&
              <div className="button-kw-container copy-button-container">
                <CopyKeywords keywords={wordList}>Copy Mnemonic</CopyKeywords>
              </div>
            }
          </div>
        }
      </div>
    )
  }

  render() {

    if (!this.state.web3) {
      return (<Loading size="50px" margin="4px"></Loading>)
    }

    return (
      <div className="App">
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart Contract Seekers</h1>
              <p>The below will show a stored key word that is part of a 12 word phrase that can be used to reconstruct a private key in order to earn a reward.</p>
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right call
                and only then diplay the result to the seeker.</p>
              {this._renderGame()}
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
