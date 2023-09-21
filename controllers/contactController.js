const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

const handleContactNotFound = (res) => {
  res.status(404);
  throw new Error("Contact not found");
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id}); //gt all
  res.status(200).json(contacts);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
});

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    handleContactNotFound(res);
  }
  res.status(200).json(contact);
});

// @desc    Update a contact by ID
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    handleContactNotFound(res);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You can't update this contact");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// @desc    Delete a contact by ID
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    handleContactNotFound(res);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You can't delete this contact");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
