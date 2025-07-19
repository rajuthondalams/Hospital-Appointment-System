let currentPatient = null;

document.getElementById("patientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const uniqueId = document.getElementById("uniqueId").value.trim();

  if (!name || !dob || !uniqueId) {
    alert("Please fill all fields");
    return;
  }

  currentPatient = {
    id: Date.now(),
    name,
    gender,
    dob,
    uniqueId,
    consultations: []
  };

  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  patients.push(currentPatient);
  localStorage.setItem("patients", JSON.stringify(patients));

  alert("Patient registered!");
  this.reset();
  displayConsultations();
});

// Updated search form handler
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const specFilter = document.getElementById("filterSpecialization").value.trim().toLowerCase();
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

  const results = [];

  doctors.forEach(doctor => {
    if (!doctor.associations) return;

    doctor.associations.forEach(assoc => {
      if (!specFilter || assoc.specialization.toLowerCase().includes(specFilter)) {
        const hospital = hospitals.find(h => h.id == assoc.hospitalId);
        if (hospital) {
          results.push({
            doctorId: doctor.id,
            doctorName: doctor.name,
            hospitalName: hospital.name,
            specialization: assoc.specialization,
            slot: assoc.slot,
            fee: assoc.consultationFee,
            hospitalId: assoc.hospitalId
          });
        }
      }
    });
  });

  displaySearchResults(results);
});

function displaySearchResults(results) {
  const ul = document.getElementById("searchResults");
  ul.innerHTML = "";

  if (results.length === 0) {
    ul.innerHTML = "<li>No doctors found matching your criteria.</li>";
    return;
  }

  results.forEach(item => {
    const li = document.createElement("li");

    // Create button with event listener, no inline onclick
    const btn = document.createElement("button");
    btn.textContent = "Book";
    btn.addEventListener("click", () => {
      bookConsultation(item.doctorId, item.slot, item.fee, item.hospitalId, item.specialization);
    });

    li.innerHTML = `
      Dr. ${item.doctorName} (${item.specialization}) at ${item.hospitalName}<br>
      Time: ${new Date(item.slot).toLocaleString()} | Fee: ₹${item.fee}
    `;
    li.appendChild(document.createElement("br"));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function bookConsultation(doctorId, slot, fee, hospitalId, specialization) {
  if (!currentPatient) {
    alert("Please register as a patient before booking.");
    return;
  }

  // Check if slot already booked by patient (optional)
  if (currentPatient.consultations.some(c => c.slot === slot && c.doctorId === doctorId)) {
    alert("You already booked this appointment slot.");
    return;
  }

  // Save consultation
  const consultation = {
    doctorId,
    hospitalId,
    slot,
    specialization,
    fee,
    date: new Date().toISOString()
  };

  currentPatient.consultations.push(consultation);

  // Save updated patient to localStorage
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  const index = patients.findIndex(p => p.id === currentPatient.id);
  if (index !== -1) {
    patients[index] = currentPatient;
  }
  localStorage.setItem("patients", JSON.stringify(patients));

  alert("Appointment booked successfully!");
  displayConsultations();
}

function displayConsultations() {
  const ul = document.getElementById("consultationHistory");
  ul.innerHTML = "";
  if (!currentPatient) return;

  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

  currentPatient.consultations.forEach(c => {
    const doctor = doctors.find(d => d.id == c.doctorId);
    const hospital = hospitals.find(h => h.id == c.hospitalId);
    const li = document.createElement("li");
    li.innerHTML = `
      Dr. ${doctor ? doctor.name : 'Unknown'} | ${hospital ? hospital.name : 'Unknown'} |
      ₹${c.fee} | Slot: ${new Date(c.slot).toLocaleString()}
    `;
    ul.appendChild(li);
  });
}
