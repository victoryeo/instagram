import React from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'

require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props) {
  console.log(props.route.params.image)  //log image uri
  const [caption, setCaption] = useState("")

  const uploadImage = async() => {

  }

  return (
    <View style={{flex: 1}}>
      <Image source={{uri: props.route.params.image}}/>
      <TextInput
        placeholder="Write description..."
        onChangeText={(caption) => { setCaption(caption)}}
      />
      <Button
        title="Save Image"
        onPress={() => {
          uploadImage()
        }}
      />
    </View>
  )
}
