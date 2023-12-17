const invModel = require("../models/inventoryModel")
const accountModel = require("../models/accountModel")
const accountMessage = require("../models/messageModel")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
       list += "<li>"
       list +=
       '<a href="/inv/type/'+
       row.classification_id +
       ' " title="See our inventory of ' +
       row.classification_name +
       ' vehicles">' +
       row.classification_name +
       "</a>"
       list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid 
    if(data.length > 0){
     grid = '<ul id="inv-display">'
     data.forEach(vehicle => {
        grid += '<li>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + ' " title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
        + ' details"><img src="' + vehicle.inv_thumbnail
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
        +' on CSE Motors" ></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
     })
     grid += '</ul>'
    } else {
      grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildInventoryDetailView = async function(data){
  
  let detailView
    if(data.length > 0){
     data.forEach(vehicle => {
      detailView = '<div id="container-detail">'
      detailView += '<div id="detail-content1">'
      detailView += '<img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" >'
      detailView += '</div>'
      detailView += '<div id="detail-content2">'
      detailView += '<h2>' + vehicle.inv_make + " " + vehicle.inv_model + " " + 'Details</h2>'
      detailView += '<span id="price">Price: $'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      detailView += '<p><span>Description:</span> ' + vehicle.inv_description + '</p>'
      detailView += '<p><span>Color:</span> ' + vehicle.inv_color + '</p>'
      detailView += '<p><span>Miles:</span> '
      + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      detailView += '</div>'
      detailView += '</div>' 
     })
} else {
  detailView += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
}
return detailView
}

/* **************************************
* Build classification options field - add inventory form.
* ************************************ */
Util.buildOptions = async function (optionSelected=null) {
  let data = await invModel.getClassifications()
  let options
    options = '<select name="classification_id" id="classificationId" required>'
    options += '<option value="" selected disabled hidden> Choose a classification </option>'
    data.rows.forEach(row => {
    options += `<option value="${row.classification_id}"
    ${row.classification_id === Number(optionSelected)? 'selected':''}
    >${row.classification_name} </option>`
    })
    options += '</select>'
  return options
}

/* **************************************
* Build Inbox messages table
* ************************************ */
Util.buildInboxTable = async function (data) {
 
  let table
  if(data.length > 0){
  table = '<table id="inboxTable">'
  table += '<tr>'
  table += '<th> Received </th>'
  table += '<th> Subject </th>'
  table += '<th> From </th>'
  table += '<th> Read </th>'
  table += '</tr>'
  data.forEach(row => {
  if(row.message_archived === false){
  table += '<tr>'
  const time = row.message_created
  table += `<td> ${time.toLocaleString('en-US', { timeZone: 'UTC'})} </td>`
  table += `<td><a href="/message/messageView/${row.message_id}">${row.message_subject}</a></td>`
  table += `<td> ${row.account_firstname} ${row.account_lastname}</td>`
  table += `<td> ${row.message_read} </td>`
  table += '</tr>'
  }
  })
  table += '</table>'

}else {
 table = '<h3 id="noMessages">You do not have messages </h3>'
}
return table
}

/* **************************************
* Build Unread Messages number
* ************************************ */
Util.buildUnreadMessages = async function (data) {
  let number
  let count = 0
     data.forEach(row =>{
    if(row.message_read === false){
    count++
    number = `<li> You have ${count} unread messages. </li>`
    }   
     })

     return number;
}

/* **************************************
* Build Archived Messages number
* ************************************ */
Util.buildArchivedMessagesNumber = async function (data) {
let archived 
let count = 0
data.forEach( row => {
if(row.message_archived === true) {
count++
archived = `<li><a href="/message/archived/">View ${count} Archived Message(s)</a></li>`
} 
})
return archived;
}

/* **************************************
* Build Archived messages table
* ************************************ */
Util.buildArchivedTable = async function (data) {
 
  let table
  if(data.length > 0){
  table = '<table id="inboxTable">'
  table += '<tr>'
  table += '<th> Received </th>'
  table += '<th> Subject </th>'
  table += '<th> From </th>'
  table += '<th> Read </th>'
  table += '</tr>'
  data.forEach(row => {
  if(row.message_archived === true){
  table += '<tr>'
  const time = row.message_created
  table += `<td> ${time.toLocaleString('en-US', { timeZone: 'UTC'})} </td>`
  table += `<td><a href="/message/messageView/${row.message_id}">${row.message_subject}</a></td>`
  table += `<td> ${row.account_firstname} ${row.account_lastname}</td>`
  table += `<td> ${row.message_read} </td>`
  table += '</tr>'
  }
  })
  table += '</table>'

}else {
 table = '<h3 id="noMessages">You do not have messages </h3>'
}
return table
}

/* **************************************
* Build account name options
* ************************************ */
Util.buildAccountOptions = async function (id) {
  let data = await accountMessage.getAllAccountData()
  let options
    options = '<select name="message_to" id="message_to" required>'
    options += '<option value="" selected disabled hidden> Select a recipient </option>'
    data.rows.forEach(row => {
    if(id != row.account_id){
      options += `<option value="${row.account_id}"> ${row.account_firstname} ${row.account_lastname} </option>`
    }
    })
    options += '</select>'
  return options
}

/* **************************************
* Build message view 
* ************************************ */
Util.buildMessageView = async function (data) {
let messageView
if(data.length > 0 ) {
messageView = '<div id="messageview">'
data.forEach(row => {
messageView += `<p><strong>Subject: </strong><span>${row.message_subject}</span></p>`
messageView += `<p><strong>From: </strong><span>${row.account_firstname} ${row.account_lastname}</span></p>`
messageView += `<p><strong>Message: </strong></p>`
messageView += `<p id="messageB">${row.message_body}</p>`
})
messageView += '</div>'  
}
return messageView
}


/* **************************************
* Build reply input form
* ************************************ */
Util.replyForm = async function (data) {
let reply
if(data.length > 0) {
data.forEach(row => {
let substr = 'RE:'
reply = '<label>'
reply += 'To'
reply += `<input type="hidden" name="message_to" id="message_to" value="${row.message_from}">`
reply += `<input type="text" name="to" value="${row.account_firstname} ${row.account_lastname}" readonly>`
reply += '</label>'
reply += '<label>'
reply += 'Subject'
if(row.message_subject.indexOf(substr)  >= 0){
reply += `<input type="text" name="message_subject" id="message_subject" value="${row.message_subject}" readonly>`
} else {
reply += `<input type="text" name="message_subject" id="message_subject" value="${substr} ${row.message_subject}" readonly>`  
}
reply += '</label>'
})
}
return reply
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()

  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.checkPermission = (req, res, next) => {
  const type = res.locals.accountData.account_type
  if(type == "Client") {
    return res.redirect("/account/")
  } else {
    next()
  }
}




module.exports = Util