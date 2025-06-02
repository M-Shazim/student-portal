module.exports = {
  // Student ID generation
  STUDENT_ID_PREFIX: 'STD',
  STUDENT_ID_LENGTH: 8,

  // Task statuses
  TASK_STATUS: {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    REVIEWED: 'reviewed',
    REVISION_REQUIRED: 'revision_required'
  },

  // Submission review statuses
  REVIEW_STATUS: {
    SATISFIED: 'satisfied',
    UNSATISFIED: 'unsatisfied',
    TRY_AGAIN: 'try_again'
  },

  // User roles
  USER_ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    STUDENT: 'student'
  },

  // Grade scales
  GRADES: ['A', 'B', 'C', 'D', 'F'],

  // Skill levels
  SKILL_LEVELS: ['Beginner', 'Intermediate', 'Advanced'],

  // File upload limits
  FILE_LIMITS: {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // JWT expiration times
  JWT_EXPIRY: {
    ACCESS_TOKEN: '15m',
    REFRESH_TOKEN: '7d',
    REMEMBER_ME_TOKEN: '30d'
  },

  // Email templates
  EMAIL_TEMPLATES: {
    WELCOME_STUDENT: 'welcome_student',
    TASK_ASSIGNED: 'task_assigned',
    TASK_REVIEWED: 'task_reviewed',
    CERTIFICATE_READY: 'certificate_ready',
    PASSWORD_RESET: 'password_reset'
  },

  // Portfolio visibility
  PORTFOLIO_STATUS: {
    PRIVATE: 'private',
    PENDING_REVIEW: 'pending_review',
    PUBLIC: 'public'
  }
};