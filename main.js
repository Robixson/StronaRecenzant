import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSbsC1xbXwdSvwqnvjounLvC-S1OmdICw",
  authDomain: "recenzant-362f1.firebaseapp.com",
  projectId: "recenzant-362f1",
  storageBucket: "recenzant-362f1.appspot.com",
  messagingSenderId: "360185289286",
  appId: "1:360185289286:web:c511ad40fde501a1858847",
  measurementId: "G-DH46ZX2765",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elementy DOM
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-button");
const userEmailSpan = document.getElementById("user-email");

// Menu - toggle
if (nav && menuBtn) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("hidden");
  });
}

// Aktualizacja menu i emaila przy zmianie stanu użytkownika
onAuthStateChanged(auth, (user) => {
  if (!nav) return;

  if (user) {
    nav.innerHTML = `
      <a href="index.html">Profile publiczne</a>
      <a href="user.html">Moj profil</a>
      <a href="#" id="logout-link">Wyloguj</a>
    `;

    if (userEmailSpan) {
      userEmailSpan.textContent = user.email;
    }

    // Podpięcie event listenera do wylogowania (bo link jest teraz dynamiczny)
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    nav.innerHTML = `
      <a href="index.html">Profile publiczne</a>
      <a href="login.html">Zaloguj sie</a>
      <a href="register.html">Rejestracja</a>
    `;

    if (userEmailSpan) {
      userEmailSpan.textContent = "Nie zalogowano";
    }
  }
});

// Funkcja wylogowania
function logout() {
  signOut(auth)
    .then(() => {
      alert("Uzytkownik wylogowany.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Blad przy wylogowywaniu: " + error.message);
    });
}

// Logowanie (na login.html)
const loginForm = document.getElementById("login-form");
const loginErrorDiv = document.getElementById("login-error");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (loginErrorDiv) loginErrorDiv.textContent = "";

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        if (loginErrorDiv) {
          if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
          ) {
            loginErrorDiv.textContent = "Nieprawidłowy email lub hasło";
          } else if (error.code === "auth/invalid-email") {
            loginErrorDiv.textContent = "Nieprawidłowy format emaila";
          } else {
            loginErrorDiv.textContent = error.message;
          }
        }
      });
  });
}

// Rejestracja (na register.html)
const registerForm = document.getElementById("register-form");
const registerErrorDiv = document.getElementById("register-error");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    if (registerErrorDiv) registerErrorDiv.textContent = "";

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        if (registerErrorDiv) {
          if (error.code === "auth/email-already-in-use") {
            registerErrorDiv.textContent = "Email juz jest uzyty";
          } else if (error.code === "auth/invalid-email") {
            registerErrorDiv.textContent = "Nieprawidlowy format emaila";
          } else if (error.code === "auth/weak-password") {
            registerErrorDiv.textContent = "Haslo jest zbyt slabe";
          } else {
            registerErrorDiv.textContent = error.message;
          }
        }
      });
  });
}
