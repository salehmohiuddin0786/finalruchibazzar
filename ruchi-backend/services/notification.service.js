exports.sendNotification = async ({
  userId,
  title,
  message,
}) => {
  try {
    // Later integrate Firebase / Email / SMS
    console.log("🔔 Notification Sent");
    console.log("User:", userId);
    console.log("Title:", title);
    console.log("Message:", message);

    return true;
  } catch (error) {
    throw new Error("Notification failed: " + error.message);
  }
};