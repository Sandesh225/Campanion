// src/controllers/quickActionController.js
export const getQuickActions = async (req, res, next) => {
  try {
    // Define quick actions
    const actions = [
      { name: "Plan a Trip", endpoint: "/api/trips" },
      { name: "Explore Destinations", endpoint: "/api/destinations" },
      { name: "View Bookings", endpoint: "/api/bookings" },
    ];

    res.json({ actions });
  } catch (error) {
    next(error);
  }
};
