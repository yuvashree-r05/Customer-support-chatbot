
function errorMiddleware(err, req, res, next) {
  console.error("API Error:", {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 600
      ? err.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    error:
      statusCode === 500
        ? "Something went wrong. Please try again later."
        : err.message || "Request failed.",
  });
}

module.exports = errorMiddleware;
