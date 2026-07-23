const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error to the server console for debugging
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    status: 'error',
    message: isProduction ? 'An unexpected server error occurred.' : err.message,
    ...(isProduction ? {} : { error: err.stack })
  });
};

module.exports = errorHandler;
