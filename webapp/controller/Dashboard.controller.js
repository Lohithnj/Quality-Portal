sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.Dashboard", {
        onInit: function () {
        },

        onPressInspectionLot: function () {
            this.getOwnerComponent().getRouter().navTo("inspectionLots");
        },

        onLogout: function () {
            this.getOwnerComponent().getRouter().navTo("login");
        }
    });
});
