const { Employee, Role, Department } = require('../models');

// ➕ CREATE employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      prefix,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      email,
      department_id,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      employment_status,
      position_title,
      start_date,
      end_date,
      role_id,
      linkedin_url,
      bio
    } = req.body;

    const files = req.files || {};
    const profile_picture = files.profile_picture?.[0]?.filename || null;
    const resume_url = files.resume_url?.[0]?.filename || null;

    const newEmployee = await Employee.create({
      prefix,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      email,
      department_id,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      employment_status,
      position_title,
      start_date,
      end_date,
      role_id,
      linkedin_url,
      bio,
      profile_picture,
      resume_url,
      created_by: req.user.id,
    });

    res.status(201).json({ message: 'Employee created', employee: newEmployee });
  } catch (err) {
    console.error('❌ Error creating employee:', err);
    res.status(500).json({ message: 'Failed to create employee', error: err.message });
  }
};

// 📄 GET all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: Role, attributes: ['role_name'] },
        { model: Department, attributes: ['department_name'] }
      ]
    });

    res.json(employees.map(emp => ({
      ...emp.toJSON(),
      full_name: [emp.prefix, emp.first_name, emp.middle_name, emp.last_name]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
      role_name: emp.Role?.role_name || null,
      department_name: emp.Department?.department_name || null
    })));
  } catch (err) {
    console.error('❌ Error fetching employees:', err);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

// ✏️ UPDATE employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const files = req.files || {};
    if (files.profile_picture?.[0]) {
      updates.profile_picture = files.profile_picture[0].filename;
    }
    if (files.resume_url?.[0]) {
      updates.resume_url = files.resume_url[0].filename;
    }

    updates.updated_by = req.user.id;
    await employee.update(updates);

    res.json({ message: 'Employee updated', employee });
  } catch (err) {
    console.error('❌ Error updating employee:', err);
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

// 🗑️ DELETE employee (soft delete)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update({ deleted_by: req.user.id });
    await employee.destroy(); // Sequelize will set deleted_at

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('❌ Error deleting employee:', err);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};
