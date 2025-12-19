sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History"
], function (Controller, Filter, FilterOperator, History) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.InspectionLotList", {
        formatter: {
            statusText: function (sCode) {
                if (sCode === "PENDING") {
                    return "Pending";
                } else if (sCode === "A") {
                    return "Approved";
                } else if (sCode === "R") {
                    return "Rejected";
                }
                return sCode || "Unknown";
            },
            statusState: function (sCode) {
                if (sCode === "PENDING") {
                    return "Warning";
                } else if (sCode === "A") {
                    return "Success";
                } else if (sCode === "R") {
                    return "Error";
                }
                return "None";
            }
        },

        onInit: function () {
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilter = [];
            if (sQuery) {
                aFilter.push(new Filter("MaterialDesc", FilterOperator.Contains, sQuery));
            }
            var oList = this.getView().byId("inspectionTable");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },

        onPressLot: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext("inspection");
            var sLotId = oCtx.getProperty("InspectionLot");
            this.getOwnerComponent().getRouter().navTo("lotDetail", {
                lotId: sLotId
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("dashboard", {}, true);
            }
        }
    });
});
