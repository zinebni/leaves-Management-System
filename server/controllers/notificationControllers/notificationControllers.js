import Notification from '../../models/notificationModel.js';

//get all notifications for an employee
export const getNotifications = async (req, res) => {
  const employeeId = req.user.id;
  try {
  const notifications = await Notification.find({
  recipient: employeeId,
  isRead: false
  })
    .select('-createdAt -updatedAt -__v')
    .populate({
    path: 'conge',
    select: 'motif status employee',
    populate: [
        {
        path: 'motif',
        select: 'type joursAutorisee joursPris'
        },
        {
        path: 'employee',
        select: 'nom prenom email department',
        populate: {
            path: 'department',
            select: 'name'
        }
        }
    ]
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée.' });
    }
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};