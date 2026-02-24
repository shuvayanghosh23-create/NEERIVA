const supabase = require('../config/database');

exports.createTicket = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    const { data: lastTicket } = await supabase
      .from('support_tickets')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let ticketNumber = 1;
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.id.split('-')[1]);
      ticketNumber = lastNumber + 1;
    }
    const ticketId = `TKT-${String(ticketNumber).padStart(3, '0')}`;

    const { data: newTicket, error } = await supabase
      .from('support_tickets')
      .insert([{
        id: ticketId,
        user_id: userId,
        user_name: user.name,
        subject,
        message,
        status: 'open'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      ticket: {
        id: newTicket.id,
        userId: newTicket.user_id,
        userName: newTicket.user_name,
        subject: newTicket.subject,
        message: newTicket.message,
        status: newTicket.status,
        reply: newTicket.reply,
        createdAt: newTicket.created_at
      }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

exports.replyToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: 'Reply is required' });
    }

    const { data: updatedTicket, error } = await supabase
      .from('support_tickets')
      .update({
        reply,
        status: 'in-progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error('Reply to ticket error:', error);
    res.status(500).json({ error: 'Failed to reply to ticket' });
  }
};

exports.resolveTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { data: updatedTicket, error } = await supabase
      .from('support_tickets')
      .update({
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
};
