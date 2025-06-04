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

// Menu i onAuthStateChanged
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-button");
const userEmailSpan = document.getElementById("user-email");

// Obsługa menu hamburgerowego
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("hidden");
  });
}

// Funkcja wylogowania
function logout() {
  signOut(auth)
    .then(() => {
      alert("Użytkownik został wylogowany.");
      window.location.href = "index.html"; // możesz zmienić na dowolną stronę po wylogowaniu
    })
    .catch((error) => {
      alert("Błąd podczas wylogowywania: " + error.message);
    });
}

// Rejestracja wylogowania przez event delegation (unikamy onclick w HTML)
if (nav) {
  nav.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-link") {
      e.preventDefault();
      logout();
    }
  });
}

// Aktualizacja menu i emaila przy zmianie stanu autoryzacji
if (nav) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      nav.innerHTML = `
        <a href="index.html">Profile publiczne</a>
        <a href="user.html">Moj profil</a>
        <a href="#" id="logout-link">Wyloguj</a>
      `;
      if (userEmailSpan) {
        userEmailSpan.textContent = user.email;
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
}

// Logowanie (na login.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    console.log("emailInput:", emailInput);
    console.log("passwordInput:", passwordInput);

    if (!emailInput || !passwordInput) {
      console.error("Nie znaleziono inputa email lub password");
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch(() => {
        const loginError = document.getElementById("login-error");
        if (loginError) {
          loginError.textContent = "Nieprawidłowy email lub hasło";
          loginError.style.color = "red";
        }
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
        window.location.href = "index.html"; // przekierowanie po rejestracji
      })
      .catch((error) => {
        const registerError = document.getElementById("register-error");
        if (registerError) {
          registerError.textContent = error.message;
          registerError.style.color = "red";
        }
      });
  });
}
