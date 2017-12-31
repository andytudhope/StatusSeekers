import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default class CopyKeywords extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      copied: false
    }
  }

  _onCopy = () => {
    clearTimeout(this.timeoutId)
    this.setState({ copied: true })

    this.timeoutId = setTimeout(() => {
      this.setState({ copied: false })
    }, 3000)
  }

  render () {
    const { keywords, children } = this.props
    const { copied } = this.state

    return (
      <CopyToClipboard
        text={keywords.join(' ')}
        onCopy={this._onCopy}
      >
        <button
          className="button-kw"
          onClick={this.getKeyWord}>
            {copied ? 'Copied!' : children}
        </button>
      </CopyToClipboard>
    )
  }
}
