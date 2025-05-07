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
      <a href="review.html">Dodaj recenzję</a>
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
      li.innerHTML = `<strong>${p.name}</strong> (${p.category})`;
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
  window.location.href = "index.html";
}

window.onload = function () {
  renderMenu();
  loadProfiles();
};