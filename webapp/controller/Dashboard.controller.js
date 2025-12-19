sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.Dashboard", {
        onInit: function () {
        },

        onPressAllLots: function () {
            this.getOwnerComponent().getRouter().navTo("inspectionLots");
        },

        onPressResults: function () {
            this.getOwnerComponent().getRouter().navTo("inspectionLots");
        },

        onPressUsage: function () {
            this.getOwnerComponent().getRouter().navTo("inspectionLots");
        },

        onLogout: function () {
            this.getOwnerComponent().getRouter().navTo("login");
        }
    });
});
