// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
    console.error('❌ Error:', err.stack || err.message);
  
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  