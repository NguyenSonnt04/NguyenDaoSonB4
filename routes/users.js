var express = require('express');
var router = express.Router();
const { dataRole, dataUser } = require('../utils/data2');

// ===== USER ROUTES =====

// GET all users
router.get('/', function(req, res) {
  res.json({
    success: true,
    data: dataUser,
    total: dataUser.length
  });
});

// GET user by username
router.get('/:username', function(req, res) {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  res.json({
    success: true,
    data: user
  });
});

// CREATE new user
router.post('/', function(req, res) {
  const { username, password, email, fullName, avatarUrl, status, role } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, and email are required'
    });
  }

  if (dataUser.some(u => u.username === username)) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists'
    });
  }

  const newUser = {
    username,
    password,
    email,
    fullName: fullName || '',
    avatarUrl: avatarUrl || '',
    status: status !== undefined ? status : true,
    loginCount: 0,
    role: role || { id: 'r3', name: 'Người dùng', description: 'Tài khoản người dùng thông thường' },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataUser.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// UPDATE user
router.put('/:username', function(req, res) {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { email, fullName, avatarUrl, status, role } = req.body;

  if (email) user.email = email;
  if (fullName) user.fullName = fullName;
  if (avatarUrl) user.avatarUrl = avatarUrl;
  if (status !== undefined) user.status = status;
  if (role) user.role = role;
  user.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// DELETE user
router.delete('/:username', function(req, res) {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const deletedUser = dataUser.splice(index, 1);

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser[0]
  });
});

// ===== ROLE ROUTES =====

// GET all roles
router.get('/roles', function(req, res) {
  res.json({
    success: true,
    data: dataRole,
    total: dataRole.length
  });
});

// GET role by id
router.get('/roles/:id', function(req, res) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }
  res.json({
    success: true,
    data: role
  });
});

// CREATE new role
router.post('/roles', function(req, res) {
  const { id, name, description } = req.body;

  if (!id || !name) {
    return res.status(400).json({
      success: false,
      message: 'ID and name are required'
    });
  }

  if (dataRole.some(r => r.id === id)) {
    return res.status(400).json({
      success: false,
      message: 'Role ID already exists'
    });
  }

  const newRole = {
    id,
    name,
    description: description || '',
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataRole.push(newRole);

  res.status(201).json({
    success: true,
    message: 'Role created successfully',
    data: newRole
  });
});

// UPDATE role
router.put('/roles/:id', function(req, res) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  const { name, description } = req.body;

  if (name) role.name = name;
  if (description) role.description = description;
  role.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Role updated successfully',
    data: role
  });
});

// DELETE role
router.delete('/roles/:id', function(req, res) {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  const deletedRole = dataRole.splice(index, 1);

  res.json({
    success: true,
    message: 'Role deleted successfully',
    data: deletedRole[0]
  });
});

// GET all users in a specific role
router.get('/roles/:id/users', function(req, res) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  const usersInRole = dataUser.filter(u => u.role.id === req.params.id);

  res.json({
    success: true,
    role: role,
    data: usersInRole,
    total: usersInRole.length
  });
});

module.exports = router;
