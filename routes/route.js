const { saveChrome, alwaysGet } = require("../Paystack/chrome"),
    { processing, processHelp, saveSlack, processMenu, processInteractions } = require("../Paystack/slack"),
    { cors } = require("../config/config");

module.exports = (express, app)=>{
    const   router = express.Router();

// The Landing Page
    router.route("/").post(cors, saveChrome);

    router.route("/alwaysGet").post(cors, alwaysGet);

    router.route("/process-login").post(processing, saveSlack);

    router.route("/menu").post(processing, processMenu);

    router.route("/interactions").post(processInteractions);

    router.route("/help").post(processing, processHelp)

    app.use("/", router);
}