document.getElementById("hospitalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("hospitalName").value;
  const location = document.getElementById("hospitalLocation").value;

  let hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
  hospitals.push({ id: Date.now(), name, location, departments: [] });

  localStorage.setItem("hospitals", JSON.stringify(hospitals));
  alert("Hospital registered!");
  this.reset();
  displayHospitals();
});

function displayHospitals() {
  const list = document.getElementById("hospitalList");
  list.innerHTML = "";
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

  hospitals.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${h.name} (${h.location})`;
    list.appendChild(li);
  });
}

displayHospitals();