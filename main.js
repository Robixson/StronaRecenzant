const firebaseConfig = {
  apiKey: "AIzaSyCSbsC1xbXwdSvwqnvjounLvC-S1OmdICw",
  authDomain: "recenzant-362f1.firebaseapp.com",
  projectId: "recenzant-362f1",
  storageBucket: "recenzant-362f1.firebasestorage.app",
  messagingSenderId: "360185289286",
  appId: "1:360185289286:web:c511ad40fde501a1858847",
  measurementId: "G-DH46ZX2765"
};

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

