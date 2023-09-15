window.onmessage = (event) => {
    // event.source === window means the message is coming from the preload
    // script, as opposed to from an <iframe> or other source.
    if (event.source === window && event.data === 'main-world-port') {
      const [ port ] = event.ports
      // Once we have the port, we can communicate directly with the main
      // process.
      port.onmessage = (event) => {
        console.log('from main process:', event.data)

        const nums = [1,2,3,4,5]
        nums.forEach(item => {
            console.log(item)
            port.postMessage(event.data.test * item)
        });
      }
    }
  }