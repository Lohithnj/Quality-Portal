sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.Login", {
        onInit: function () {
        },

        onLogin: function () {
            var oView = this.getView();
            var sUsername = oView.byId("username").getValue();
            var sPassword = oView.byId("password").getValue();

            if (!sUsername || !sPassword) {
                MessageBox.error("Please enter both username and password");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();

            // Using filters ensures the backend checks both fields
            var aFilters = [
                new Filter("username", FilterOperator.EQ, sUsername),
                new Filter("password", FilterOperator.EQ, sPassword)
            ];

            oView.setBusy(true);
            oModel.read("/ZBL_QUA_LOGIN_VIEW", {
                filters: aFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    // Check if any matching user was returned with Success status
                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];
                        if (oUser.login_status === "Success") {
                            // Store user info
                            sap.ui.getCore().setModel(new JSONModel(oUser), "userModel");
                            // Navigate to dashboard
                            this.getOwnerComponent().getRouter().navTo("dashboard");
                        } else {
                            MessageBox.error("Authentication Failed: Invalid credentials");
                        }
                    } else {
                        MessageBox.error("Authentication Failed: User not found or incorrect password");
                    }
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    var sMsg = "Error connecting to service";
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        sMsg = oResponse.error.message.value;
                    } catch (e) { }
                    MessageBox.error(sMsg);
                }
            });
        }
    });
});
