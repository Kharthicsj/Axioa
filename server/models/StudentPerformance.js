import mongoose from 'mongoose';

const studentPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Projects tracking
  projects: {
    assigned: [
      {
        projectId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        assignedDate: { type: Date, default: Date.now },
        dueDate: { type: Date },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        status: { type: String, enum: ['assigned', 'in_progress', 'completed', 'overdue'], default: 'assigned' },
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completedDate: { type: Date },
        submissionLink: { type: String },
        feedback: { type: String },
        grade: { type: Number, min: 0, max: 100 }
      }
    ],
    
    totalAssigned: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    totalInProgress: { type: Number, default: 0 },
    totalOverdue: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // percentage
    averageGrade: { type: Number, default: 0 }
  },

  // Performance metrics
  performance: {
    overallRating: { type: Number, default: 0, min: 0, max: 5 },
    technicalSkills: { type: Number, default: 0, min: 0, max: 5 },
    communicationSkills: { type: Number, default: 0, min: 0, max: 5 },
    problemSolving: { type: Number, default: 0, min: 0, max: 5 },
    teamwork: { type: Number, default: 0, min: 0, max: 5 },
    punctuality: { type: Number, default: 0, min: 0, max: 5 },
    qualityOfWork: { type: Number, default: 0, min: 0, max: 5 }
  },

  // Reviews and feedback
  reviews: [
    {
      reviewId: { type: String, required: true },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      reviewerName: { type: String, required: true },
      reviewerRole: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      projectRelated: { type: String }, // project ID if review is for specific project
      reviewDate: { type: Date, default: Date.now },
      tags: [{ type: String }] // e.g., ['technical', 'communication', 'leadership']
    }
  ],

  // Reports and incidents
  reports: {
    behavioralReports: [
      {
        reportId: { type: String, required: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reporterName: { type: String, required: true },
        type: { type: String, enum: ['behavioral', 'performance', 'attendance', 'disciplinary'], required: true },
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        description: { type: String, required: true },
        actionTaken: { type: String },
        resolvedDate: { type: Date },
        status: { type: String, enum: ['open', 'investigating', 'resolved', 'closed'], default: 'open' },
        reportDate: { type: Date, default: Date.now }
      }
    ],
    
    totalReports: { type: Number, default: 0 },
    resolvedReports: { type: Number, default: 0 },
    pendingReports: { type: Number, default: 0 }
  },

  // Attendance and engagement
  engagement: {
    lastActive: { type: Date, default: Date.now },
    totalLoginDays: { type: Number, default: 0 },
    averageSessionTime: { type: Number, default: 0 }, // in minutes
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    attendanceRate: { type: Number, default: 100 }, // percentage
    engagementScore: { type: Number, default: 0 } // calculated score
  },

  // Status and metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated', 'terminated'],
    default: 'active'
  },
  
  terminationInfo: {
    terminatedDate: { type: Date },
    terminatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    terminationReason: { type: String },
    canReapply: { type: Boolean, default: true },
    reapplyDate: { type: Date }
  },

  // Achievements and milestones
  achievements: [
    {
      achievementId: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      earnedDate: { type: Date, default: Date.now },
      type: { type: String, enum: ['project', 'skill', 'leadership', 'community'], default: 'project' },
      points: { type: Number, default: 0 }
    }
  ],

  totalPoints: { type: Number, default: 0 },
  level: { type: String, default: 'Beginner' }, // Beginner, Intermediate, Advanced, Expert
  
}, {
  timestamps: true
});

// Update derived fields before saving
studentPerformanceSchema.pre('save', function() {
  // Update project statistics
  const projects = this.projects.assigned;
  this.projects.totalAssigned = projects.length;
  this.projects.totalCompleted = projects.filter(p => p.status === 'completed').length;
  this.projects.totalInProgress = projects.filter(p => p.status === 'in_progress').length;
  this.projects.totalOverdue = projects.filter(p => p.status === 'overdue').length;
  
  // Calculate completion rate
  if (this.projects.totalAssigned > 0) {
    this.projects.completionRate = Math.round((this.projects.totalCompleted / this.projects.totalAssigned) * 100);
  }
  
  // Calculate average grade
  const completedProjects = projects.filter(p => p.status === 'completed' && p.grade);
  if (completedProjects.length > 0) {
    this.projects.averageGrade = Math.round(
      completedProjects.reduce((sum, p) => sum + p.grade, 0) / completedProjects.length
    );
  }
  
  // Update reports statistics
  const reports = this.reports.behavioralReports;
  this.reports.totalReports = reports.length;
  this.reports.resolvedReports = reports.filter(r => ['resolved', 'closed'].includes(r.status)).length;
  this.reports.pendingReports = reports.filter(r => ['open', 'investigating'].includes(r.status)).length;
  
  // Calculate overall performance rating
  const perfMetrics = this.performance;
  const ratings = [
    perfMetrics.technicalSkills,
    perfMetrics.communicationSkills,
    perfMetrics.problemSolving,
    perfMetrics.teamwork,
    perfMetrics.punctuality,
    perfMetrics.qualityOfWork
  ].filter(rating => rating > 0);
  
  if (ratings.length > 0) {
    perfMetrics.overallRating = Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
  }
  
  // Calculate total points from achievements
  this.totalPoints = this.achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  
  // Determine level based on points and performance
  if (this.totalPoints >= 1000 && perfMetrics.overallRating >= 4.5) {
    this.level = 'Expert';
  } else if (this.totalPoints >= 500 && perfMetrics.overallRating >= 4.0) {
    this.level = 'Advanced';
  } else if (this.totalPoints >= 200 && perfMetrics.overallRating >= 3.0) {
    this.level = 'Intermediate';
  } else {
    this.level = 'Beginner';
  }
});

// Instance methods
studentPerformanceSchema.methods.addProject = function(projectData) {
  this.projects.assigned.push({
    ...projectData,
    projectId: new mongoose.Types.ObjectId().toString(),
    assignedDate: new Date()
  });
  return this.save();
};

studentPerformanceSchema.methods.updateProjectStatus = function(projectId, status, additionalData = {}) {
  const project = this.projects.assigned.find(p => p.projectId === projectId);
  if (project) {
    project.status = status;
    if (status === 'completed' && !project.completedDate) {
      project.completedDate = new Date();
    }
    Object.assign(project, additionalData);
    return this.save();
  }
  return null;
};

studentPerformanceSchema.methods.addReview = function(reviewData) {
  this.reviews.push({
    ...reviewData,
    reviewId: new mongoose.Types.ObjectId().toString(),
    reviewDate: new Date()
  });
  return this.save();
};

studentPerformanceSchema.methods.addReport = function(reportData) {
  this.reports.behavioralReports.push({
    ...reportData,
    reportId: new mongoose.Types.ObjectId().toString(),
    reportDate: new Date()
  });
  return this.save();
};

studentPerformanceSchema.methods.terminate = function(terminationData) {
  this.status = 'terminated';
  this.terminationInfo = {
    ...terminationData,
    terminatedDate: new Date()
  };
  return this.save();
};

const StudentPerformance = mongoose.model('StudentPerformance', studentPerformanceSchema);

export default StudentPerformance;
