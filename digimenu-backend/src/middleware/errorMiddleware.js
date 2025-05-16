import mongoose from 'mongoose';

// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
  // Default status code and message
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Server Error';

  // Handle specific errors
  if (err instanceof mongoose.Error.CastError) {
    // Handle invalid ObjectId (e.g., invalid category ID)
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: err.message,
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    // Handle validation errors (e.g., missing required fields)
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export { errorHandler };
