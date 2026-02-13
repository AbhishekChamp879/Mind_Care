import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Authentication
  googleId: { type: String, sparse: true }, // sparse allows null for non-OAuth users
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["student", "counselor", "admin"],
    default: "student",
    required: true,
  },

  // Profile
  avatar: String,
  phone: String,
  dateOfBirth: Date,
  emergencyContact: String,
  emergencyPhone: String,

  // Settings
  preferredLanguage: { type: String, default: "English" },
  timezone: { type: String, default: "America/New_York" },

  // Student-specific fields
  university: String,
  major: String,
  year: String,
  studentId: String,

  // Counselor-specific fields
  license: String,
  specialization: [String],
  experience: String,

  // Admin-specific fields
  department: String,
  permissions: [String],

  // Metadata
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },

}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1 });

// Method to update last active timestamp
userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save();
};

// Don't return password in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);
