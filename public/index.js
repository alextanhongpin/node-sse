const sse = new window.EventSource('/event-stream')
sse.addEventListener('message', (e) => {
  const data = e.data
  console.log('got data', JSON.parse(data))
})

window.setTimeout(() => {
  sse.close()
}, 10000)
