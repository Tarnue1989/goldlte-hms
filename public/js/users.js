document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (!token) return (window.location.href = "/login.html");

  const form = document.getElementById("userForm");
  const employeeSelect = document.getElementById("employeeSelect");
  const emailInput = form.querySelector('[name="email"]');
  const passwordInput = form.querySelector('[name="password"]');
  const mustChangeCheckbox = form.querySelector('[name="must_change_password"]');
  const roleSelect = form.querySelector('[name="role_id"]');
  const departmentSelect = form.querySelector('[name="department_id"]');
  const cancelBtn = document.getElementById("cancelBtn");
  const desktopAddBtn = document.getElementById("desktopAddBtn");
  const floatBtn = document.getElementById("floatingAddBtn");
  const tableBody = document.getElementById("userTableBody");
  const cardList = document.getElementById("users-cards");
  const searchInput = document.getElementById("searchInput");

  let users = [];
  let employees = [];
  let currentEditId = null;

  function showForm() {
    form.parentElement.style.display = "block";
    if (window.innerWidth >= 769) desktopAddBtn.style.display = "none";
    else floatBtn.style.display = "none";
    form.scrollIntoView({ behavior: "smooth" });
  }

  function hideForm() {
    form.parentElement.style.display = "none";
    if (window.innerWidth >= 769) desktopAddBtn.style.display = "inline-block";
    else floatBtn.style.display = "flex";
  }

  function resetForm() {
    form.reset();
    currentEditId = null;
    emailInput.readOnly = true;
  }

  async function loadUsers() {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      users = await res.json();
      renderUsers(users);
    } catch (err) {
      console.error("❌ Failed to load users:", err);
    }
  }

  async function loadEmployees() {
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      employees = await res.json();

      employeeSelect.innerHTML = `<option value="">Select Employee</option>`;
      employees.forEach(emp => {
        const name = [emp.prefix, emp.first_name, emp.middle_name, emp.last_name]
          .filter(Boolean).join(" ");
        const opt = new Option(name, emp.id);
        employeeSelect.appendChild(opt);
      });
    } catch (err) {
      console.error("❌ Failed to load employees:", err);
    }
  }

  async function loadRoles() {
    const res = await fetch("/api/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    roleSelect.innerHTML = `<option value="">Select Role</option>`;
    data.forEach(r => roleSelect.appendChild(new Option(r.role_name, r.id)));
  }

  async function loadDepartments() {
    const res = await fetch("/api/departments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    departmentSelect.innerHTML = `<option value="">Select Department</option>`;
    data.forEach(d => departmentSelect.appendChild(new Option(d.department_name, d.id)));
  }

  function renderUsers(list) {
    tableBody.innerHTML = "";
    cardList.innerHTML = "";

    list.forEach(user => {
      const statusText = user.account_status === "Active" ? "Active" : "Disabled";
      const statusColor = user.account_status === "Active" ? "green" : "red";

      const row = `
        <tr data-id="${user.id}">
          <td>${user.full_name}</td>
          <td>${user.email}</td>
          <td>${user.role_name || '—'}</td>
          <td>${user.department_name || '—'}</td>
          <td style="color:${statusColor}">${statusText}</td>
          <td class="actions-table">
            <button class="edit">Edit</button>
            <button class="disable">${user.account_status === "Active" ? "Disable" : "Enable"}</button>
            <button class="reset">Reset PW</button>
            <button class="delete">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);

      const card = `
        <div class="record-card" data-id="${user.id}">
          <p><strong>Name:</strong> ${user.full_name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role_name || '—'}</p>
          <p><strong>Department:</strong> ${user.department_name || '—'}</p>
          <p><strong>Status:</strong> <span style="color:${statusColor}">${statusText}</span></p>
          <div class="card-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-disable">${user.account_status === "Active" ? "Disable" : "Enable"}</button>
            <button class="btn-reset">Reset PW</button>
            <button class="btn-delete">Delete</button>
          </div>
        </div>`;
      cardList.insertAdjacentHTML("beforeend", card);
    });
  }

  employeeSelect?.addEventListener("change", () => {
    const selected = employees.find(e => e.id === employeeSelect.value);
    if (selected) {
      emailInput.value = selected.email;
    } else {
      emailInput.value = "";
    }
  });

  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = users.filter(u =>
      u.full_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
    renderUsers(filtered);
  });

  desktopAddBtn?.addEventListener("click", showForm);
  floatBtn?.addEventListener("click", showForm);
  cancelBtn?.addEventListener("click", () => {
    resetForm();
    hideForm();
  });

form.addEventListener("submit", async e => {
  e.preventDefault();
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;

  const payload = {
    employee_id: form.employee_id.value,
    email: form.email.value,
    password: form.password.value || undefined,
    role_id: form.role_id.value,
    department_id: form.department_id.value,
    must_change_password: form.must_change_password.checked,
  };

  const method = currentEditId ? "PUT" : "POST";
  const endpoint = currentEditId ? `/api/users/${currentEditId}` : "/api/users";

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("❌ Submit failed");

    resetForm();
    hideForm();
    await loadUsers();
  } catch (err) {
    console.error("❌ Error submitting user form:", err);
    alert("Failed to submit user. Please try again.");
  } finally {
    submitBtn.disabled = false;
  }
});


  document.body.addEventListener("click", async e => {
    const row = e.target.closest("[data-id]");
    const id = row?.dataset?.id;
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (e.target.classList.contains("edit") || e.target.classList.contains("btn-edit")) {
      form.employee_id.value = user.employee_id || "";
      emailInput.value = user.email || "";
      roleSelect.value = user.role_id || "";
      departmentSelect.value = user.department_id || "";
      mustChangeCheckbox.checked = !!user.must_change_password;
      passwordInput.value = "";
      currentEditId = user.id;
      showForm();
    }

    if (e.target.classList.contains("disable") || e.target.classList.contains("btn-disable")) {
      const confirmMsg = user.account_status === "Active" ? "Disable this user?" : "Enable this user?";
      if (!confirm(confirmMsg)) return;
      try {
        await fetch(`/api/users/${id}/toggle-status`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        await loadUsers();
      } catch (err) {
        console.error("❌ Failed to toggle status:", err);
      }
    }

    if (e.target.classList.contains("reset") || e.target.classList.contains("btn-reset")) {
      if (!confirm("Reset password to default (ChangeMe123!)?")) return;
      try {
        await fetch(`/api/users/${id}/reset-password`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Password reset to ChangeMe123!");
      } catch (err) {
        console.error("❌ Failed to reset password:", err);
      }
    }

    if (e.target.classList.contains("delete") || e.target.classList.contains("btn-delete")) {
      if (!confirm("Delete this user?")) return;
      try {
        await fetch(`/api/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await loadUsers();
      } catch (err) {
        console.error("❌ Failed to delete user:", err);
      }
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

  await Promise.all([loadUsers(), loadEmployees(), loadRoles(), loadDepartments()]);
});
