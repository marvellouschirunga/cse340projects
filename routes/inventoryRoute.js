// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require("../utilities/inventoryValidation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by id
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to Management View
router.get("/", 
utilities.checkLogin,
utilities.checkPermission,
utilities.handleErrors(invController.buildManagementView));

// Route to Add Classification View
router.get("/addClassification", 
utilities.checkLogin,
utilities.checkPermission,
utilities.handleErrors(invController.buildAddClassification));

// Route to Add Inventory View
router.get("/addInventory",
utilities.checkLogin,
utilities.checkPermission, 
utilities.handleErrors(invController.buildAddInventory));

// Route to get Inventory
router.get("/getInventory/:classification_id", 
utilities.checkLogin,
utilities.checkPermission,
utilities.handleErrors(invController.getInventoryJSON));

// Route to get Edit
router.get("/edit/:invId",
utilities.checkLogin,
utilities.checkPermission,
 utilities.handleErrors(invController.editInventoryView));

// Route to get Delete
router.get("/delete/:invId", 
utilities.checkLogin,
utilities.checkPermission,
utilities.handleErrors(invController.deleteView))



// Process the add Classification data
router.post('/addClassification', 
utilities.checkLogin,
utilities.checkPermission,
classValidate.classificationRules(),
classValidate.checkClassData,
utilities.handleErrors(invController.addClassification));

// Process the add Inventory data
router.post('/addInventory', 
utilities.checkLogin,
utilities.checkPermission,
classValidate.inventoryRules(),
classValidate.checkInvData,
utilities.handleErrors(invController.addInventory));

// Update Inventory route
router.post("/update",
utilities.checkLogin,
utilities.checkPermission, 
classValidate.newInventoryRules(), 
classValidate.checkUpdateData, 
utilities.handleErrors(invController.updateInventory));

// Process the delete Inventory request
router.post("/delete", 
utilities.checkLogin,
utilities.checkPermission,
utilities.handleErrors(invController.deleteItem));

module.exports = router;