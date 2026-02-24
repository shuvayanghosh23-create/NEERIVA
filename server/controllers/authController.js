const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { title, name, emailOrMobile, password, address } = req.body;

    if (!title || !name || !emailOrMobile || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email_or_mobile', emailOrMobile)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'This Mobile No / Email ID is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        title,
        name,
        email_or_mobile: emailOrMobile,
        password: hashedPassword,
        address: address || '',
        is_profile_setup: false
      }])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        title: newUser.title,
        name: newUser.name,
        emailOrMobile: newUser.email_or_mobile,
        address: newUser.address,
        profilePicture: newUser.profile_picture,
        bio: newUser.bio,
        isProfileSetup: newUser.is_profile_setup,
        createdAt: newUser.created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ error: 'Email/Mobile and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email_or_mobile', emailOrMobile)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your details.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your details.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        title: user.title,
        name: user.name,
        emailOrMobile: user.email_or_mobile,
        address: user.address,
        profilePicture: user.profile_picture,
        bio: user.bio,
        isProfileSetup: user.is_profile_setup,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken(admin.id, true);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        profilePicture: admin.profile_picture
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const allowedFields = ['name', 'address', 'profile_picture', 'bio', 'is_profile_setup', 'password'];
    const updateData = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'password') {
          updateData.password = await bcrypt.hash(updates.password, 10);
        } else {
          updateData[field] = updates[field];
        }
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      user: {
        id: data.id,
        title: data.title,
        name: data.name,
        emailOrMobile: data.email_or_mobile,
        address: data.address,
        profilePicture: data.profile_picture,
        bio: data.bio,
        isProfileSetup: data.is_profile_setup
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
};
