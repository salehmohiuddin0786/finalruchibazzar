exports.errorHandler = (err, req, res, next) => {
  console.error("❌ Internal Error:", err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Sanitize internal database / SQL errors in production
  if (process.env.NODE_ENV === "production") {
    if (err.name === "SequelizeUniqueConstraintError") {
      statusCode = 400;
      message = "A record with this information already exists.";
    } else if (err.name === "SequelizeValidationError") {
      statusCode = 400;
      message = err.errors ? err.errors.map(e => e.message).join(", ") : "Validation failed.";
    } else if (
      err.name && (err.name.includes("Sequelize") || err.name.includes("DatabaseError"))
    ) {
      statusCode = 500;
      message = "A database error occurred. Please try again later.";
    } else if (statusCode === 500) {
      message = "An unexpected server error occurred.";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};