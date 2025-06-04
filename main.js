import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSbsC1xbXwdSvwqnvjounLvC-S1OmdICw",
  authDomain: "recenzant-362f1.firebaseapp.com",
  projectId: "recenzant-362f1",
  storageBucket: "recenzant-362f1.appspot.com",  // <- poprawiłem tu
  messagingSenderId: "360185289286",
  appId: "1:360185289286:web:c511ad40fde501a1858847",
  measurementId: "G-DH46ZX2765"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Menu i onAuthStateChanged
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-button");
const userEmailSpan = document.getElementById("user-email");  // nowy element do wyświetlenia emaila

if (nav) {
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("hidden");
    });
  }

  onAuthStateChanged(auth, (user) => {
    nav.innerHTML = user
      ? `
      <a href="index.html">Profile publiczne</a>
      <a href="user.html">Moj profil</a>
      <a href="#" onclick="logout()">Wyloguj</a>
    `
      : `
      <a href="index.html">Profile publiczne</a>
      <a href="login.html">Zaloguj sie</a>
      <a href="register.html">Rejestracja</a>
    `;

    // Wyświetlanie emaila użytkownika, jeśli element istnieje
    if (userEmailSpan) {
      userEmailSpan.textContent = user ? user.email : "Nie zalogowano";
    }
  });
}

function logout() {
  signOut(auth);
}

// Logowanie (na login.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html"; // Przekierowanie po zalogowaniu
      })
      .catch((error) => {
        document.getElementById("login-error").textContent = error.message;
      });
  });
}

// Rejestracja (na register.html)
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html"; // Przekierowanie po rejestracji
      })
      .catch((error) => {
        document.getElementById("register-error").textContent = error.message;
      });
  });
}
