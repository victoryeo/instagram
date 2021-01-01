import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
  const [posts, setPosts] = useState([])

  useEffect(()=> {
    let posts = []
    if (props.usersLoaded == props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find(param=>{
          console.log(param.uid)
          param.uid===props.following[i]
        })
        if (user != undefined) {
          posts = [...posts, ...user.posts]
        }
      }

      //order the posts according to creation time
      posts.sort((x,y) => {
        return x.creation - y.creation
      })

      setPosts(posts)
    }
  }, [props.usersLoaded])

  return (
    <View style={styles.containerView}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Text>{item.user.name}</Text>
              <Image
                style={styles.image}
                source={{uri: item.snapshot}}
              />
              <Text
                onPress ={()=>
                  props.navigation.navigate('Comment', {
                    postId: item.id,
                    uid: item.user.uid
                  })
                }>
                View comments...</Text>
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
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed)
