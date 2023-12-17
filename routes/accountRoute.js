// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/accountValidation")

// Route for login 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route for register
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route for management account
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

//Route for logou process
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.logoutProcess))

// Route to Update Account view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountView))


// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process the update
router.post(
"/",
regValidate.updateRules(),
regValidate.checkUpdateData,
utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update/updatePassword",
  regValidate.upPassRules(),
  regValidate.checkPassData,
  utilities.handleErrors(accountController.processUpPassword)
)



module.exports = router;