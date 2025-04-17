document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (!token) return (window.location.href = "/login.html");

  const form = document.getElementById("addEmployeeForm");
  const formContainer = document.getElementById("formContainer");
  const tableBody = document.getElementById("employeeTableBody");
  const cardList = document.getElementById("employee-cards");
  const searchInput = document.getElementById("searchInput");
  const desktopAddBtn = document.getElementById("desktopAddBtn");
  const floatBtn = document.getElementById("floatingAddBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const profileInput = form.querySelector('[name="profile_picture"]');
  const resumeInput = form.querySelector('[name="resume_url"]');

  let employees = [];
  let currentEditId = null;

  function showForm() {
    formContainer.style.display = "block";
    if (window.innerWidth >= 769) desktopAddBtn.style.display = "none";
    else floatBtn.style.display = "none";
    formContainer.scrollIntoView({ behavior: "smooth" });
  }

  function hideForm() {
    formContainer.style.display = "none";
    if (window.innerWidth >= 769) desktopAddBtn.style.display = "inline-block";
    else floatBtn.style.display = "flex";
  }

  function resetForm() {
    form.reset();
    currentEditId = null;
    form.querySelectorAll(".preview-info").forEach(e => e.remove());
    form.querySelectorAll('input[type="file"]').forEach(i => i.value = "");
  }

  async function loadEmployees() {
    try {
      const res = await fetch("/api/employees", { headers: { Authorization: `Bearer ${token}` } });
      employees = await res.json();
      renderEmployees(employees);
    } catch (err) {
      console.error("❌ Failed to load employees:", err);
    }
  }

  async function loadDepartments() {
    try {
      const res = await fetch("/api/departments", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const select = document.getElementById("departmentSelect");
      select.innerHTML = `<option value="">Select Department</option>`;
      data.forEach(dep => {
        const opt = new Option(dep.department_name, dep.id); // ✅ FIXED KEY
        select.appendChild(opt);
      });
    } catch (err) {
      console.error("❌ Failed to load departments:", err);
    }
  }

  async function loadRoles() {
    try {
      const res = await fetch("/api/roles", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const select = document.getElementById("roleSelect");
      select.innerHTML = `<option value="">Select Role</option>`;
      data.forEach(role => {
        const opt = new Option(role.role_name, role.id);
        select.appendChild(opt);
      });
    } catch (err) {
      console.error("❌ Failed to load roles:", err);
    }
  }

  function renderEmployees(list) {
    tableBody.innerHTML = "";
    cardList.innerHTML = "";

    list.forEach(emp => {
      const fullName = `${emp.prefix || ""} ${emp.first_name} ${emp.middle_name || ""} ${emp.last_name}`.replace(/\s+/g, ' ').trim();

      const row = `
        <tr data-id="${emp.id}">
          <td>${fullName}</td>
          <td>${emp.email}</td>
          <td>${emp.role_name || '—'}</td>
          <td>${emp.department_name || '—'}</td>
          <td>${emp.employment_status || '—'}</td>
          <td class="actions-table">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);

      const card = `
        <div class="record-card" data-id="${emp.id}">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${emp.email}</p>
          <p><strong>Role:</strong> ${emp.role_name || '—'}</p>
          <p><strong>Department:</strong> ${emp.department_name || '—'}</p>
          <p><strong>Status:</strong> ${emp.employment_status || '—'}</p>
          <div class="card-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </div>
        </div>`;
      cardList.insertAdjacentHTML("beforeend", card);
    });
  }

  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = employees.filter(emp =>
      `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      (emp.department_name || "").toLowerCase().includes(term)
    );
    renderEmployees(filtered);
  });

  desktopAddBtn?.addEventListener("click", showForm);
  floatBtn?.addEventListener("click", showForm);
  cancelBtn?.addEventListener("click", () => {
    resetForm();
    hideForm();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const requiredFields = ["gender", "role_id", "department_id", "employment_status"];
    for (const field of requiredFields) {
      if (!form[field].value) return alert(`❌ Please select ${field.replace(/_/g, " ")}`);
    }

    if (!profileInput.files.length && !currentEditId) return alert("❌ Please upload a profile picture.");
    if (!resumeInput.files.length && !currentEditId) return alert("❌ Please upload a resume file.");

    const formData = new FormData(form);
    const endpoint = currentEditId ? `/api/employees/${currentEditId}` : "/api/employees";
    const method = currentEditId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("❌ Submit failed");
      resetForm();
      hideForm();
      await loadEmployees();
    } catch (err) {
      console.error(err);
    }
  });

  document.body.addEventListener("click", async e => {
    const row = e.target.closest("[data-id]");
    const id = row?.dataset?.id;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    if (e.target.classList.contains("edit") || e.target.classList.contains("btn-edit")) {
      form.prefix.value = emp.prefix || "";
      form.first_name.value = emp.first_name || "";
      form.middle_name.value = emp.middle_name || "";
      form.last_name.value = emp.last_name || "";
      form.email.value = emp.email || "";
      form.phone.value = emp.phone || "";
      form.address.value = emp.address || "";
      form.date_of_birth.value = emp.date_of_birth || "";
      form.gender.value = emp.gender || "";
      form.emergency_contact_name.value = emp.emergency_contact_name || "";
      form.emergency_contact_phone.value = emp.emergency_contact_phone || "";
      form.department_id.value = emp.department_id || "";
      form.role_id.value = emp.role_id || "";
      form.employment_status.value = emp.employment_status || "";
      form.position_title.value = emp.position_title || "";
      form.start_date.value = emp.start_date || "";
      form.end_date.value = emp.end_date || "";
      form.bio.value = emp.bio || "";

      if (emp.profile_picture) {
        const preview = document.createElement("div");
        preview.className = "preview-info";
        preview.innerHTML = `<small><strong>Profile:</strong> ${emp.profile_picture}</small>`;
        profileInput.insertAdjacentElement("afterend", preview);
      }

      if (emp.resume_url) {
        const preview = document.createElement("div");
        preview.className = "preview-info";
        preview.innerHTML = `<small><strong>Resume:</strong> ${emp.resume_url}</small>`;
        resumeInput.insertAdjacentElement("afterend", preview);
      }

      currentEditId = emp.id;
      showForm();
    }

    if (e.target.classList.contains("delete") || e.target.classList.contains("btn-delete")) {
      if (!confirm("Delete this employee?")) return;
      await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadEmployees();
    }
  });

  // 🟦 Floating button drag
  let isDragging = false, moved = false, offset = { x: 0, y: 0 };
  floatBtn?.addEventListener("mousedown", e => {
    e.stopPropagation();
    isDragging = true;
    moved = false;
    offset.x = e.clientX - floatBtn.getBoundingClientRect().left;
    offset.y = e.clientY - floatBtn.getBoundingClientRect().top;
    floatBtn.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    moved = true;
    let x = e.clientX - offset.x;
    let y = e.clientY - offset.y;
    x = Math.max(0, Math.min(x, window.innerWidth - floatBtn.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - floatBtn.offsetHeight));
    floatBtn.style.left = x + "px";
    floatBtn.style.top = y + "px";
    floatBtn.style.position = "fixed";
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    floatBtn.style.cursor = "grab";
    if (!moved) showForm();
  });

  await Promise.all([loadDepartments(), loadRoles(), loadEmployees()]);
});
