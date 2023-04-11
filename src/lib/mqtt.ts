import * as mqtt from 'mqtt'
import { writable, type Subscriber, type Unsubscriber, type Writable } from 'svelte/store'

interface IMQTTClient {
  client: mqtt.MqttClient
  power: Writable<number>

  publish(topic: string, message: string): void
  subscribe(run: Subscriber<number>): Unsubscriber
  set(value: number): void
}

export default class MQTTClient implements IMQTTClient {
  public client: mqtt.MqttClient
  public power: Writable<number>

  private received = 0

  constructor(url: string, options?: mqtt.IClientOptions) {
    this.power = writable(0)
    this.client = mqtt.connect(url, options)

    this.client.on('connect', () => {
      if (this.client.connected === true) {
        this.client?.subscribe(
            'test:picunada',
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
    this.client.on('error', function (error) {
      console.log('Unable to connect: ' + error)
    })
    // on message
    this.client.on('message', (topic, message) => {
      // message is Buffer
      console.log('received: ', message.toString())
      this.received = parseInt(message.toString())
      this.power.set(this.received || 0)
    })

    let timer: NodeJS.Timeout

    this.power.subscribe((value) => {
      if (value != this.received) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.publish('test:picunada', JSON.stringify(value))
        }, 500)
      }
    })
  }
  

  public publish(topic: string, message: string): void {
    console.log('publishing: ', message)

    if (this.client && this.client.connected === true) {
      console.log('publishing topic: ' + topic + ', message: ' + message)
      this.client.publish(topic, message, { qos: 1, retain: true })
    }
  }
  
  public subscribe(run: Subscriber<number>): Unsubscriber {
    return this.power.subscribe(run)
  }

  public set(value: number) {
    this.power.set(value)
  }
}
