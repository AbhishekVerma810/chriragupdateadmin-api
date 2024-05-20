const { where } = require('sequelize');
const { Address } = require('../../models');

exports.addAddress = async (req, res, next) => {
  try {
    const {user_id,state,city,pincode,phone_number, house_no,country,address_line} = req.body;
      const newAddress = await Address.create({ user_id, state, city, pincode, phone_number,house_no,country,address_line });
       res.status(201).json(newAddress);
     } catch (err) {
    next(err);
  }
};

// Get User address
exports.getUserAddress = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({where: {user_id: req.user.id}});
    res.status(200).json(addresses);
  } catch (err) {

    next(err);
  }
};

// Get all addresses
exports.getAddress = async (req, res, next) => {
  try {
    const addresses = await Address.findAll();
    res.status(200).json(addresses);
  } catch (err) {
    next(err);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAddress = await Address.destroy({where: { id: req.params.id}});
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.editAddress = async (req, res, next) => {
  try {
    const {state,city,pincode,phone_number, house_no,country,address_line} = req.body;
    // Find the address by ID
    const address = await Address.findOne({where :{
      id: req.params.id, // Assuming address_id is provided in the request body
      user_id: req.user.id
    }});
    if (!address) {
      return res.status(404).json({ error: 'Address not found for the specified user.' });
    }
    // Check if the user trying to edit the address is the owner
    if (address.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this address' });
    }
    res.status(200).json(address);
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const {state,city,pincode,phone_number, house_no,country,address_line} = req.body;
    // Find the address by ID
    const address = await Address.findOne({where :{
      id: req.params.id, // Assuming address_id is provided in the request body
      user_id: req.user.id
    }});
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    // Check if the user trying to edit the address is the owner
    if (address.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this address' });
    }
    // Update the address fields
    const updatedAddress = await address.update({
      state,city,pincode,phone_number, house_no,country,address_line
    });
    res.status(200).json(updatedAddress);
  } catch (err) {
    next(err);
  }
};
// Update an address
// exports.updateAddress = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const {user_id,state,city,pincode,phone_number, house_no,country,address_line} = req.body;

//     const [updatedRows, [updatedAddress]] = await Address.update(
//       {
//         user_id, state, city, pincode, phone_number, house_no, country, address_line },
//       {
//         where: {
//           id:req.params.id
//         },
//         returning: true
//       }
//     );

//     if (updatedRows === 0) {
//       return res.status(404).json({ message: 'Address not found' });
//     }

//     res.status(200).json(updatedAddress);
//   } catch (err) {
//     next(err);
//   }
// };
