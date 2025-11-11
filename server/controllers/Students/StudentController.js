import StudentApplication from '../../models/StudentApplication.js';
import User from '../../models/User.js';
import multer from 'multer';

// Configure multer for identity document upload with memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
    }
  }
});

// Get or create student application
const getStudentApplication = async (req, res) => {
  try {
    const userId = req.user.userId;

    let application = await StudentApplication.findOne({ userId }).populate('userId', 'username email');
    
    if (!application) {
      // Don't create application yet, just return user data for pre-population
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          error: true,
          success: false,
          message: 'User not found. Please log in again.'
        });
      }
      
      // Return structure for frontend with user data pre-populated
      const applicationStructure = {
        userId,
        status: 'draft',
        personalInfo: {
          fullName: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
          gender: '',
          address: {
            street: '',
            city: user.city || user.location || '',
            state: '',
            pincode: '',
            country: 'India'
          }
        },
        education: {
          college: user.college || '',
          course: user.course || '',
          degree: user.degree || '',
          year: new Date().getFullYear(),
          cgpa: 0,
          percentage: 0,
          specialization: '',
          expectedGraduation: ''
        },
        technical: {
          skills: Array.isArray(user.skills) ? user.skills : [],
          programmingLanguages: [],
          frameworks: [],
          tools: [],
          projects: [],
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          portfolio: user.socialLinks?.portfolio || ''
        },
        identityProof: {
          documentType: '',
          documentNumber: '',
          documentImage: null
        },
        collegeIdProof: {
          documentNumber: '',
          documentImage: null
        },
        applicationDetails: {
          reasonForApplying: '',
          careerGoals: '',
          experience: '',
          achievements: [],
          references: []
        },
        profileCompletion: {
          percentage: 0,
          missingFields: []
        }
      };

      return res.json({
        error: false,
        success: true,
        message: "New application structure created with user data",
        data: applicationStructure,
        isNew: true
      });
    }

    res.json({
      error: false,
      success: true,
      message: "Student application retrieved successfully",
      data: application,
      isNew: false
    });

  } catch (error) {
    console.error('Get student application error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to retrieve student application",
      details: error.message
    });
  }
};

// Save/Update student application
const saveStudentApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const applicationData = req.body;

    let application = await StudentApplication.findOne({ userId });
    
    if (!application) {
      // Create new application with the provided data
      application = new StudentApplication({ 
        userId, 
        ...applicationData,
        status: 'draft'
      });
    } else {
      // Update existing application
      Object.assign(application, applicationData);
      // Ensure status remains draft when saving
      if (application.status !== 'submitted') {
        application.status = 'draft';
      }
    }

    // Handle validation errors gracefully
    try {
      await application.save();
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        // Return validation errors to frontend
        const errors = {};
        for (let field in validationError.errors) {
          errors[field] = validationError.errors[field].message;
        }
        
        return res.status(400).json({
          error: true,
          success: false,
          message: "Validation failed",
          validationErrors: errors,
          data: application.toObject()
        });
      }
      throw validationError;
    }

    res.json({
      error: false,
      success: true,
      message: "Student application saved successfully",
      data: application
    });

  } catch (error) {
    console.error('Save student application error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to save student application",
      details: error.message
    });
  }
};

// Upload identity document
const uploadIdentityDocumentHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { documentType, documentNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Identity document image is required"
      });
    }

    // Check file size (2MB limit)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "File size must be less than 2MB"
      });
    }

    const application = await StudentApplication.findOne({ userId });
    
    if (!application) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Student application not found"
      });
    }

    // Convert file to base64
    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Update identity proof
    application.identityProof = {
      documentType,
      documentNumber,
      documentImage: base64String,
      uploadedAt: new Date()
    };

    await application.save();

    res.json({
      error: false,
      success: true,
      message: "Identity document uploaded successfully",
      data: {
        documentImage: base64String,
        documentType,
        documentNumber
      }
    });

  } catch (error) {
    console.error('Upload identity document error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to upload identity document",
      details: error.message
    });
  }
};

// Upload college ID document
const uploadCollegeIdDocumentHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { documentNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "College ID document image is required"
      });
    }

    // Check file size (2MB limit)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "File size must be less than 2MB"
      });
    }

    const application = await StudentApplication.findOne({ userId });
    
    if (!application) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Student application not found"
      });
    }

    // Convert file to base64
    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Update college ID proof
    application.collegeIdProof = {
      documentNumber,
      documentImage: base64String,
      uploadedAt: new Date()
    };

    await application.save();

    res.json({
      error: false,
      success: true,
      message: "College ID document uploaded successfully",
      data: {
        documentImage: base64String,
        documentNumber
      }
    });

  } catch (error) {
    console.error('Upload college ID document error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to upload college ID document",
      details: error.message
    });
  }
};

// Submit application for review
const submitApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const applicationData = req.body;

    let application = await StudentApplication.findOne({ userId });
    
    if (!application) {
      // Create new application if it doesn't exist
      application = new StudentApplication({ 
        userId, 
        ...applicationData,
        status: 'draft'
      });
    } else {
      // Update existing application with submitted data
      Object.assign(application, applicationData);
    }

    // Check if profile is 100% complete
    const completionPercentage = application.calculateProfileCompletion();
    
    if (completionPercentage < 100) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Profile must be 100% complete before submission",
        data: {
          completionPercentage,
          missingFields: application.profileCompletion.missingFields
        }
      });
    }

    // Update application status
    application.status = 'submitted';
    application.submittedAt = new Date();
    
    await application.save();

    res.json({
      error: false,
      success: true,
      message: "Application submitted successfully for review",
      data: application
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to submit application",
      details: error.message
    });
  }
};

// Check profile completion
const checkProfileCompletion = async (req, res) => {
  try {
    const userId = req.user.userId;

    const application = await StudentApplication.findOne({ userId });
    
    if (!application) {
      // If no application exists, return 0% completion
      return res.json({
        error: false,
        success: true,
        message: "No application found - starting fresh",
        data: {
          completionPercentage: 0,
          missingFields: [],
          canSubmit: false
        }
      });
    }

    const completionPercentage = application.calculateProfileCompletion();
    await application.save();

    res.json({
      error: false,
      success: true,
      message: "Profile completion calculated successfully",
      data: {
        completionPercentage,
        missingFields: application.profileCompletion.missingFields,
        canSubmit: completionPercentage === 100
      }
    });

  } catch (error) {
    console.error('Check profile completion error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to check profile completion",
      details: error.message
    });
  }
};

export {
  getStudentApplication,
  saveStudentApplication,
  submitApplication,
  checkProfileCompletion
};

export const uploadIdentityDocument = [upload.single('identityDocument'), uploadIdentityDocumentHandler];
export const uploadCollegeIdDocument = [upload.single('collegeIdDocument'), uploadCollegeIdDocumentHandler];
