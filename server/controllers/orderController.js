const supabase = require('../config/database');

const BOTTLE_PRICES = {
  '1L': 65,
  '500ml': 45,
  '250ml': 30
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bottleSize, quantity, designImage, deliveryName, deliveryPhone, deliveryAddress } = req.body;

    if (!bottleSize || !quantity || !deliveryName || !deliveryPhone || !deliveryAddress) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['1L', '500ml', '250ml'].includes(bottleSize)) {
      return res.status(400).json({ error: 'Invalid bottle size' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    const { data: lastOrder } = await supabase
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let orderNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.id.split('-')[1]);
      orderNumber = lastNumber + 1;
    }
    const orderId = `ORD-${String(orderNumber).padStart(3, '0')}`;

    const totalPrice = BOTTLE_PRICES[bottleSize] * quantity;

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([{
        id: orderId,
        user_id: userId,
        user_name: user.name,
        bottle_size: bottleSize,
        quantity,
        design_image: designImage || '',
        delivery_name: deliveryName,
        delivery_phone: deliveryPhone,
        delivery_address: deliveryAddress,
        status: 'pending',
        total_price: totalPrice
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      order: {
        id: newOrder.id,
        userId: newOrder.user_id,
        userName: newOrder.user_name,
        bottleSize: newOrder.bottle_size,
        quantity: newOrder.quantity,
        designImage: newOrder.design_image,
        deliveryName: newOrder.delivery_name,
        deliveryPhone: newOrder.delivery_phone,
        deliveryAddress: newOrder.delivery_address,
        status: newOrder.status,
        totalPrice: newOrder.total_price,
        adminNote: newOrder.admin_note,
        createdAt: newOrder.created_at,
        updatedAt: newOrder.updated_at
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        userId: order.user_id,
        userName: order.user_name,
        bottleSize: order.bottle_size,
        quantity: order.quantity,
        designImage: order.design_image,
        deliveryName: order.delivery_name,
        deliveryPhone: order.delivery_phone,
        deliveryAddress: order.delivery_address,
        status: order.status,
        totalPrice: order.total_price,
        adminNote: order.admin_note,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }))
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const { quantity, deliveryAddress, deliveryPhone } = req.body;

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be modified' });
    }

    const updateData = { updated_at: new Date().toISOString() };

    if (quantity) {
      updateData.quantity = quantity;
      updateData.total_price = BOTTLE_PRICES[order.bottle_size] * quantity;
    }
    if (deliveryAddress) updateData.delivery_address = deliveryAddress;
    if (deliveryPhone) updateData.delivery_phone = deliveryPhone;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    const { data: order } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNote } = req.body;

    const validStatuses = ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNote !== undefined) {
      updateData.admin_note = adminNote;
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
