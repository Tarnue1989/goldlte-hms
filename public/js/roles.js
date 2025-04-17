document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (!token) return (window.location.href = "/login.html");

  const form = document.getElementById("roleForm");
  const formContainer = document.getElementById("formContainer");
  const tableBody = document.getElementById("roleTableBody");
  const cardList = document.getElementById("role-cards");
  const searchInput = document.getElementById("searchInput");
  const desktopAddBtn = document.getElementById("desktopAddBtn");
  const floatBtn = document.getElementById("floatingAddBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  let roles = [];
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
  }

  async function loadRoles() {
    try {
      const res = await fetch("/api/roles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      roles = await res.json();
      renderRoles(roles);
    } catch (err) {
      console.error("❌ Failed to load roles:", err);
    }
  }

  function renderRoles(list) {
    tableBody.innerHTML = "";
    cardList.innerHTML = "";

    list.forEach(role => {
      const desc = role.description || "—";

      const row = `
        <tr data-id="${role.id}">
          <td>${role.role_name}</td>
          <td>${desc}</td>
          <td class="actions-table">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);

      const card = `
        <div class="record-card" data-id="${role.id}">
          <p><strong>Role:</strong> ${role.role_name}</p>
          <p><strong>Description:</strong> ${desc}</p>
          <div class="card-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </div>
        </div>`;
      cardList.insertAdjacentHTML("beforeend", card);
    });
  }

  desktopAddBtn?.addEventListener("click", showForm);
  floatBtn?.addEventListener("click", showForm);
  cancelBtn?.addEventListener("click", () => {
    resetForm();
    hideForm();
  });

  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = roles.filter(r =>
      r.role_name.toLowerCase().includes(term) || (r.description || "").toLowerCase().includes(term)
    );
    renderRoles(filtered);
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      role_name: formData.get("role_name")?.trim(),
      description: formData.get("description")?.trim() || null
    };
    if (!payload.role_name) return;

    const method = currentEditId ? "PUT" : "POST";
    const endpoint = currentEditId ? `/api/roles/${currentEditId}` : "/api/roles";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("❌ Submit failed");
      resetForm();
      hideForm();
      await loadRoles();
    } catch (err) {
      console.error(err);
    }
  });

  document.body.addEventListener("click", async e => {
    const row = e.target.closest("[data-id]");
    const id = row?.dataset?.id;
    const role = roles.find(r => r.id === id);
    if (!role) return;

    if (e.target.classList.contains("edit") || e.target.classList.contains("btn-edit")) {
      form.role_name.value = role.role_name;
      form.description.value = role.description || "";
      currentEditId = role.id;
      showForm();
    }

    if (e.target.classList.contains("delete") || e.target.classList.contains("btn-delete")) {
      if (!confirm("Delete this role?")) return;
      try {
        await fetch(`/api/roles/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        await loadRoles();
      } catch (err) {
        console.error("❌ Failed to delete role:", err);
      }
    }
  });

  // 🟦 Draggable floating button
  let isDragging = false, moved = false, offset = { x: 0, y: 0 };
  floatBtn?.addEventListener('mousedown', e => {
    e.stopPropagation();
    isDragging = true;
    moved = false;
    offset.x = e.clientX - floatBtn.getBoundingClientRect().left;
    offset.y = e.clientY - floatBtn.getBoundingClientRect().top;
    floatBtn.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    moved = true;
    let x = e.clientX - offset.x;
    let y = e.clientY - offset.y;
    x = Math.max(0, Math.min(x, window.innerWidth - floatBtn.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - floatBtn.offsetHeight));
    floatBtn.style.left = x + 'px';
    floatBtn.style.top = y + 'px';
    floatBtn.style.position = 'fixed';
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    floatBtn.style.cursor = 'grab';
    if (!moved) showForm();
  });

  await loadRoles();
});
