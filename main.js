import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


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
const db = getFirestore(app);

// MENU I WYLOGOWANIE
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-button");

if (nav && menuBtn) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("hidden");
  });

  // Aktualizacja menu w zależności od stanu logowania
  onAuthStateChanged(auth, (user) => {
    nav.innerHTML = "";
    if (user) {
      // Zalogowany - linki + wyloguj (bez onclick, event listener będzie niżej)
      const links = [
        { href: "index.html", text: "Profile publiczne" },
        { href: "user.html", text: "Moj profil" },
      ];
      links.forEach(({ href, text }) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        nav.appendChild(a);
      });
      // Wyloguj jako button/link z id
      const logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.textContent = "Wyloguj";
      logoutLink.id = "logout-button";
      nav.appendChild(logoutLink);

      // Dodaj event listener do wyloguj
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await signOut(auth);
          alert("Użytkownik wylogowany");
          // Możesz przekierować np. na index.html
          window.location.href = "index.html";
        } catch (error) {
          alert("Błąd podczas wylogowania: " + error.message);
        }
      });
    } else {
      // Niezalogowany - linki do logowania i rejestracji
      const links = [
        { href: "index.html", text: "Profile publiczne" },
        { href: "login.html", text: "Zaloguj się" },
        { href: "register.html", text: "Rejestracja" },
      ];
      links.forEach(({ href, text }) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        nav.appendChild(a);
      });
    }
  });
}

// ŁADOWANIE PROFILI NA index.html
async function loadProfiles() {
  const profilesContainer = document.getElementById("profiles-list");
  if (!profilesContainer) return;

  try {
    const querySnapshot = await getDocs(collection(db, "baza"));
    console.log("Pobrano profile:", querySnapshot.size);

    profilesContainer.innerHTML = "";

    if (querySnapshot.empty) {
      profilesContainer.textContent = "Brak profili do wyświetlenia.";
      return;
    }

    querySnapshot.forEach((doc) => {
      const profile = doc.data();
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `profile.html?id=${doc.id}`;
      a.textContent = profile.nazwa || "Brak nazwy";
      li.appendChild(a);
      profilesContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Błąd podczas wczytywania profili:", error);
    profilesContainer.textContent = "Wystąpił błąd podczas ładowania profili.";
  }
}


window.addEventListener("DOMContentLoaded", () => {
  loadProfiles();
});

// LOGOWANIE (login.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

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

// REJESTRACJA (register.html)
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "index.html";
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

// USER.HTML – wyswietlenie emaila zalogowanego uzytkownika
onAuthStateChanged(auth, (user) => {
  const userEmailSpan = document.getElementById("user-email");
  if (user && userEmailSpan) {
    userEmailSpan.textContent = user.email;
    console.log("Zalogowany użytkownik:", user.email); // pomocniczy log
  }
});

import { getDoc, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
  // Tylko na stronie profile.html
  if (!document.getElementById("profile-name")) return;

  const reviewSection = document.getElementById("review-section");
  const reviewForm = document.getElementById("review-form");
  const reviewText = document.getElementById("review-text");
  const reviewsList = document.getElementById("reviews-list");

  // Pobierz ID profilu z URL (np. profile.html?id=abc123)
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get("id");

  if (!profileId) {
    alert("Brak ID profilu w URL");
    return;
  }

  // Załaduj dane profilu (nazwa i opis)
  async function loadProfile() {
    try {
      const docRef = doc(db, "baza", profileId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("profile-name").textContent = data.nazwa || "Brak nazwy";
        document.getElementById("profile-description").textContent = data.opis || "";
      } else {
        alert("Profil nie istnieje");
      }
    } catch (error) {
      console.error("Błąd ładowania profilu:", error);
    }
  }

  // Załaduj recenzje
  async function loadReviews() {
    reviewsList.innerHTML = "";
    try {
      const q = query(
        collection(db, "reviews"),
        where("profileId", "==", profileId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        reviewsList.textContent = "Brak recenzji.";
        return;
      }
      querySnapshot.forEach(doc => {
        const r = doc.data();
        const li = document.createElement("li");
        li.textContent = `${r.email}: ${r.review}`;
        reviewsList.appendChild(li);
      });
    } catch (error) {
      console.error("Błąd ładowania recenzji:", error);
      reviewsList.textContent = "Błąd podczas ładowania recenzji.";
    }
  }

  // Pokaż formularz recenzji tylko gdy zalogowany
  onAuthStateChanged(auth, (user) => {
    if (user) {
      reviewSection.classList.remove("hidden");
    } else {
      reviewSection.classList.add("hidden");
    }
  });

  // Obsługa wysłania formularza recenzji
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = auth.currentUser;
      if (!user) {
        alert("Musisz być zalogowany, żeby dodać recenzję.");
        return;
      }
      const text = reviewText.value.trim();
      if (!text) {
        alert("Recenzja nie może być pusta.");
        return;
      }

      try {
        await addDoc(collection(db, "reviews"), {
          profileId: profileId,
          uid: user.uid,
          email: user.email,
          review: text,
          createdAt: new Date()
        });
        reviewText.value = "";
        loadReviews();
        alert("Recenzja dodana!");
      } catch (error) {
        alert("Błąd podczas dodawania recenzji: " + error.message);
      }
    });
  }

  // Wywołaj ładowanie profilu i recenzji
  loadProfile();
  loadReviews();
});
