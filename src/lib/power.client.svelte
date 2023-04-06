<script lang="ts">
  import { browser } from '$app/environment'
  import * as mqtt from 'mqtt'
  import { onDestroy, onMount } from 'svelte'
  import { writable } from 'svelte/store'

  let power = writable(0)
  let received = 0

  // mqtt
  let client: mqtt.MqttClient

  // subscribe
  onMount(() => {
    if (browser) {
      client = mqtt.connect('ws://localhost:8080', { clientId: 'mqtt-tester' + Math.random().toString(16).substring(2, 8), keepalive: 100 })
      client.on('connect', () => {
        if (client.connected === true) {
          client.subscribe(
            'test',
            {
              qos: 1,
              rap: true,
              rh: 1,
            },
            (err, granted) => {
              if (err) {
                console.log('received error: ', err)
              } else {
                console.log('granted on subscribe: ', granted)
              }
            }
          )
        }
      })
      // on error
      client.on('error', function (error) {
        console.log('Unable to connect: ' + error)
      })
      // on message
      client.on('message', (topic, message) => {
        // message is Buffer
        console.log('received: ', message.toString())
        received = parseInt(message.toString())
        $power = received || 0
      })
    }

    setTimeout(() => {
      if (!$power) {
        $power = 1
      }
    }, 1000)
  })

  onDestroy(() => {
    if (client) {
      client.end()
      console.log('destroyed')
    }
  })

  function publish(topic: string, message: string) {
    console.log('publishing: ', message)

    if (client && client.connected === true) {
      console.log('publishing topic: ' + topic + ', message: ' + message)
      client.publish(topic, message, { qos: 1, retain: true })
    }
  }

  let timer: NodeJS.Timeout

  power.subscribe((value) => {
    if (value != received) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        publish('test', JSON.stringify(value))
      }, 500)
    }
  })
</script>

{#if $power}
  <h2>{$power}%</h2>
  <div id="slider-container">
    <input type="range" min="1" max="100" bind:value={$power} class="slider" id="myRange" />
  </div>
{:else}
  <div class="loader" />
{/if}

<style scoped>
  h2 {
    font-size: 50px;
  }

  #slider-container {
    width: 100%;
  }

  .slider {
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
  }

  .loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #2080ff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
    margin-top: 10px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
