import React from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'

function Profile(props) {
  const { currentUser, posts } = props
  console.log({currentUser})
  console.log({posts})
  return (
    <View style={styles.containerView}>
      <View style={styles.containerInfo}>
        <Text>name: {currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
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
