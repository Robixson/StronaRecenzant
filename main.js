// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSbsC1xbXwdSvwqnvjounLvC-S1OmdICw",
  authDomain: "recenzant-362f1.firebaseapp.com",
  projectId: "recenzant-362f1",
  storageBucket: "recenzant-362f1.firebasestorage.app",
  messagingSenderId: "360185289286",
  appId: "1:360185289286:web:c511ad40fde501a1858847",
  measurementId: "G-DH46ZX2765"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const nav = document.getElementById("nav");

onAuthStateChanged(auth, (user) => {
  if (!nav) return;
  nav.innerHTML = user
    ? `
      <a href="index.html">Strona główna</a>
      <a href="user.html">Mój profil</a>
      <a href="#" onclick="logout()">Wyloguj</a>
    `
    : `
      <a href="index.html">Strona główna</a>
      <a href="login.html">Zaloguj</a>
      <a href="register.html">Rejestracja</a>
    `;
});

// Funkcja wylogowania
window.logout = function() {
  signOut(auth).catch(error => {
    console.error("Błąd podczas wylogowania:", error);
  });
};
