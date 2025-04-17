document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (!token) return (window.location.href = "/login.html");

  const form = document.getElementById("addDepartmentForm");
  const formContainer = document.getElementById("formContainer");
  const tableBody = document.getElementById("departmentTableBody");
  const cardList = document.getElementById("department-cards");
  const searchInput = document.getElementById("searchInput");
  const cancelBtn = document.getElementById("cancelBtn");
  const floatBtn = document.getElementById("floatingAddBtn");
  const desktopAddBtn = document.getElementById("desktopAddBtn");
  const headSelect = document.getElementById("headSelect");

  let departments = [];
  let employees = [];
  let currentEditId = null;

  function showForm() {
    formContainer.style.display = "block";
    if (window.innerWidth >= 769) {
      desktopAddBtn.style.display = "none";
    } else {
      floatBtn.style.display = "none";
    }
    formContainer.scrollIntoView({ behavior: "smooth" });
  }

  function hideForm() {
    formContainer.style.display = "none";
    if (window.innerWidth >= 769) {
      desktopAddBtn.style.display = "inline-block";
    } else {
      floatBtn.style.display = "flex";
    }
  }

  function resetForm() {
    form.reset();
    currentEditId = null;
    headSelect.value = "";
  }

  async function loadEmployees() {
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      employees = await res.json();
      headSelect.innerHTML = `<option value="">Select Head of Department</option>`;
      employees.forEach(emp => {
        const name = [emp.prefix, emp.first_name, emp.middle_name, emp.last_name]
          .filter(Boolean).join(" ").trim();
        headSelect.insertAdjacentHTML("beforeend", `<option value="${emp.id}">${name}</option>`);
      });
    } catch (err) {
      console.error("❌ Failed to load employees:", err);
    }
  }

  async function loadDepartments() {
    try {
      const res = await fetch("/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      departments = await res.json();
      renderDepartments(departments);
    } catch (err) {
      console.error("❌ Failed to load departments:", err);
    }
  }

  function renderDepartments(list) {
    tableBody.innerHTML = "";
    cardList.innerHTML = "";

    list.forEach(dep => {
      const head = dep.head_of_department?.full_name || "—";
      const description = dep.description || "—";

      const row = `
        <tr data-id="${dep.id}">
          <td>${dep.department_name}</td>
          <td>${description}</td>
          <td>${head}</td>
          <td class="actions-table">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);

      const card = `
        <div class="record-card" data-id="${dep.id}">
          <p><strong>Department:</strong> ${dep.department_name}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Head:</strong> ${head}</p>
          <div class="card-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </div>
        </div>`;
      cardList.insertAdjacentHTML("beforeend", card);
    });
  }

  searchInput?.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = departments.filter(dep =>
      dep.department_name.toLowerCase().includes(value)
    );
    renderDepartments(filtered);
  });

  desktopAddBtn?.addEventListener("click", showForm);
  floatBtn?.addEventListener("click", showForm);
  cancelBtn?.addEventListener("click", () => {
    resetForm();
    hideForm();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      department_name: formData.get("department_name")?.trim(),
      description: formData.get("description")?.trim(),
      head_of_department_id: formData.get("head_of_department_id") || null,
    };
    if (!payload.department_name) return;

    const method = currentEditId ? "PUT" : "POST";
    const endpoint = currentEditId
      ? `/api/departments/${currentEditId}`
      : "/api/departments";

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
      await loadDepartments();
    } catch (err) {
      console.error("❌ Failed to save:", err);
    }
  });

  document.body.addEventListener("click", async (e) => {
    const row = e.target.closest("[data-id]");
    const id = row?.dataset?.id;
    if (!id) return;

    if (e.target.classList.contains("edit") || e.target.classList.contains("btn-edit")) {
      const dep = departments.find(d => d.id === id);
      if (!dep) return;
      form.querySelector("[name='department_name']").value = dep.department_name;
      form.querySelector("[name='description']").value = dep.description || "";
      headSelect.value = dep.head_of_department_id || "";
      currentEditId = id;
      showForm();
    }

    if (e.target.classList.contains("delete") || e.target.classList.contains("btn-delete")) {
      if (!confirm("Are you sure you want to delete this department?")) return;
      try {
        await fetch(`/api/departments/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await loadDepartments();
      } catch (err) {
        console.error("❌ Failed to delete:", err);
      }
    }
  });

  // Floating button drag support
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

  await loadEmployees();
  await loadDepartments();
});
