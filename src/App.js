import React, { Component } from 'react'
import StatusSeekerContract from '../build/contracts/StatusSeeker.json'
import Config from '../truffle.js'
import Web3 from 'web3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keyWord: ''
    }

    this.getKeyWord = this.getKeyWord.bind(this);
  }

  getKeyWord(e) {
    e.preventDefault();

    // So we can update state later.
    var self = this

    // Get the RPC provider and setup our StatusSeeker contract.
    var {host, port} = Config.networks[process.env.NODE_ENV]
    
    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    // Declaring this for later so we can chain functions on StatusSeeker.
    var statusSeekerInstance

    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)

      statusSeeker.deployed().then(function(instance) {
        statusSeekerInstance = instance

        // Generate random number between 1 and 12. Once we have implemented QR code support
        // this id will be generated when the users scans the QR and the corresponding word
        // will be returned without giving away it's position in the array.
        var id = Math.floor((Math.random() * 10) + 3);

        // Get the key word for the id generated
        return statusSeekerInstance.keyWord.call(id, {from: accounts[0]});
      }).then(function(result) {
        // Update state with the result.
        return self.setState({ keyWord: result.toString() })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Status Seeker</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart Contract Seekers</h1>
              <p>The below will show a stored key word that is part of a 12 word phrase that can be used to reconstruct a private key in order to earn a reward</p>
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right call
                and only then diplay the result to the seeker.</p>
              <button onClick={this.getKeyWord}>Get Key Word</button>
              <p>Your lucky one of twelve key words is (drumroll):</p>
              <p className="center-text"><strong>{this.state.keyWord}</strong></p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
