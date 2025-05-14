const profiles = [
  { id: "1", name: "Anna Nowak", category: "Polityk", reviews: [] },
  { id: "2", name: "Firma XYZ", category: "Sprzedawca", reviews: [] }
];

function renderMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;
  const isLoggedIn = localStorage.getItem("user");
  menu.innerHTML = `
    <a href="index.html">Strona główna</a>
    ${isLoggedIn ? `
      <a href="user.html">Mój profil</a>
      <a href="#" onclick="logout()">Wyloguj</a>
    ` : `
      <a href="login.html">Zaloguj / Rejestracja</a>
    `}
  `;
}

function loadProfiles() {
  const list = document.getElementById("profiles-list");
  if (list) {
    profiles.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="profile.html?id=${p.id}"><strong>${p.name}</strong> (${p.category})</a>`;
      list.appendChild(li);
    });
  }
}

function login(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (email && password) {
    localStorage.setItem("user", email);
    alert("Zalogowano");
    window.location.href = "index.html";
  }
}

function register(e) {
  e.preventDefault();
  alert("Zarejestrowano (symulacja)");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("user");
  alert("Wylogowano");
  window.location.href = "index.html";
}

function addReview(e) {
  e.preventDefault();
  if (!localStorage.getItem("user")) {
    alert("Zaloguj się, aby dodać recenzję.");
    return;
  }
  const rating = document.getElementById("review-rating").value;
  const comment = document.getElementById("review-comment").value;
  alert(`Dodano recenzję: ${rating}/5 – "${comment}"`);
  window.location.reload();
}

function getProfileById(id) {
  return profiles.find(p => p.id === id);
}

function renderProfile() {
  const params = new URLSearchParams(window.location.search);
  const profile = getProfileById(params.get("id"));
  if (profile) {
    document.getElementById("profile-name").innerText = profile.name;
    document.getElementById("profile-category").innerText = profile.category;
    renderReviews(profile.reviews);
    if (localStorage.getItem("user")) {
      document.getElementById("add-review-container").style.display = "block";
    }
  }
}

function renderReviews(reviews) {
  const list = document.getElementById("review-list");
  if (!list) return;
  list.innerHTML = "";
  reviews.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.rating}/5 – ${r.comment}`;
    list.appendChild(li);
  });
}

function buyVIP() {
  alert("Zakupiono VIPa! (symulacja) Możesz teraz dodać swój profil do ocen.");
}

window.onload = function () {
  renderMenu();
  loadProfiles();
  if (window.location.pathname.includes("profile.html")) {
    renderProfile();
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyCSbsC1xbXwdSvwqnvjounLvC-S1OmdICw",
  authDomain: "recenzant-362f1.firebaseapp.com",
  projectId: "recenzant-362f1",
  storageBucket: "recenzant-362f1.firebasestorage.app",
  messagingSenderId: "360185289286",
  appId: "1:360185289286:web:c511ad40fde501a1858847",
  measurementId: "G-DH46ZX2765"
};
