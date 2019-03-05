const express = require('express')
const expressStatic = require('express-static')
const EventEmitter = require('events')
const stream = new EventEmitter()

async function main () {
  const port = 8000
  const app = express()
  let messageId = 0
  let interval
  app.get('/event-stream', (req, res) => {
    messageId += 1
    interval = setInterval(() => {
      stream.emit('push', {
        timestamp: Date.now()
      })
    }, 1000)

    stream.on('push', (data) => {
      const jsonStr = JSON.stringify(data)
      res.write(`id: ${messageId}\n`)
      res.write(`data: ${jsonStr}\n\n`)
    })
    req.on('close', () => {
      console.log('terminated')
      clearInterval(interval)
    })
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    res.write('\n')
  })

  app.use(expressStatic('./public'))
  app.listen(port, () => {
    console.log(`listening to port *:${port}. press ctrl + c to cancel.`)
  })
}

main().catch(console.error)
