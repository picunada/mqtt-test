<script lang="ts">
  import { browser } from '$app/environment'
  import { onDestroy, onMount, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import MQTTClient from './mqtt'

  // mqtt
  let mqttClient: MQTTClient

  // subscribe
  onMount(() => {
    if (browser) {
      mqttClient = new MQTTClient('ws://test.mosquitto.org:8081/ws', { clientId: 'mqtt-tester' + Math.random().toString(16).substring(2, 8), keepalive: 100 })
    }

    setTimeout(() => {
      if (!$mqttClient) {
        $mqttClient = 1
      }
    }, 4000)
  })

  onDestroy(() => {
    if (mqttClient) {
      mqttClient.client.end()
      console.log('destroyed')
    }
  })
</script>

{#if $mqttClient}
  <h2>{$mqttClient}%</h2>
  <div id="slider-container">
    <input type="range" min="1" max="100" bind:value={$mqttClient} class="slider" id="myRange" />
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
