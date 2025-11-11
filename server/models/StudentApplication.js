import mongoose from 'mongoose';

const studentApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Personal Information
  personalInfo: {
    fullName: { type: String, required: function() { return this.status !== 'draft'; } },
    email: { type: String, required: function() { return this.status !== 'draft'; } },
    phone: { type: String, required: function() { return this.status !== 'draft'; } },
    dateOfBirth: { type: Date, required: function() { return this.status !== 'draft'; } },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: function() { return this.status !== 'draft'; }
    },
    address: {
      street: { type: String, required: function() { return this.parent().status !== 'draft'; } },
      city: { type: String, required: function() { return this.parent().status !== 'draft'; } },
      state: { type: String, required: function() { return this.parent().status !== 'draft'; } },
      pincode: { type: String, required: function() { return this.parent().status !== 'draft'; } },
      country: { type: String, default: 'India' }
    }
  },

  // Educational Information
  education: {
    college: { type: String, required: function() { return this.status !== 'draft'; } },
    course: { type: String, required: function() { return this.status !== 'draft'; } },
    degree: { 
      type: String, 
      enum: [
        // Bachelor's Degrees
        'B.E. (Bachelor of Engineering)',
        'B.Tech (Bachelor of Technology)',
        'B.Sc (Bachelor of Science)',
        'B.A (Bachelor of Arts)',
        'B.Com (Bachelor of Commerce)',
        'BBA (Bachelor of Business Administration)',
        'BCA (Bachelor of Computer Applications)',
        'B.Arch (Bachelor of Architecture)',
        'MBBS (Bachelor of Medicine)',
        'LLB (Bachelor of Law)',
        // Master's Degrees
        'M.E. (Master of Engineering)',
        'M.Tech (Master of Technology)',
        'M.Sc (Master of Science)',
        'M.A (Master of Arts)',
        'M.Com (Master of Commerce)',
        'MBA (Master of Business Administration)',
        'MCA (Master of Computer Applications)',
        'M.Arch (Master of Architecture)',
        'LLM (Master of Law)',
        // Doctoral Degrees
        'Ph.D (Doctor of Philosophy)',
        'D.Sc (Doctor of Science)',
        'D.Litt (Doctor of Literature)',
        // Other Qualifications
        'Diploma',
        'Certificate',
        'Associate Degree',
        'Professional Certificate',
        'ITI (Industrial Training Institute)',
        'Polytechnic',
        'Other'
      ], 
      required: function() { return this.status !== 'draft'; }
    },
    year: { type: Number, required: function() { return this.status !== 'draft'; } },
    cgpa: { type: Number, min: 0, max: 10 },
    percentage: { type: Number, min: 0, max: 100 },
    specialization: { type: String },
    expectedGraduation: { type: Date, required: function() { return this.status !== 'draft'; } }
  },

  // Technical Information
  technical: {
    skills: [{ type: String }],
    programmingLanguages: [{ type: String }],
    frameworks: [{ type: String }],
    tools: [{ type: String }],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      githubLink: String,
      liveLink: String
    }],
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String }
  },

  // Identity Verification
  identityProof: {
    documentType: {
      type: String,
      enum: ['aadhar', 'driving_license', 'pan_card', 'passport', 'voter_id'],
      required: function() { return this.parent().status !== 'draft'; }
    },
    documentNumber: { type: String, required: function() { return this.parent().status !== 'draft'; } },
    documentImage: { type: String, required: function() { return this.parent().status !== 'draft'; } }, // Base64 encoded
    uploadedAt: { type: Date, default: Date.now }
  },

  // College ID Verification
  collegeIdProof: {
    documentNumber: { type: String, required: function() { return this.parent().status !== 'draft'; } },
    documentImage: { type: String, required: function() { return this.parent().status !== 'draft'; } }, // Base64 encoded
    uploadedAt: { type: Date, default: Date.now }
  },

  // Application specific
  applicationDetails: {
    reasonForApplying: { type: String, required: function() { return this.parent().status !== 'draft'; } },
    careerGoals: { type: String, required: function() { return this.parent().status !== 'draft'; } },
    experience: { type: String },
    achievements: [{ type: String }],
    references: [{
      name: String,
      designation: String,
      company: String,
      email: String,
      phone: String
    }]
  },

  // Application Status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft'
  },
  
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  reviewComments: { type: String },
  
  // Profile completion tracking
  profileCompletion: {
    percentage: { type: Number, default: 0 },
    missingFields: [{ type: String }],
    lastCalculated: { type: Date, default: Date.now }
  }

}, {
  timestamps: true
});

// Calculate profile completion percentage
studentApplicationSchema.methods.calculateProfileCompletion = function() {
  const requiredFields = [
    'personalInfo.fullName',
    'personalInfo.email',
    'personalInfo.phone',
    'personalInfo.dateOfBirth',
    'personalInfo.gender',
    'personalInfo.address.street',
    'personalInfo.address.city',
    'personalInfo.address.state',
    'personalInfo.address.pincode',
    'education.college',
    'education.course',
    'education.degree',
    'education.year',
    'education.expectedGraduation',
    'technical.skills',
    'identityProof.documentType',
    'identityProof.documentNumber',
    'identityProof.documentImage',
    'collegeIdProof.documentNumber',
    'collegeIdProof.documentImage',
    'applicationDetails.reasonForApplying',
    'applicationDetails.careerGoals'
  ];

  let completedFields = 0;
  const missingFields = [];

  requiredFields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    
    if (Array.isArray(value) && value.length > 0) {
      completedFields++;
    } else if (value && value !== '') {
      completedFields++;
    } else {
      missingFields.push(field);
    }
  });

  const percentage = Math.round((completedFields / requiredFields.length) * 100);
  
  this.profileCompletion = {
    percentage,
    missingFields,
    lastCalculated: new Date()
  };

  return percentage;
};

// Pre-save middleware to calculate completion
studentApplicationSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.calculateProfileCompletion();
  }
  next();
});

export default mongoose.model('StudentApplication', studentApplicationSchema);
