const utilities = require(".")
const invCont = require("../controllers/invController")
const invModel = require("../models/inventoryModel")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
    body("classification_name")
    .trim()
    .isLength({ min:1 })
    .withMessage("Classification name does not meet requirements.")
    .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClassification(classification_name)
        if (classExists){
            throw new Error("Classification name exists. Please try another name.")
        }
    })
    ]
}

/* ******************************
 * Check data and return errors or continue adding classification name
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("inventory/addClassification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
     })
     return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
    body("classification_id")
    .isNumeric({min: 1})
    .withMessage("Please, choose a classification."),
    
    body("inv_make")
    .isLength({min: 3})
    .withMessage("Make field does not meet requirements"),

    body("inv_model")
    .isLength({min: 3})
    .withMessage("Model field does not meet requirements"),

    body("inv_description")
    .isLength({min: 1})
    .withMessage("Description field does not meet requirements"),

    body("inv_image")
    .isLength({min: 10})
    .withMessage("Image field does not meet requirements"),

    body("inv_thumbnail")
    .isLength({min: 10})
    .withMessage("Thumbnail field does not meet requirements"),
    
    body("inv_price")
    .isNumeric({min: 1})
    .withMessage("Price field does not meet requirements"),

    body("inv_year")
    .isNumeric({min: 4, max: 4})
    .withMessage("Year field does not meet requirements"),

    body("inv_miles")
    .isNumeric({min: 1})
    .withMessage("Miles field does not meet requirements"),

    body("inv_color")
    .isLength({min: 1})
    .withMessage("Color field does not meet requirements")
    ]
}

/* ******************************
 * Check data and return errors or continue adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     let options = await utilities.buildOptions()
     res.render("inventory/addInventory", {
        errors,
        title: "Add Inventory",
        nav,
        options,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
     })
     return
    }
    next()
}



/*  **********************************
 *  Update Inventory Data Validation Rules
 * ********************************* */
validate.newInventoryRules = () => {
    return [
    body("classification_id")
    .isNumeric({min: 1})
    .withMessage("Please, choose a classification."),
    
    body("inv_make")
    .isLength({min: 3})
    .withMessage("Make field does not meet requirements"),

    body("inv_model")
    .isLength({min: 3})
    .withMessage("Model field does not meet requirements"),

    body("inv_description")
    .isLength({min: 1})
    .withMessage("Description field does not meet requirements"),

    body("inv_image")
    .isLength({min: 10})
    .withMessage("Image field does not meet requirements"),

    body("inv_thumbnail")
    .isLength({min: 10})
    .withMessage("Thumbnail field does not meet requirements"),
    
    body("inv_price")
    .isNumeric({min: 1})
    .withMessage("Price field does not meet requirements"),

    body("inv_year")
    .isNumeric({min: 4, max: 4})
    .withMessage("Year field does not meet requirements"),

    body("inv_miles")
    .isNumeric({min: 1})
    .withMessage("Miles field does not meet requirements"),

    body("inv_color")
    .isLength({min: 1})
    .withMessage("Color field does not meet requirements"),
    
    body("inv_id")
    .isLength({min: 1})
    .withMessage("Inventory Id does not meet requirements")
    ]
}


/* ******************************
 * Check data and return errors or continue updating inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let options = await utilities.buildOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
     res.render("inventory/editInventory", {
        errors,
        title: "Edit " + itemName,
        nav,
        options,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
     })
     return
    }
    next()
}


module.exports = validate