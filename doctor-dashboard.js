function loadDoctors() {
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const select = document.getElementById("doctorSelect");
  select.innerHTML = doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join("");
}
loadDoctors();

document.getElementById("loadDoctorStats").addEventListener("click", () => {
  const doctorId = document.getElementById("doctorSelect").value;
  const patients = JSON.parse(localStorage.getItem("patients")) || [];
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

  const doctor = doctors.find(d => d.id == doctorId);
  if (!doctor) return alert("Select a doctor");

  let totalConsultations = 0;
  let totalEarnings = 0;
  const earningsByHospital = {};

  patients.forEach(patient => {
    patient.consultations.forEach(c => {
      if (c.doctorId == doctorId) {
        totalConsultations++;
        totalEarnings += (c.fee * 0.6);
        earningsByHospital[c.hospitalId] = (earningsByHospital[c.hospitalId] || 0) + (c.fee * 0.6);
      }
    });
  });

  document.getElementById("totalEarnings").textContent = `₹${totalEarnings.toFixed(2)}`;
  document.getElementById("totalConsultations").textContent = totalConsultations;

  const ul = document.getElementById("earningsByHospital");
  ul.innerHTML = "";
  for (const [hid, amount] of Object.entries(earningsByHospital)) {
    const hospital = hospitals.find(h => h.id == hid);
    ul.innerHTML += `<li>${hospital?.name}: ₹${amount.toFixed(2)}</li>`;
  }
});
