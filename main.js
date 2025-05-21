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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-button");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("hidden");
  });
}

document.addEventListener("click", (event) => {
  if (menuBtn && !menuBtn.contains(event.target) && !nav.contains(event.target)) {
    nav.classList.add("hidden");
  }
});


// Funkcja wylogowania
window.logout = function() {
  signOut(auth).catch(error => {
    console.error("Błąd podczas wylogowania:", error);
  });
};

// Obserwowanie zmiany stanu zalogowania
onAuthStateChanged(auth, (user) => {
  if (user) {
    nav.innerHTML = `
      <a href="user.html">Mój profil</a>
      <a href="index.html">Profile publiczne</a>
      <a href="#" onclick="logout()">Wyloguj</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html">Zaloguj się</a>
      <a href="index.html">Profile publiczne</a>
    `;
  }
  nav.classList.add("hidden"); // zamknij menu po aktualizacji
});
