// =====================
// 🧠 INIT (ONLY ONE INIT)
// =====================
window.addEventListener("DOMContentLoaded", () => {
  loadRooms();

  const exploreBtn = document.getElementById("exploreBtn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", openExplore);
  }

  if (joinBtn) {
    joinBtn.addEventListener("click", openJoinPopup);
  }
});


// =====================
// ELEMENTS
// =====================
const panda = document.getElementById("panda");
const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const modal = document.getElementById("createLobbyModal");
const rightPanel = document.getElementById("rightPanel");
const cancelBtn = document.querySelector(".cancel");
const createLobbyBtn = document.querySelector(".create");
const choices = document.querySelectorAll(".choice");


// =====================
// 🐼 PANDA MOVEMENT
// =====================
document.addEventListener("mousemove", (e) => {
  if (!panda) return;

  const r = panda.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  panda.style.transform =
    dist < 120
      ? `translate(-50%, -50%) translate(${-dx * 0.4}px, ${-dy * 0.4}px)`
      : "translate(-50%, -50%)";
});


// =====================
// 🎯 CHOICE BUTTONS
// =====================
choices.forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.querySelectorAll(".choice").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});


// =====================
// 🪟 MODAL CONTROL
// =====================
if (createBtn) {
  createBtn.onclick = () => {
    modal.classList.remove("hidden");
   document.querySelector(".left-panel").classList.add("blur");
document.querySelector(".right-panel").classList.add("blur");
  };
}

if (cancelBtn) {
  cancelBtn.onclick = () => {
    modal.classList.add("hidden");
    document.querySelector(".left-panel").classList.remove("blur");
document.querySelector(".right-panel").classList.remove("blur");
  };
}


// =====================
// 🚀 CREATE LOBBY (FIXED)
// =====================
if (createLobbyBtn) {
  createLobbyBtn.onclick = async () => {

    const lobbyName = document.getElementById("lobbyName").value;
    const subject = document.getElementById("subject").value;

    if (!lobbyName || !subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lobbyName,
          subject,
          mode: document.querySelector("[data-mode].active")?.dataset.mode,
          pace: document.querySelector("[data-pace].active")?.dataset.pace,
          privacy: document.querySelector("[data-privacy].active")?.dataset.privacy
        })
      });

    if (!response.ok) {
  const err = await response.json();
  alert(err.message); // 🔥 shows "Room already exists"
  return;
}

      const data = await response.json();

      alert("Lobby created successfully!");

      // ✅ FIXED HERE
      window.location.href = `room.html?roomId=${data.room._id}`;

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Error creating lobby");
    }
  };
}


