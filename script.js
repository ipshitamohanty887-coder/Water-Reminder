document.addEventListener("DOMContentLoaded", () => {
  const timeInput = document.getElementById("reminder-time");
  const setBtn = document.querySelector("button");
  const trackerTable = document.getElementById("tracker-table");

  // 🔹 Request notification permission
  if ("Notification" in window) {
    Notification.requestPermission();
  }

  // Reminder Page
  if (timeInput && setBtn) {
    timeInput.value = localStorage.getItem("reminderTime") || "";
    setBtn.onclick = () => {
      if (!timeInput.value) return alert("⚠ Select time!");
      localStorage.setItem("reminderTime", timeInput.value);

      let data = JSON.parse(localStorage.getItem("trackerData")) || [];
      data.push({ time: timeInput.value, amount: "250 ml" });
      localStorage.setItem("trackerData", JSON.stringify(data));

      alert(`✅ Reminder set for ${timeInput.value}`);
    };
  }

  // Tracker Page
  if (trackerTable) {
    let data = JSON.parse(localStorage.getItem("trackerData")) || [];
    const render = () => {
      trackerTable.innerHTML = "<tr><th>Time</th><th>Amount</th><th>Action</th></tr>";
      data.forEach((e, i) => {
        trackerTable.innerHTML += `
          <tr>
            <td>${e.time}</td>
            <td>${e.amount}</td>
            <td><button onclick="removeEntry(${i})">❌ Remove</button></td>
          </tr>`;
      });
    };
    window.removeEntry = i => { data.splice(i, 1); localStorage.setItem("trackerData", JSON.stringify(data)); render(); };
    render();
  }

  // 🔹 Notification check every minute
  setInterval(() => {
    let reminderTime = localStorage.getItem("reminderTime");
    if (!reminderTime) return;

    let now = new Date();
    let currentTime = now.toTimeString().slice(0, 5);

    if (currentTime === reminderTime) {
      if (Notification.permission === "granted") {
        new Notification("💧 Water Reminder", {
          body: "Time to drink water! Stay hydrated 💦",
          icon: "https://cdn-icons-png.flaticon.com/512/4150/4150911.png"
        });
      } else {
        alert("💧 Time to drink water! Stay hydrated 💦");
      }
    }
  }, 60000); // check every 1 min

});

