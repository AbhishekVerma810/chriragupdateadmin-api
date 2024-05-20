
// const { Payment } = require('../models');

// // Add a new payment
// exports.addPayment = async (req, res, next) => {
//   try {
//     const { order_id, payment_method, transaction_id, payment_status } = req.body;
//     const newPayment = await Payment.create({
//       order_id,
//       payment_method,
//       transaction_id,
//       payment_status
//     });
//     res.status(201).json(newPayment);
//   } catch (err) {
//     next(err);
//   }
// };

// // Update a payment
// exports.updatePayment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { order_id, payment_method, transaction_id, payment_status } = req.body;
//     const [updatedRows, [updatedPayment]] = await Payment.update(
//       {
//         order_id,
//         payment_method,
//         transaction_id,
//         payment_status
//       },
//       {
//         where: {
//           id
//         },
//         returning: true
//       }
//     );
//     if (updatedRows === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }
//     res.status(200).json(updatedPayment);
//   } catch (err) {
//     next(err);
//   }
// };

// // Get payment status
// exports.getPaymentStatus = async (req, res, next) => {
//   try {
//     const { order_id } = req.params;
//     const payment = await Payment.findOne({
//       where: {
//         order_id
//       }
//     });
//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }
//     res.status(200).json(payment.payment_status);
//   } catch (err) {
//     next(err);
//   }
// };

// // Delete a payment
// exports.deletePayment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deletedPayment = await Payment.destroy({
//       where: {
//         id
//       }
//     });
//     if (!deletedPayment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }
//     res.status(200).json({ message: 'Payment deleted successfully' });
//   } catch (err) {
//     next(err);
//   }
// };

const { Payment } = require('../models');

exports.addPayment = async (req, res, next) => {
  try {
    const { order_id, payment_method, transaction_id, payment_status } = req.body;
    const newPayment = await Payment.create({
      order_id,
      payment_method,
      transaction_id,
      payment_status
    });
    res.status(201).json(newPayment);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const payment = await Payment.findOne({
      where: {
        order_id
      }
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment.payment_status);
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_id, payment_method, transaction_id, payment_status } = req.body;
    const [updatedRows, [updatedPayment]] = await Payment.update(
      {
        order_id,
        payment_method,
        transaction_id,
        payment_status
      },
      {
        where: {
          id
        },
        returning: true
      }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(updatedPayment);
  } catch (err) {
    next(err);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPayment = await Payment.destroy({
      where: {
        id
      }
    });
    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    next(err);
  }
};