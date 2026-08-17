import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyApwG4IG7-kUfWY6iaEYfUyU7r6yCOQEW0",
  authDomain: "study2gether-8620d.firebaseapp.com",
  projectId: "study2gether-8620d",
  storageBucket: "study2gether-8620d.firebasestorage.app",
  messagingSenderId: "650164926871",
  appId: "1:650164926871:web:a960df09e36f6472a8acd2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// EMAIL LOGIN
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
    window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});

// GOOGLE LOGIN
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};
