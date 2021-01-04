import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
  const [posts, setPosts] = useState([])

  useEffect(()=> {
    console.log("Feed useEffect")
    console.log(props.usersFollowingLoaded)
    console.log(props.following.length)
    if (props.usersFollowingLoaded == props.following.length  &&
      props.following.length !== 0) {

      //order the posts according to creation time
      props.feed.sort((x,y) => {
        return x.creation - y.creation
      })

      setPosts(props.feed)
    }
    console.log(posts)

  }, [props.usersFollowingLoaded, props.feed])

  return (
    <View style={styles.containerView}>
      <View style={styles.containerGallery}>
        <Text>User Feed</Text>
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
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed)
