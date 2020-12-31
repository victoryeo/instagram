import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  useEffect(()=> {
    const {currentUser, posts} = props
    console.log({currentUser, posts})
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    }
    else {
      firebase.firestore().collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data())
          }
          else {
            console.log('not exist')
          }
        })
      firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            return{id, ...data}
          })
          setUserPosts(posts)
        })
    }
  }, [props.route.params.uid])

  const onFollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }

  const onUnfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete({})
  }

  if (user === null) {
    return <View/>
  }

  const { currentUser, posts } = props
  console.log({currentUser, posts})
  return (
    <View style={styles.containerView}>
      <View style={styles.containerInfo}>
        <Text>name: {user.name}</Text>
        <Text>{user.email}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid
          ? (<View>
              {following? (
                <Button
                 title="following"
                 onPress={()=> onUnfollow()}
                />
              ) : (
                <Button
                 title="follow"
                 onPress={()=> onFollow()}
                />
              )}
            </View>)
          : null}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{uri: item.snapshot}}
              />
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerView: {
    flex:1,
    marginTop:40,
    marginLeft: 20
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 2,
  },
  containerImage: {
    flex: 1/3,
  },
  image: {
    flex: 1,
    aspectRatio: 1/1
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
})

export default connect(mapStateToProps, null)(Profile)
