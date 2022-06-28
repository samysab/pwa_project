import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  ref,
  push,
  serverTimestamp,
  onValue,
  onChildAdded,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

import firebaseConfig from "./firebase.json";

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);

export function writeComment({ message, product }) {
  const key = push(ref(database, "/comments"));

  set(key, Comment({ message, product }));
}

export async function getComments(cb = () => {}) {
  const comments = [];
  onChildAdded(ref(database, "/comments"), (snapshot) => {
    comments.push({ ...snapshot.val(), key: snapshot.key });
    cb(comments);
  });
}

function Comment({ message, product, user }) {
  return {
    message,
    productId: product,
    date: serverTimestamp(),
  };
}

export function getUser() {
  return auth.currentUser;
}

export function getAuthState(cb = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (user) return cb(user);
    cb(false);
  });
}

export function registerUser(email, password) {
  return setPersistence(auth, browserLocalPersistence).then(() => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (user) => user
    );
  });
}
