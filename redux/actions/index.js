import firebase from 'firebase'
import { USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE } from '../constants/index'

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

export function fetchUserFollowing() {
  return((disptach) => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map(doc => {
          const id = doc.id
          return id
        })
        console.log(following)  //following is an array
        disptach({
          type: USER_FOLLOWING_STATE_CHANGE,
          following: following
        })
      })
  })
}

export function fetchUsersData(uid) {
  return((dispatch, getState)=> {
    const found = getState().usersState.users.some(el=>el.uid===uid)

    if (!found) {
      //user not exist within the array
      return((disptach) => {
        firebase.firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              let user = snapshot.data()
              user.uid = snapshot.id
              disptach({
                type: USERS_DATA_STATE_CHANGE,
                user: user
              })
            }
            else {
              console.log('not exist')
            }
          })
      })
    }

  })
}
