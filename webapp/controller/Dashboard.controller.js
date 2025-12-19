sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.Dashboard", {
        onInit: function () {
            var oViewModel = new JSONModel({
                totalLots: 0,
                pendingResults: 0,
                pendingUsage: 0
            });
            this.getView().setModel(oViewModel, "dashboard");

            this._fetchCounts();
        },

        _fetchCounts: function () {
            var oModel = this.getOwnerComponent().getModel("inspection");
            var oViewModel = this.getView().getModel("dashboard");

            // Fetch Total Lots
            oModel.read("/ZBL_QUA_INSPECTION_VIEW/$count", {
                success: function (sCount) {
                    oViewModel.setProperty("/totalLots", sCount);
                }
            });

            // Fetch Pending Lots (Assuming 'PENDING' is the code for both results and usage)
            var aFilters = [new Filter("UsageDecisionCode", FilterOperator.EQ, "PENDING")];
            oModel.read("/ZBL_QUA_INSPECTION_VIEW/$count", {
                filters: aFilters,
                success: function (sCount) {
                    oViewModel.setProperty("/pendingResults", sCount);
                    oViewModel.setProperty("/pendingUsage", sCount);
                }
            });
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
