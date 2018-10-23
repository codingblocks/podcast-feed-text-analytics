import React, { Component } from 'react'

class FeedForm extends Component {
  submit (event) {
    event.preventDefault()

    const inputs = ['feed', 'key', 'analyzerType']
    let config = {}
    inputs.forEach(i => {
      config[i] = event.target.elements[i].value
    })

    if (this.props.onSubmit) {
      this.props.onSubmit(config)
    }
  }

  render () {
    return (
      <form onSubmit={this.submit.bind(this)}>
        <div className='form-group'>
          <label htmlFor='feed'>Feed</label>
          <input
            className='form-control'
            id='feed'
            name='feed'
            aria-describedby='feedHelp'
            placeholder='Example: https://codingblocks.libsyn.com/rss'
          />
          <small id='feedHelp' className='form-text text-muted'>
            Enter the full http/https of the podcast rss feed
          </small>
        </div>
        <div className='form-group'>
          <label htmlFor='key'>Text Analytics Key</label>
          <input
            className='form-control'
            id='key'
            name='key'
            aria-describedby='feedHelp'
            placeholder='Paste Key Here'
          />
          <small id='feedHelp' className='form-text text-muted'>
            Paste your Text Analytics Key here
          </small>
        </div>
        <div className='form-group'>
          <label htmlFor='analyzerType'>Analyzer API:</label>
          <select
            className='form-control'
            id='analyzerType'
            name='analyzerType'
          >
            <option value='entities'>Entities</option>
            <option value='keyPhrases'>Key Phrases</option>
          </select>
        </div>
        <button className='btn btn-primary'>
          Submit
        </button>
      </form>
    )
  }
}

export default FeedForm
