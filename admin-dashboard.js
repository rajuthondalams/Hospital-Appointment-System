function loadHospitals() {
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
  const select = document.getElementById("hospitalSelect");
  select.innerHTML = hospitals.map(h => `<option value="${h.id}">${h.name}</option>`).join("");
}
loadHospitals();

document.getElementById("loadStats").addEventListener("click", () => {
  const hospitalId = document.getElementById("hospitalSelect").value;
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const patients = JSON.parse(localStorage.getItem("patients")) || [];
  const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

  const hospital = hospitals.find(h => h.id == hospitalId);
  if (!hospital) return alert("Select a hospital");

  // Filter doctors associated with this hospital
  const hospitalDoctors = doctors.filter(doc =>
    doc.associations.some(a => a.hospitalId == hospitalId)
  );

  // Display doctor list
  const doctorsList = document.getElementById("doctorsList");
  doctorsList.innerHTML = hospitalDoctors.map(d => `<li>${d.name}</li>`).join("");

  // Consultations & revenue calculations
  let totalConsultations = 0;
  let totalRevenue = 0;
  const revenueByDoctor = {};
  const revenueByDepartment = {};

  patients.forEach(patient => {
    patient.consultations.forEach(c => {
      if (c.hospitalId == hospitalId) {
        totalConsultations++;
        totalRevenue += c.fee;

        // Revenue per doctor
        const doc = doctors.find(d => d.id == c.doctorId);
        if (doc) {
          revenueByDoctor[doc.name] = (revenueByDoctor[doc.name] || 0) + c.fee;
          // Revenue per department = specialization
          revenueByDepartment[c.specialization] = (revenueByDepartment[c.specialization] || 0) + c.fee;
        }
      }
    });
  });

  document.getElementById("totalConsultations").textContent = totalConsultations;
  document.getElementById("totalRevenue").textContent = `₹${totalRevenue.toFixed(2)}`;

  const revDoctorList = document.getElementById("revenuePerDoctor");
  revDoctorList.innerHTML = Object.entries(revenueByDoctor).map(([doc, rev]) => {
    return `<li>${doc}: ₹${(rev * 0.4).toFixed(2)} (Hospital's 40%)</li>`;
  }).join("");

  const revDeptList = document.getElementById("revenuePerDepartment");
  revDeptList.innerHTML = Object.entries(revenueByDepartment).map(([dept, rev]) => {
    return `<li>${dept}: ₹${(rev * 0.4).toFixed(2)} (Hospital's 40%)</li>`;
  }).join("");
});

