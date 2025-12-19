sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.Login", {
        onInit: function () {
        },

        onLogin: function () {
            var oView = this.getView();
            var sUsername = oView.byId("username").getValue();
            var sPassword = oView.byId("password").getValue();

            if (!sUsername) {
                MessageBox.error("Please enter username");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZBL_QUA_LOGIN_VIEW(username='" + sUsername + "')";

            oView.setBusy(true);
            oModel.read(sPath, {
                success: function (oData) {
                    oView.setBusy(false);
                    if (oData.login_status === "Success") {
                        // Store user info if needed
                        sap.ui.getCore().setModel(new JSONModel(oData), "userModel");
                        // Navigate to dashboard
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("dashboard");
                    } else {
                        MessageBox.error("Authentication Failed: " + (oData.message || "Invalid credentials"));
                    }
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    var sMsg = "Error connecting to service";
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        sMsg = oResponse.error.message.value;
                    } catch (e) {}
                    MessageBox.error(sMsg);
                }
            });
        }
    });
});
