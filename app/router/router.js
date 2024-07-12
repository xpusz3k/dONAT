const express = require("express");
const path = require("path");
const colorette = require("colorette");
const bodyParser = require('body-parser')

const homeRoute = require("../router/routes/homeRoute");
const loginRoute = require("../router/routes/loginRoute");
const dashboardRoute = require("../router/routes/dashboardRoute");

const postSaveOrder = require("../router/routes/post/save-order");
const postToggleMaintenance = require("../router/routes/post/toggle-maintenance");
const postSaveAd = require("../router/routes/post/save-ad");
const postRemoveAd = require("../router/routes/post/remove-ad");
const postUpdateBannerTimeouts = require("../router/routes/post/update-banner-timeouts");
const postUpdateBannerCooldowns = require("../router/routes/post/update-banner-cooldown");
const postCreateUser = require("../router/routes/post/create-account");

const getOrderData = require("../router/routes/get/order-list");
const getAdsData = require("../router/routes/get/ads-list");
const getMaintenanceData = require("../router/routes/get/maintenance-status");
const getCheckUser = require("../router/routes/get/check-user");
const getCheckBannerTimeouts = require("../router/routes/get/check-banner-timeouts");
const getCheckBannerCooldowns = require("../router/routes/get/check-banner-cooldown");

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

const loadRouters = async () => {
    app.use(express.static('static/css'))
    app.use(express.static('static/images'))
    app.use(express.static('static/js'))
    app.use(express.static('uploads'))
    
    app.use("/", homeRoute);
    app.use("/login", loginRoute);
    app.use("/dashboard", dashboardRoute);

    app.use("/save-order", postSaveOrder);
    app.use("/toggle-maintenance", postToggleMaintenance);
    app.use("/save-ad", postSaveAd);
    app.use("/remove-ad", postRemoveAd);
    app.use("/update-banner-timeouts", postUpdateBannerTimeouts);
    app.use("/update-banner-cooldowns", postUpdateBannerCooldowns);
    app.use("/create-user", postCreateUser);

    app.use("/get-orders", getOrderData);
    app.use("/get-ads", getAdsData);
    app.use("/get-maintenance-status", getMaintenanceData);
    app.use("/check-user", getCheckUser);
    app.use("/check-banner-timeouts", getCheckBannerTimeouts);
    app.use("/check-banner-cooldowns", getCheckBannerCooldowns);


    app.listen(PORT, () => {
        try {
            console.log(colorette.green(`✅ App listening at port ${PORT}`))
        } catch (error) {
            console.log(colorette.red(`❗ Something went wrong with App listening...`))
        }
    })
};

module.exports = { loadRouters };
