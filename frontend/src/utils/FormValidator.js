/**
 * Form Validation Utility
 * Provides reusable validation functions for common form fields
 */

export const FormValidator = {
  // Email validation
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Password validation (8+ chars, uppercase, lowercase, digit, special char)
  isValidPassword: (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  // Mobile number validation (10-15 digits)
  isValidMobileNumber: (mobile) => {
    const regex = /^[0-9\-\+\(\) ]{10,15}$/;
    return regex.test(mobile);
  },

  // Full name validation (2-150 chars, letters and spaces only)
  isValidFullName: (name) => {
    const regex = /^[a-zA-Z\s]{2,150}$/;
    return regex.test(name);
  },

  // Title validation (1-200 chars)
  isValidTitle: (title) => {
    return title && title.length >= 1 && title.length <= 200;
  },

  // Description validation (max 1000 chars)
  isValidDescription: (description) => {
    return !description || description.length <= 1000;
  },

  // Role validation
  isValidRole: (role) => {
    return ['Admin', 'Faculty', 'Student'].includes(role);
  },

  // Date validation (future date)
  isValidFutureDate: (date) => {
    return date && new Date(date) > new Date();
  },

  // Score validation (0-1000)
  isValidScore: (score) => {
    const num = parseFloat(score);
    return !isNaN(num) && num >= 0 && num <= 1000;
  },

  // Status validation
  isValidStatus: (status) => {
    return ['Pending', 'In Progress', 'Completed', 'Rejected'].includes(status);
  },

  // Priority validation
  isValidPriority: (priority) => {
    return ['Low', 'Medium', 'High'].includes(priority);
  },

  // Date range validation (start before end)
  isValidDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) < new Date(endDate);
  },

  // Generic string length validation
  isValidStringLength: (str, min, max) => {
    const length = str ? str.length : 0;
    return length >= min && length <= max;
  },

  // Validate all form fields for a given type
  validateFormData: (formData, formType) => {
    const errors = {};

    switch (formType) {
      case 'user':
        errors.fullName = validateUserFullName(formData.fullName);
        errors.email = validateEmail(formData.email);
        errors.password = validatePassword(formData.password);
        errors.mobileNumber = validateMobileNumber(formData.mobileNumber);
        break;

      case 'project':
        errors.projectTitle = validateProjectTitle(formData.projectTitle);
        errors.studentId = validateUserId(formData.studentId);
        errors.facultyId = validateUserId(formData.facultyId);
        errors.startDate = validateDate(formData.startDate);
        errors.endDate = validateDate(formData.endDate);
        if (formData.startDate && formData.endDate) {
          if (!FormValidator.isValidDateRange(formData.startDate, formData.endDate)) {
            errors.dateRange = 'Start date must be before end date';
          }
        }
        break;

      case 'task':
        errors.taskTitle = validateTaskTitle(formData.taskTitle);
        errors.projectId = validateProjectId(formData.projectId);
        errors.taskStatus = validateStatus(formData.taskStatus);
        errors.priorityId = validatePriority(formData.priorityId);
        errors.assignedScore = validateScore(formData.assignedScore);
        if (formData.earnedScore) {
          errors.earnedScore = validateEarnedScore(formData.earnedScore, formData.assignedScore);
        }
        break;

      case 'role':
        errors.roleName = validateRoleName(formData.roleName);
        break;
    }

    // Remove empty error entries
    return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v));
  }
};

// Individual field validators
const validateUserFullName = (fullName) => {
  if (!fullName || !fullName.trim()) return 'Full name is required';
  if (!FormValidator.isValidFullName(fullName)) return 'Full name must be 2-150 characters (letters and spaces only)';
  return '';
};

const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  if (!FormValidator.isValidEmail(email)) return 'Invalid email format';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!FormValidator.isValidPassword(password)) {
    return 'Password must contain uppercase, lowercase, digit, and special character';
  }
  return '';
};

const validateMobileNumber = (mobile) => {
  if (!mobile || !mobile.trim()) return 'Mobile number is required';
  if (!FormValidator.isValidMobileNumber(mobile)) return 'Mobile number must be 10-15 digits';
  return '';
};

const validateProjectTitle = (title) => {
  if (!title || !title.trim()) return 'Project title is required';
  if (!FormValidator.isValidTitle(title)) return 'Project title must be 1-200 characters';
  return '';
};

const validateTaskTitle = (title) => {
  if (!title || !title.trim()) return 'Task title is required';
  if (!FormValidator.isValidTitle(title)) return 'Task title must be 1-200 characters';
  return '';
};

const validateProjectId = (id) => {
  if (!id || id <= 0) return 'Project is required';
  return '';
};

const validateUserId = (id) => {
  if (!id || id <= 0) return 'User is required';
  return '';
};

const validateDate = (date) => {
  if (!date) return 'Date is required';
  if (!FormValidator.isValidFutureDate(date)) return 'Date must be in the future';
  return '';
};

const validateStatus = (status) => {
  if (!status) return 'Status is required';
  if (!FormValidator.isValidStatus(status)) return 'Invalid status';
  return '';
};

const validatePriority = (priority) => {
  if (!priority) return 'Priority is required';
  if (!FormValidator.isValidPriority(priority)) return 'Invalid priority';
  return '';
};

const validateScore = (score) => {
  if (!score && score !== 0) return 'Score is required';
  if (!FormValidator.isValidScore(score)) return 'Score must be between 0 and 1000';
  return '';
};

const validateEarnedScore = (earned, assigned) => {
  const earnedNum = parseFloat(earned);
  const assignedNum = parseFloat(assigned);
  if (isNaN(earnedNum)) return 'Earned score must be a number';
  if (earnedNum < 0) return 'Earned score cannot be negative';
  if (earnedNum > assignedNum) return 'Earned score cannot exceed assigned score';
  return '';
};

const validateRoleName = (roleName) => {
  if (!roleName || !roleName.trim()) return 'Role name is required';
  if (roleName.length > 50) return 'Role name cannot exceed 50 characters';
  return '';
};

export default FormValidator;