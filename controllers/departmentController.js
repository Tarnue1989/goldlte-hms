const { Department, Employee } = require('../models');

// ➕ Create department
exports.createDepartment = async (req, res) => {
  try {
    const { department_name, description, head_of_department_id } = req.body;

    const existing = await Department.findOne({ where: { department_name } });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists.' });
    }

    const department = await Department.create({
      department_name,
      description,
      head_of_department_id,
      created_by: req.user.id
    });

    res.status(201).json({ message: 'Department created', department });
  } catch (err) {
    console.error('❌ Error creating department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📄 Get all departments (with full_name added to head)
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: Employee,
        as: 'head_of_department',
        attributes: ['id', 'prefix', 'first_name', 'middle_name', 'last_name']
      }]
    });

    // Manually add full_name to head_of_department
    const formatted = departments.map(dep => {
      const d = dep.toJSON();
      const hod = d.head_of_department;
      if (hod) {
        d.head_of_department.full_name = [hod.prefix, hod.first_name, hod.middle_name, hod.last_name]
          .filter(Boolean).join(" ").trim();
      }
      return d;
    });

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching departments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✏️ Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, description, head_of_department_id } = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    department.department_name = department_name || department.department_name;
    department.description = description || department.description;
    department.head_of_department_id = head_of_department_id || department.head_of_department_id;
    department.updated_by = req.user.id;

    await department.save();

    res.json({ message: 'Department updated', department });
  } catch (err) {
    console.error('❌ Error updating department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🗑️ Soft delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    department.deleted_by = req.user.id;
    await department.save(); // Save audit trail
    await department.destroy(); // Soft delete (paranoid)

    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error('❌ Error deleting department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
