exports.processing = {
    "attachments": [ 
        {
            "text" : "I'm processing your request...", 
            "color": "good"
        } 
    ]
},
exports.wrongSlashFormat = {
    "attachments": [ 
        {
            "text" : 'Wrong Slash Format. \n Use this format "/paystack-login email@gmail.com password"', 
            "color": "warning"
        } 
    ] 
},
exports.loginSuccesful = {
    "response_type": "in_channel", 
    "attachments": [
        {
            "text" : 'login successful. \n Use "/paystack-help" for how to use me', 
            "color": "good"
        } 
    ] 
},
exports.alreadyLoggedIn = {
    "attachments": [ 
        {
            "text" : "This workspace had already been logged in", 
            "color": "warning"
        } 
    ] 
},
exports.processMenu = {
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
exports.help = {
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
                    "value": "Displays a list of interactive buttons and drop-downs",
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
exports.unAuthWorksapce = { 
    "attachments": [ 
        {
            "text" : "This workspace is not authorized, kindly login", 
            "color": "warning"
        } 
    ] 
}