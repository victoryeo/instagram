const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

//equi to firebase.firestore() in frontend
const db = admin.firestore();

// when {userId} is added to the field, onCreate is called
export.addLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
  .onCreate((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1)
      })
  })

export.removeLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
  .onDelete((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(-1)
      })
  })
