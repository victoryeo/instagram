import React, {useState} from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'

require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props) {
  console.log(props.route.params.image)  //log image uri
  const [caption, setCaption] = useState("")

  const savePostData = (snapshot) => {
    //upload image to firestore database
    firebase.firestore()
    .collection('posts').doc(firebase.auth().currentUser.uid)
    .collection('userPosts')
    .add({
      snapshot,
      caption,
      likesCount: 0,
      creation: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function() {
      props.navigation.popToTop()
    })

  }

  const uploadImage = async() => {
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    const uri = props.route.params.image
    const response = await fetch(uri)
    const blob = await response.blob()

    const task = firebase.storage().ref().child(childPath).put(blob)
    const taskProgress = (snapshot) => { console.log(`transferred: ${snapshot.bytesTransferred}`) }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot)
        console.log(snapshot)
      })
    }

    const taskError = (snapshot) => {
     console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted)
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
