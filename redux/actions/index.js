import firebase from 'firebase'
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../constants/index'

// get from firestore
export function fetchUser() {
  return((disptach) => {
    firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log(snapshot.data())
          disptach({
            type: USER_STATE_CHANGE,
            currentUser: snapshot.data()
          })
        }
        else {
          console.log('not exist')
        }
      })
  })
}

export function fetchUserPosts() {
  return((disptach) => {
    firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data()
          const id = doc.id
          return{id, ...data}
        })
        console.log("VIC")
        console.log(posts)  //posts is an array
        disptach({
          type: USER_POSTS_STATE_CHANGE,
          posts: posts
        })
      })
  })
}
