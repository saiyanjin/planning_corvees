const users = ["vincent", "david", "thomas", "christophe", "personne"];
const yearSelect = document.getElementById("yearSelect");
const tbody = document.querySelector("#planningTable tbody");

for (let y = 2014; y <= 2017; y++) {
  const option = document.createElement("option");
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}

function generateSemaines(year) {
  const semaines = [];
  let date = new Date(year, 0, 5); 
  for (let i = 0; i < 52; i++) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const fullDate = `${day}/${month}/${year}`;
    semaines.push(fullDate);
    date.setDate(date.getDate() + 7);
  }
  return semaines;
}

function fillTable(year) {
  tbody.innerHTML = ""; 
  const semaines = generateSemaines(year);

  let row;
  semaines.forEach((date, index) => {
    if (index % 4 === 0) {
      row = document.createElement("tr");
      tbody.appendChild(row);
    }

    const td = document.createElement("td");
    td.innerHTML = `
      ${date}<br>
      <select class="user ${users[index % users.length]}">
        ${users.map(u => `<option value="${u}" ${u === users[index % users.length] ? "selected" : ""}>${u}</option>`).join("")}
      </select>
    `;

    td.querySelector("select").addEventListener("change", e => {
      e.target.className = `user ${e.target.value}`;
    });

    row.appendChild(td);
  });
}

//Avant : fillTable(Number(yearSelect.value));
//Ajout : on charge le planning depuis le BACKEND
loadPlanning(Number(yearSelect.value));
loadStats(Number(yearSelect.value));

//Avant : yearSelect.addEventListener("change", () => {
//          fillTable(Number(yearSelect.value));
//        });
//Ajout : on recharge le planning depuis MongoDB
yearSelect.addEventListener("change", () => {
  loadPlanning(Number(yearSelect.value));
  loadStats(Number(yearSelect.value));
});


const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {
  const rows = document.querySelectorAll("#planningTable tbody tr");
  const semaines = [];

  rows.forEach(row => {
    row.querySelectorAll("td").forEach(td => {
      const date = td.firstChild.textContent.trim();
      const assigneA = td.querySelector("select").value;
      semaines.push({ date, assigneA });
    });
  });

  const year = Number(yearSelect.value);

  try {
    const res = await fetch("http://localhost:3000/api/planning/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, semaines })
    });
    const data = await res.json();
    if (data.success) {
      alert("Planning sauvegardé !");
      const year = Number(yearSelect.value);
      loadPlanning(year);
      loadStats(year);
    }

    else alert(data.message);
  } catch (err) {
    alert("Erreur réseau : " + err.message);
  }
});


//Ajout : fonction qui charge le planning depuis MongoDB
async function loadPlanning(year) {
  try {
    const res = await fetch(`http://localhost:3000/api/planning/${year}`);

    if (!res.ok) {
      console.warn("Planning non trouvé pour", year);
      fillTable(year);
      return;
    }

    const data = await res.json();

    if (!data.semaines || data.semaines.length === 0) {
      fillTable(year);
      return;
    }

    tbody.innerHTML = "";
    let row;

    data.semaines.forEach((s, index) => {
      if (index % 4 === 0) {
        row = document.createElement("tr");
        tbody.appendChild(row);
      }

      const dateObj = new Date(s.date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const fullDate = `${day}/${month}/${year}`;

      const td = document.createElement("td");
      td.innerHTML = `
        ${fullDate}<br>
        <select class="user ${s.assigneA}">
          ${users.map(u => `<option value="${u}" ${u === s.assigneA ? "selected" : ""}>${u}</option>`).join("")}
        </select>
      `;

      td.querySelector("select").addEventListener("change", e => {
        e.target.className = `user ${e.target.value}`;
      });

      row.appendChild(td);
    });

  } catch (err) {
    console.error("Erreur chargement planning :", err);
    fillTable(year);
  }
}

//Ajout : système de connexion
async function login() {
  const prenom = document.getElementById("loginPrenom").value;
  const mdp = document.getElementById("loginMdp").value;

  const res = await fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prenom, mdp })
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  localStorage.setItem("user", prenom);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// Statistiques par ordre croissant

async function loadStats(year) {
  const statsList = document.getElementById("statsList");
  statsList.innerHTML = "";

  try {
    const res = await fetch(`http://localhost:3000/api/stats/${year}`);
    const stats = await res.json();

    stats.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s._id} : ${s.total} semaines`;
      statsList.appendChild(li);
    });

  } catch (err) {
    console.error("Erreur chargement stats :", err);
  }
}
