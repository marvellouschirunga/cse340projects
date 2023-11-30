// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/management-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleError(invController.buildByClassificationId)
);

// Route for detail view
router.get("/detail/:inv_id", utilities.handleError(invController.buildById));

// Route for inv management
router.get("/", (req, res, next) => {
  utilities.handleError(invController.buildManageInventory)(req, res, next);
});

// Route for add classification page
router.get("/add-classification", (req, res, next) => {
  utilities.handleError(invController.buildAddClassification)(req, res, next);
});

// Handle add classification post request
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleError(invController.addClassification)
);

// Route for add inventory page
router.get("/add-inventory", (req, res, next) => {
  utilities.handleError(invController.buildAddInventory)(req, res, next);
});

// Handle add inventory post request
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleError(invController.addInventory)
);

module.exports = router;
