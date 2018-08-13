import firebase from "firebase";
import keys from "../config/keys";

const config = {
  apiKey: keys.apiKey,
  authDomain: keys.authDomain,
  databaseURL: keys.databaseURL,
  projectId: keys.projectId,
  storageBucket: keys.storageBucket,
  messagingSenderId: keys.messagingSenderId
};
const settings = { timestampsInSnapshots: true };

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const firebaseFirestore = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();
