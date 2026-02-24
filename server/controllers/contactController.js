const supabase = require('../config/database');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data: newMessage, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        message
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

exports.getAllContactMessages = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};
