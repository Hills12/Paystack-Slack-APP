const axios = require("axios"),
    slackbot = require("slackbots"),
    qs = require("qs");
    Schema = require("../model/schema"),
    {login} = require("./fetcher")

const {User} = Schema;

let token = "xoxb-256382898130-544456536129-MkhvhRr9BV8vqUzStjMd8CxB",
    incomingWebHook = "https://hooks.slack.com/services/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";

const bot = new slackbot({
    token: token,
    name: "Paystack"
});

bot.on("start", ()=>{
    bot.postMessageToChannel("random", "Hiya! I'm Paystack Informant, Your financial assistant. I will tell you and help you do all that you need from Paystack Dashboard right from here.")
})

bot.on("error", (error)=> console.log(error))

bot.on("message", data => {
    if(data.type !== "message"){
        return
    }else if(data.username == "Paystack"){
        return
    }
    handlemessage(data) 
})

function handlemessage(message){
    
    if(message.text.includes(" revenue") || message.text.includes(" payout")){
        User.findOne({UserId: message.team}, (err, user)=>{
            if(err)console.log(err);
            else if(!user){
                bot.postMessage(message.channel, "You have not looged in your workspace with paystack. You can do that with slash command") 
            }else{
                login(user.email, user.password, "getRevenue").then((result)=>{
                    bot.postMessage(message.channel, `<@${message.user}> asked for your currect revenue. Well the current revenue is ${result.revenue} and your next payout is ${result.payout}`) 
                }) 
            }
        })    
        
    }else{
        console.log("A message was just recieved")  
    }
}

let processing = {"attachments": [ {"text" : "I'm processing your request...", "color": "good"} ]},
    wrongSlashFormat = {"attachments": [ {"text" : 'Wrong Slash Format. \n Use this format "/paystack-login email@gmail.com password"', "color": "warning"} ] },
    loginSuccesful = {"response_type": "in_channel", "attachments": [ {"text" : 'login successful. \n Use "/paystack-help" for how to use me', "color": "good"} ] },
    alreadyLoggedIn = {"attachments": [ {"text" : "This workspace had already been logged in", "color": "warning"} ] },
    processMenu = {
        "text": "Please interact with any of these buttons and drop-down to get me working for you.",
        "attachments": [
            {
                "fallback": "Paystack Menu",
                "callback_id": "Paystack_menu",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "Invoice",
                        "text": "Create Invoice",
                        "type": "button",
                        "value": "invoice"
                    },
                    {
                        "name": "Insight",
                        "text": "Customer Insight",
                        "type": "button",
                        "value": "insight"
                    },
                    {
                        "name": "CSV",
                        "text": "Excel Sheet Analysis",
                        "type": "select",
                        "options": [
                            {
                                "text": "Transactions",
                                "value": "transactions"
                            },
                            {
                                "text": "Payout",
                                "value": "payout"
                            },
                            {
                                "text": "Customers Info",
                                "value": "customers"
                            }
                            
                        ]
                    }
                ]
            }
        ]
    },
    help = {
        "response_type": "in_channel",
        "text": "How to interact with me:",
        "attachments": [
            {
                "text": "Slash Commands",
                "fields": [
                    {
                        "title": "/paystack-help",
                        "value": "Shows how to interact with me",
                        "short": true
                    },
                    {
                        "title": "/paystack-login",
                        "value": "Login into paystack with email and password",
                        "short": true
                    },
                    {
                        "title": "/paystack-menu",
                        "value": "Displays a list of interactive buttons and drop-dwons",
                        "short": true
                    }
                ],
                "color": "#F35A00"
            },
            {
                "text": "Buttons",
                "fields": [
                    {
                        "title": "Create Invoice",
                        "value": "Will create and send invoice to given customer's email",
                        "short": true
                    },
                    {
                        "title": "Customer Insight",
                        "value": "Will take a snapshot of customers insight and display",
                        "short": true
                    }
                ],
                "color": "good"
            },
            {
                "text": "Drop Down Menu",
                "fields": [
                    {
                        "title": "",
                        "value": "Will display a drop down that shows differnt excel sheet options to pick from"
                    }
                ],
                "color": "warning"
            },
            {
                "text": "Bot",
                "fields": [
                    {
                        "title": "",
                        "value": "when you @paystack in any message that includes the word revenue, I will respond with your current revenue and payout"
                    }
                ],
                "color": "danger"
            }
        ]
    },
    unAuthWorksapce = { "attachments": [ {"text" : "This workspace is not authorized, kindly login", "color": "warning"} ] }

exports.processing = (req, res, next) => {
    res.json(processing)
    next()
}

exports.processHelp = (req, res) => {
    axios.post(req.body.response_url, help)
    .then((res) => {
        console.log("help was sucessfully dished as response")
    })
    .catch(function (error) {
        console.log(error);
    })
}

