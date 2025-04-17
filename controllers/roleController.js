const { Role } = require('../models');

// 📄 Get all roles (excluding soft-deleted)
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'role_name', 'description', 'permissions'],
      order: [['createdAt', 'DESC']]
    });
    res.json(roles);
  } catch (err) {
    console.error('❌ Error fetching roles:', err);
    res.status(500).json({ message: 'Failed to retrieve roles' });
  }
};

// ➕ CREATE new role
exports.createRole = async (req, res) => {
  try {
    const { role_name, description, permissions } = req.body;

    if (!role_name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const existing = await Role.findOne({ where: { role_name } });
    if (existing) {
      return res.status(400).json({ message: '❌ Role already exists' });
    }

    const role = await Role.create({
      role_name,
      description,
      permissions: permissions ? JSON.parse(permissions) : null,
      created_by: req.user.id
    });

    res.status(201).json({ message: '✅ Role created', role });
  } catch (err) {
    console.error('❌ Error creating role:', err);
    res.status(500).json({ message: 'Failed to create role' });
  }
};

// ✏️ UPDATE role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, description, permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    role.role_name = role_name || role.role_name;
    role.description = description || role.description;
    if (permissions !== undefined) {
      role.permissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
    }
    role.updated_by = req.user.id;

    await role.save();
    res.json({ message: '✅ Role updated', role });
  } catch (err) {
    console.error('❌ Error updating role:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

// 🗑️ SOFT DELETE role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    role.deleted_by = req.user.id;
    await role.save(); // save deleted_by
    await role.destroy(); // triggers soft delete

    res.json({ message: '🗑️ Role deleted' });
  } catch (err) {
    console.error('❌ Error deleting role:', err);
    res.status(500).json({ message: 'Failed to delete role' });
  }
};
