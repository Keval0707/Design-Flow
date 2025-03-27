// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['designer', 'manager', 'admin'],
    default: 'designer'
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    skills: [String],
    socialLinks: {
      behance: String,
      dribbble: String,
      linkedin: String
    }
  },
  membership: {
    type: {
      tier: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
      },
      startDate: Date,
      endDate: Date
    }
  },
  preferences: {
    darkMode: Boolean,
    language: String,
    notifications: {
      email: Boolean,
      inApp: Boolean
    }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);

// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { Webhook } = require('svix');
const User = require('./user');

// Clerk Webhook for User Synchronization
router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    const type = payload.type;

    switch(type) {
      case 'user.created':
        await createUserInDatabase(payload.data);
        break;
      case 'user.updated':
        await updateUserInDatabase(payload.data);
        break;
      case 'user.deleted':
        await deleteUserFromDatabase(payload.data);
        break;
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper function to create user in database
async function createUserInDatabase(userData) {
  const newUser = new User({
    clerkId: userData.id,
    email: userData.email_addresses[0].email_address,
    username: userData.username || userData.email_addresses[0].email_address.split('@')[0],
    profile: {
      firstName: userData.first_name,
      lastName: userData.last_name,
      avatar: userData.profile_image_url
    }
  });

  await newUser.save();
}

// Similar helper functions for update and delete

module.exports = router;