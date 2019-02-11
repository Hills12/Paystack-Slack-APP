const uuid = require("uuid/v4")(),
    Schema = require("../model/schema"),
    {login} = require("./fetcher")

    const {User} = Schema;

exports.saveChrome = (req, res) => {
    login(req.body.email, req.body.password, "getRevenue").then((result)=>{
        let newUser = new User,
            UserId = uuid;

        newUser.UserId = UserId;
        newUser.email = req.body.email;
        newUser.password = req.body.password;

        newUser.save(err=>{
            if(err)console.log(err)
            else{
                res.json({
                    id: UserId, 
                    response: true, 
                    revenue: result.revenue, 
                    payout: result.payout
                })
            }
        })
    })
}

exports.alwaysGet = (req, res) => {
    User.findOne({UserId: req.body.id}, (err, user)=>{
        if(err)console.log(err)
        else if(!user){
            console.log("there is no user")
            res.json({
                response: false
            })
        }
        else{
            console.log("there is user")
            login(user.email, user.password, "getRevenue").then((result)=>{
                res.json({
                    response: true,
                    revenue: result.revenue,
                    payout: result.payout
                })
            })
        }
    })
}