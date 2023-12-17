const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const detailView = await utilities.buildInventoryDetailView(data)
    let nav = await utilities.getNav()
    const invYear = data[0].inv_year
    const invMake = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/detail", {
        title: invYear + " " + invMake + " " + model,
        nav,
        detailView,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let options = await utilities.buildOptions()
    let nav = await utilities.getNav()
    res.render("./inventory/", {
        title: "Inventory Management",
        nav,
        options,
        errors: null,
        
       
    })
    }


/* ***************************
 *  Build Add Classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
    })

}

invCont.addClassification = async function (req, res){
    const { classification_name } = req.body
    const addResult = await invModel.registerAddClassification(classification_name)
    let options = await utilities.buildOptions()
    let nav = await utilities.getNav()

    if (addResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was succesfully added.`

        )
        res.status(201).render("./inventory/", {
           title: "Inventory Management",
           nav,
           options, 
                 

        })
    } else {
        req.flash("notice", "Sorry, the operation failed.")
        res.status(501).render("./inventory/addClassification", {
            title: "Add Classification",
            nav,  
        })
    }
}


/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let options = await utilities.buildOptions()
    let nav = await utilities.getNav()
    res.render("./inventory/addInventory", {
        title: "Add Inventory",
        nav,
        options,
        errors: null,
        }) 
}

invCont.addInventory = async function (req, res) {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    const addResult = await invModel.registerAddinventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    let options = await utilities.buildOptions()
    let nav = await utilities.getNav()
    if (addResult) {
        req.flash(
            "notice",
            `The ${inv_model} vehicle was succesfully added.`

        )
        res.status(201).render("./inventory/", {
           title: "Inventory Management",
           nav,
           options,
                

        })
    } else {
        req.flash("notice", "Sorry, the operation failed.")
        res.status(501).render("./inventory/addInventory", {
            title: "Add Inventory",
            nav,  
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }
  

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInvId(inv_id)
    const options = await utilities.buildOptions(itemData[0].classification_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      options: options,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
    })
  }


  /* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildOptions(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
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
      classification_id
      })
    }
  }


    /* ***************************
 *  BUILD DELETE CONFIRMATION VIEW
 * ************************** */
invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInvId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/deleteInventory", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price,
    })
}

   /* ***************************
 *  DELETE INVENTORY ITEM
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    if(deleteResult) {
        req.flash("notice", 'The deletion was successful. ')
        res.redirect('/inv/')
    }else{
        req.flash("notice", 'Sorry, the delete failed.')
        res.redirect("/inv/delete/invId")
    }
}



module.exports = invCont