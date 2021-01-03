import firebase from 'firebase'
import { USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA } from '../constants/index'

// clear data from redux store
export function clearData() {
  return ((dispatch) => {
    dispatch({
      type: CLEAR_DATA,
    })
  })
}

// get from firestore
export function fetchUser() {
  return((dispatch) => {
    firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log(snapshot.data())
          dispatch({
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
  return((dispatch) => {
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
        console.log("USER_POSTS_STATE_CHANGE")
        console.log(firebase.auth().currentUser.uid)
        console.log(posts)  //posts is an array
        dispatch({
          type: USER_POSTS_STATE_CHANGE,
          posts: posts
        })
      })
  })
}

export function fetchUserFollowing() {
  return((dispatch) => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map(doc => {
          const id = doc.id
          return id
        })
        console.log("following")
        console.log(following)  //following is an array
        dispatch({
          type: USER_FOLLOWING_STATE_CHANGE,
          following: following
        })
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i]), true)
        }
      })
  })
}

export function fetchUsersData(uid, getPosts) {
  return((dispatch, getState)=> {
    const found = getState().usersState.users.some(el=>el.uid===uid)
    console.log(found)
    console.log(uid)
    if (!found) {
      //user not exist within the array
        firebase.firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            console.log("inside fetchUsersData snapshot")
            if (snapshot.exists) {
              let user = snapshot.data()
              user.uid = snapshot.id
              dispatch({
                type: USERS_DATA_STATE_CHANGE,
                user: user
              })
            }
            else {
              console.log('not exist')
            }
          })
          if (getPosts) {
            console.log(uid)
            dispatch(fetchUsersFollowingPosts(uid))
          }
    }
  })
}

export function fetchUsersFollowingPosts(uid) {
  return((dispatch, getState) => {
    console.log(uid)
    firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
       .then((snapshot) => {
        //get uid of the returned data
        //this path is retrieved from the console log of snapshot
        const uid = snapshot.kf.query.path.segments[1]
        //const uid = 1
        console.log({snapshot, uid})
        const user = getState().usersState.users.find(el=>el.uid===uid)
        console.log(user)
        let posts = snapshot.docs.map(doc => {
          const data = doc.data()
          console.log(data)
          const id = doc.id
          return{id, ...data, user}
        })
        console.log(posts)  //posts is an array
        dispatch({
          type: USERS_POSTS_STATE_CHANGE,
          posts: posts,
          uid: uid
        })
        console.log(getState)
      })
  })
}
