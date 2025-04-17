const { User, Role, Department, Employee } = require('../models');
const bcrypt = require('bcryptjs');

// 📄 GET all users (with corrected field references)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Role, attributes: ['role_name'] },
        { model: Department, attributes: ['department_name'] },
        { model: Employee, attributes: ['prefix', 'first_name', 'last_name'] }
      ],
      attributes: [
        'id', 'employee_id', 'email', 'account_status',
        'must_change_password', 'login_attempts', 'last_login',
        'created_by', 'updated_by'
      ]
    });

    const formatted = users.map(user => {
      const u = user.toJSON();
      u.full_name = [u.Employee?.prefix, u.Employee?.first_name, u.Employee?.last_name]
        .filter(Boolean).join(' ').trim();
      u.role_name = u.Role?.role_name || '';
      u.department_name = u.Department?.department_name || '';
      return u;
    });

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// ➕ CREATE user
exports.createUser = async (req, res) => {
  try {
    const { email, password, role_id, department_id, must_change_password } = req.body;

    const employee = await Employee.findOne({ where: { email } });
    if (!employee) return res.status(400).json({ message: 'Employee not found or mismatch.' });

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        message: `❌ A user account already exists for ${existing.email}`,
      });
    }

    const hashed = await bcrypt.hash(password || 'ChangeMe123!', 10);

    const user = await User.create({
      employee_id: employee.id,
      full_name: [employee.prefix, employee.first_name, employee.last_name].filter(Boolean).join(' ').trim(),
      email,
      password_hash: hashed,
      role_id,
      department_id,
      must_change_password: must_change_password === 'true' || must_change_password === true,
      account_status: 'Active',
      login_attempts: 0,
      created_by: req.user.id
    });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// ✏️ UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, department_id, must_change_password, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }

    user.role_id = role_id;
    user.department_id = department_id;
    user.must_change_password = must_change_password === 'true' || must_change_password === true;
    user.updated_by = req.user.id;

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// 🔄 TOGGLE user account status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.account_status = user.account_status === 'Active' ? 'Disabled' : 'Active';
    user.updated_by = req.user.id;

    await user.save();
    res.json({ message: `User ${user.account_status.toLowerCase()}` });
  } catch (err) {
    console.error('❌ Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle user status' });
  }
};

// 🔁 RESET password
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password_hash = await bcrypt.hash('ChangeMe123!', 10);
    user.must_change_password = true;
    user.updated_by = req.user.id;

    await user.save();
    res.json({ message: 'Password reset to default' });
  } catch (err) {
    console.error('❌ Reset error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// 🗑️ SOFT DELETE
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.deleted_by = req.user.id;
    await user.destroy(); // Soft delete (paranoid mode)

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