exports.saveSlack = (req, res) => {
    User.findOne({UserId: req.body.team_id}, (err, user) => {
        if(err)console.log(err)
        else if(!user){
            if(req.body.text.split(" ").length !== 2){
                axios.post(req.body.response_url, wrongSlashFormat)
                .then((res) => {
                    console.log("wrong slash format. /paystack-login email@gmail.com password ")
                })
                .catch(function (error) {
                    console.log(error);
                })
            }else {
                let newUser = new User
        
                newUser.UserId = req.body.team_id;
                newUser.email = req.body.text.split(" ")[0];
                newUser.password = req.body.text.split(" ")[1];
            
                newUser.save(err => {
                    if(err)console.log(err)
                    else{
                        axios.post(req.body.response_url, loginSuccesful)
                        .then((res) => {
                            console.log("The login was successful.")
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                    }
                })
            }
        }else{
            axios.post(req.body.response_url, alreadyLoggedIn)
            .then((res) => {
                console.log("This workspace had already been logged in")
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }) 
}

exports.processMenu = (req, res) => {
    axios.post(req.body.response_url, processMenu)
    .then((res) => {
        console.log("Menu was sucessfully dished as response")
    })
    .catch(function (error) {
        console.log(error);
    })
}

exports.processInteractions = (req, res) => {
    let payload = JSON.parse(req.body.payload)
    // console.log(payload)

    User.findOne({UserId : payload.team.id}, (err, user)=>{
        if(err)console.log(err)
        else if(!user){
            axios.post(payload.response_url, unAuthWorksapce)
            .then((res) => {
                console.log("This workspace is not authorized, kindly login")
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            if(payload.type == "dialog_submission"){
                res.send("")
                let getWhat = payload.type,
                    submission = payload.submission;
                login(user.email, user.password, getWhat, payload.team.id, submission.amount, submission.email, submission.instruction).then(() => {
                    axios.post(payload.response_url, {"response_type": "in_channel", "attachments": [ {"text" : `<@${payload.user.id}> just sent an invoice to ${submission.email}.`, "color": "good"} ] })
                    .then((res) => {
                        console.log(`invoice sent`)
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                }).catch((error) => {
                    console.log(error)
                })
            }
            else if(payload.type == "interactive_message"){
                if(payload.actions[0].type === "select"){
                    let selected_value = payload.actions[0].selected_options[0].value;
    
                    login(user.email, user.password, selected_value).then(() => {
                        axios.post(payload.response_url, {"response_type": "in_channel", "attachments": [ {"text" : `<@${payload.user.id}> Just requsted for monthly ${selected_value} sheet. ${selected_value == "payout" || selected_value == "customers" ? "Please check your download folder, I just sent it there" : "I just sent it to the email"}`, "color" : "good"} ] })
                        .then((res) => {
                            console.log(`${selected_value} Request Sucessfull!!!`)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                    }).catch((error) => {
                        console.log(error)
                    })
                }else if(payload.actions[0].type === "button"){
                    let button_value = payload.actions[0].value;
                    if(button_value == "insight"){
                        login(user.email, user.password, button_value, payload.team.id).then(() => {
                            axios.post(incomingWebHook, {"response_type": "in_channel", "attachments": [ {"text" : `<@${payload.user.id}> Just requsted for monthly customer Insight, down here is the snapshot`, "image_url": `https://76b3d1cd.ngrok.io/insight${payload.team.id}.png`, "color" : "#3AA3E3"} ] })
                            .then((res) => {
                                console.log(`${button_value} Request Sucessfull!!!`)
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                        }).catch((error) => {
                            console.log(error)
                        })
                    }else if(button_value == "invoice"){
                        const dialogData = {
                            token: token,
                            trigger_id: payload.trigger_id,
                            dialog: JSON.stringify({
                                title: 'Create and send Invoice',
                                callback_id: 'paystack-invoice',
                                submit_label: 'Send',
                                elements: [
                                    {
                                        label: 'How Much?',
                                        type: 'text',
                                        subtype: "number",
                                        name: 'amount',
                                        placeholder: 10000,
                                        value: "",
                                        hint: "Amount must not be lower than NGN 100"
                                    },
                                    {
                                        label: "Payer's Email Address",
                                        type: "text",
                                        subtype: "email",
                                        name: "email",
                                        placeholder: "email@gmail.com",
                                        value: ""
                                    },
                                    {
                                        label: 'Invoice Instruction',
                                        type: 'textarea',
                                        name: 'instruction',
                                        value: "",
                                        hint: "Tell your customer why you are requesting this payment"
                                    }
                                ]
                            })
                        };
                        axios.post('https://slack.com/api/dialog.open', qs.stringify(dialogData))
                        .then((result) => {
                            if(result.data.error) {
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(200);
                            }
                        })
                        .catch((err) => {
                            res.sendStatus(500);
                        });                      
                    }
                }
            }
        }
    })
}