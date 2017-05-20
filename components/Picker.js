import { ColorPicker, fromHsv } from 'react-native-color-picker'
import init from 'react_native_mqtt'
import {AsyncStorage} from 'react-native'
let ipAddress = '<YourMQTTServer'
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync : {
  }
})

console.log('Here')
let onConnect = () => {
  console.log('Successfully connected')
}
let onConnectionLost = (responseObject) => {
  console.log('lost')
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}
let onMessage = () => {
  console.log('Received message')
}
let client = new Paho.MQTT.Client(ipAddress, 9001, 'user1')
client.onConnectionLost = onConnectionLost
client.onMessage = onMessage
client.connect({onSuccess: onConnect})
import React, {Component} from 'react'
export default class Picker extends Component {
  render() {
    return (
      <ColorPicker
      onColorChange={
        color=>{  
          color = fromHsv(color)
          let colorHex = `${color.substring(1,3)},${color.substring(3,5)},${color.substring(5,7)}`
          let message = new Paho.MQTT.Message(colorHex)
          message.destinationName = 'led'
          client.send(message)
        }
      } 
      style={{flex:1}}/>
    )
  }
}
