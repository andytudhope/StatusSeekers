import React, { Component } from 'react'
import StatusSeeker1Contract from '../build/contracts/StatusSeeker1.json'
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
  }

  componentWillMount() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    // So we can update state later.
    var self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    var {host, port} = Config.networks[process.env.NODE_ENV]
    
    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const statusSeeker1 = contract(StatusSeeker1Contract)
    statusSeeker1.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var statusSeeker1Instance

    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)

      statusSeeker1.deployed().then(function(instance) {
        statusSeeker1Instance = instance

        // Get the key word for this contract
        return statusSeeker1Instance.key({from: accounts[0]})
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
            {/*}<ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">News</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sports</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Finance</a></li>
            </ul>*/}
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart Contract Seekers</h1>
              <p>The below will show a stored key word that is part of a 12 word phrase that can be used to reconstruct a private key in order to earn a reward</p>
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right calle
                and only then diplay the result to the seeker.</p>
              <p>The stored key word is: {this.state.keyWord}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
