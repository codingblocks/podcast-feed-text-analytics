import React, { Component } from 'react'
import FeedForm from './FeedForm'
const request = require('request')
const parsePodcast = require('node-podcast-parser')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  analyzeFeed (config) {
    request(config.feed, (err, res, data) => {
      if (err) {
        console.error('Network error', err)
        return
      }

      parsePodcast(data, (err, data) => {
        if (err) {
          console.error('Parsing error', err)
        }

        const requestBody = {
          documents: data.episodes.map((e, i) => {
            return {
              language: 'en',
              id: i + 1,
              text: e[config.feedField]
            }
          })
        }

        const endpoint = `https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/${config.analyzerType}`

        window.fetch(endpoint, {
          method: 'POST',
          mode: 'cors', // no-cors, cors, *same-origin
          credentials: 'same-origin', // include, same-origin, *omit
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': config.key
          },
          redirect: 'error', // manual, *follow, error
          referrer: 'no-referrer', // no-referrer, *client
          body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
        }).then(response => {
          response.json().then(result => {
            let episodes = result.documents.map(i => i[config.analyzerType])
            let tags = this.countPhrases({}, episodes)
            let tagArray = []
            for (let t in tags) {
              tagArray.push(tags[t])
            }
            tagArray = tagArray.sort((a, b) => b.count - a.count) // reverse order
            this.setState({
              tagCloudHtml: tagArray
                .map(
                  i => `<li style="margin: 5px;">${i.count} ${i.tagName}</li>`
                )
                .join(``)
            })
          })
        })
      })
    })
  }

  countPhrases (phraseCounts, episodes) {
    episodes.forEach(e => {
      e.forEach(p => {
        let np = p.name ? p.name.toLowerCase() : p.toLowerCase()
        phraseCounts[np] = {
          tagName: np,
          count: phraseCounts[np] ? phraseCounts[np].count + 1 : 1
        }
      })
    })

    return phraseCounts
  }

  render () {
    return (
      <div className='app-container'>
        <FeedForm onSubmit={this.analyzeFeed.bind(this)} />
        <ul dangerouslySetInnerHTML={{ __html: this.state.tagCloudHtml }} />
      </div>
    )
  }
}

export default App
