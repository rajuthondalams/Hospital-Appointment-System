let currentDoctor = null;

// Load hospitals into the hospital select dropdown
function loadHospitals() {
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
  const select = document.getElementById("hospitalSelect");
  if (!select) return;
  if (hospitals.length === 0) {
    select.innerHTML = `<option disabled>No hospitals available</option>`;
  } else {
    select.innerHTML = hospitals
      .map(h => `<option value="${h.id}">${h.name}</option>`)
      .join("");
  }
}

// Register new doctor
document.getElementById("doctorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("doctorName").value.trim();
  const qualifications = document.getElementById("qualifications").value.trim();
  const specializationsInput = document.getElementById("specializations").value.trim();
  const experience = parseInt(document.getElementById("experience").value);

  if (!name || !qualifications || !specializationsInput || isNaN(experience)) {
    alert("Please fill all fields correctly");
    return;
  }

  const specializations = specializationsInput.split(",").map(s => s.trim());

  const doctor = {
    id: Date.now(),
    name,
    qualifications,
    specializations,
    experience,
    associations: [] // will store hospital associations and availability
  };

  let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  doctors.push(doctor);
  localStorage.setItem("doctors", JSON.stringify(doctors));

  currentDoctor = doctor;

  alert("Doctor registered successfully!");
  this.reset();
  loadHospitals();
  displayAvailability();
});

// Handle associating doctor with hospital and adding availability
document.getElementById("associateForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentDoctor) {
    alert("Please register yourself first as a doctor.");
    return;
  }

  const hospitalId = document.getElementById("hospitalSelect").value;
  const specialization = document.getElementById("associatedSpecializations").value.trim();
  const consultationFee = parseFloat(document.getElementById("consultationFee").value);
  const slot = document.getElementById("availableSlot").value;

  if (!hospitalId || !specialization || isNaN(consultationFee) || !slot) {
    alert("Please fill all fields correctly");
    return;
  }

  // Optional: Validate that specialization is among doctor's specializations
  if (!currentDoctor.specializations.includes(specialization)) {
    alert(`Specialization must be one of your registered specializations: ${currentDoctor.specializations.join(", ")}`);
    return;
  }

  // Check slot conflict for this doctor (exact match)
  if (checkSlotConflict(slot)) {
    alert("This time slot conflicts with an existing availability.");
    return;
  }

  // Add the association
  currentDoctor.associations.push({
    hospitalId,
    specialization,
    consultationFee,
    slot
  });

  updateDoctorInStorage(currentDoctor);
  alert("Associated with hospital and availability added successfully!");
  this.reset();
  displayAvailability();
});

// Update doctor object in localStorage
function updateDoctorInStorage(updatedDoctor) {
  let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const idx = doctors.findIndex(d => d.id === updatedDoctor.id);
  if (idx !== -1) {
    doctors[idx] = updatedDoctor;
  } else {
    doctors.push(updatedDoctor);
  }
  localStorage.setItem("doctors", JSON.stringify(doctors));
}

// Check if new slot conflicts with existing slots for currentDoctor
function checkSlotConflict(newSlot) {
  if (!currentDoctor) return false;
  return currentDoctor.associations.some(a => a.slot === newSlot);
}

// Display current availability slots for this doctor
function displayAvailability() {
  const availabilityList = document.getElementById("availabilityList");
  if (!availabilityList) return;

  availabilityList.innerHTML = "";

  if (!currentDoctor || !currentDoctor.associations.length) {
    availabilityList.innerHTML = "<li>No availability slots added yet.</li>";
    return;
  }

  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

  currentDoctor.associations.forEach(assoc => {
    const hospital = hospitals.find(h => h.id == assoc.hospitalId);
    const li = document.createElement("li");
    li.textContent = `Hospital: ${hospital ? hospital.name : "Unknown"}, Specialization: ${assoc.specialization}, Fee: ₹${assoc.consultationFee.toFixed(2)}, Slot: ${new Date(assoc.slot).toLocaleString()}`;
    availabilityList.appendChild(li);
  });
}

// Initial load
loadHospitals();
displayAvailability();
