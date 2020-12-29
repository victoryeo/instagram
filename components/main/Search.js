import React, {useState} from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')

export default function Search() {
  const [users, setUsers] = useState([])

  const fetchUser =  (search) => {
    firebase.firestore()
    .collection('users')
    .where('name', '>=', search)
    .get()
    .then((snapshot) => {
      let users = snapshot.docs.map(doc => {
        const data = doc.data()
        const id = doc.id
        return{id, ...data}
      })
      console.log(users)
      setUsers(users)
    })
  }

  return (
    <View>
      <Text>Search</Text>
      <TextInput placeholder="type..." onChangeText={(search) => {fetchUser(search)}} />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item})=>(
          <TouchableOpacity
            onPress={() => {}}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