// =====================
// 📦 LOAD ROOMS (LEFT PANEL)
// =====================
async function loadRooms() {
  const roomList = document.getElementById("roomList");
  if (!roomList) return;

  roomList.innerHTML = "Loading...";

  try {
    const res = await fetch("http://localhost:5000/api/rooms/search?q=all");
    const rooms = await res.json();

    roomList.innerHTML = "";

    if (!rooms.length) {
      roomList.innerHTML = "No rooms found";
      return;
    }

    rooms.forEach(room => {
      const div = document.createElement("div");
div.classList.add("result-item");

// room name
const name = document.createElement("span");
name.innerText = room.lobbyName;

// delete button
const delBtn = document.createElement("button");
delBtn.innerText = "🗑️";
delBtn.classList.add("delete-btn");

// 👉 DELETE CLICK
delBtn.onclick = async (e) => {
  e.stopPropagation(); // 🔥 prevents opening room

  const confirmDelete = confirm(`Delete "${room.lobbyName}"?`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/rooms/delete/${room._id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    // 🔥 REMOVE FROM UI INSTANTLY
    loadRooms();

  } catch (err) {
    console.error(err);
    alert("Error deleting room");
  }
};

// 👉 click on room (not delete)
div.onclick = () => {
  window.location.href = `room.html?roomId=${room._id}`;
};

div.appendChild(name);
div.appendChild(delBtn);
      roomList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    roomList.innerHTML = "Error loading rooms";
  }
}


// =====================
// 🔍 JOIN POPUP
// =====================
async function openJoinPopup() {
  const popup = document.getElementById("joinPopup");
  const explorePopup = document.getElementById("explorePopup"); // 👈 add
  const resultsDiv = document.getElementById("searchResults");
  const rightPanel = document.getElementById("rightPanel");

  if (!popup || !resultsDiv) return;

  if (explorePopup) explorePopup.classList.add("hidden"); // 👈 CLOSE EXPLORE

  popup.classList.remove("hidden");
  if (rightPanel){
   document.querySelector(".left-panel").classList.add("blur");
document.querySelector(".right-panel").classList.add("blur");
  }  


 
}
const searchInput = document.getElementById("searchInputPopup");

if (searchInput) {
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      const resultsDiv = document.getElementById("searchResults");

      if (!query) return;

      resultsDiv.innerHTML = "Searching...";

      try {
        const res = await fetch(`http://localhost:5000/api/rooms/search?q=${query}`);
        const rooms = await res.json();

        resultsDiv.innerHTML = "";

        if (!rooms.length) {
          resultsDiv.innerHTML = "No rooms found";
          return;
        }

        rooms.forEach(room => {
          const div = document.createElement("div");
          div.classList.add("result-item");
          div.innerText = room.lobbyName;

          div.onclick = () => {
            window.location.href = `room.html?roomId=${room._id}`;
          };

          resultsDiv.appendChild(div);
        });

      } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "Error searching rooms";
      }
    }
  });
}
if(searchInput) {
searchInput.addEventListener("input", () => {
  document.getElementById("searchResults").innerHTML = "";
});
}
// =====================
// 🌍 EXPLORE ROOMS (FIXED)
// =====================
async function openExplore() {
  const popup = document.getElementById("explorePopup");
  const joinPopup = document.getElementById("joinPopup"); // 👈 add
  const resultsDiv = document.getElementById("exploreResults");
 document.querySelector(".left-panel")
document.querySelector(".right-panel")
  if (!popup || !resultsDiv) return;

  if (joinPopup) joinPopup.classList.add("hidden"); // 👈 CLOSE JOIN

  popup.classList.remove("hidden");
  if (rightPanel) {
    document.querySelector(".left-panel").classList.add("blur");
document.querySelector(".right-panel").classList.add("blur");
  }
resultsDiv.innerHTML = "Loading...";

  try {
    const res = await fetch("http://localhost:5000/api/rooms/search?q=all");
    const rooms = await res.json();

    resultsDiv.innerHTML = "";

    if (!rooms.length) {
      resultsDiv.innerHTML = "No rooms available";
      return;
    }

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.classList.add("result-item");
      div.innerText = room.lobbyName;

      div.onclick = () => {
        window.location.href = `room.html?roomId=${room._id}`;
      };

      resultsDiv.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "Error loading rooms";
  }
}
// =====================
// ❌ CLOSE POPUP
// =====================
function closePopup() {
  const popup = document.getElementById("joinPopup");

  if (popup) popup.classList.add("hidden");

  document.querySelector(".left-panel").classList.remove("blur");
  document.querySelector(".right-panel").classList.remove("blur");
}

function closeExplore() {
  const popup = document.getElementById("explorePopup");

  if (popup) popup.classList.add("hidden");

  document.querySelector(".left-panel").classList.remove("blur");
  document.querySelector(".right-panel").classList.remove("blur");
}
window.addEventListener("click", (e) => {
  const joinPopup = document.getElementById("joinPopup");
  const explorePopup = document.getElementById("explorePopup");

  if (e.target === joinPopup || e.target === explorePopup) {
    joinPopup.classList.add("hidden");
    explorePopup.classList.add("hidden");

    document.querySelector(".left-panel").classList.remove("blur");
    document.querySelector(".right-panel").classList.remove("blur");
  }
});
window.addEventListener("DOMContentLoaded", () => {

  const profileBtn = document.getElementById("profileBtn");

  if(profileBtn){
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }

  const raw = localStorage.getItem("profileData");

  if(raw){
    const data = JSON.parse(raw);

    const navAvatar = document.getElementById("navAvatar");

    if(navAvatar){
      navAvatar.src = data.avatar;
    }
  }

});