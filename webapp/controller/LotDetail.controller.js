sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("com.kaar.quality.controller.LotDetail", {
        formatter: {
            statusText: function (sCode) {
                if (sCode === "PENDING") { return "Pending"; }
                if (sCode === "A") { return "Approved"; }
                if (sCode === "R") { return "Rejected"; }
                return sCode || "Unknown";
            },
            statusState: function (sCode) {
                if (sCode === "PENDING") { return "Warning"; }
                if (sCode === "A") { return "Success"; }
                if (sCode === "R") { return "Error"; }
                return "None";
            }
        },

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("lotDetail").attachMatched(this._onRouteMatched, this);

            this.getView().setModel(new JSONModel({
                unrestricted: 0,
                block: 0,
                production: 0,
                totalEntered: 0,
                canDecide: false,
                isEditable: false
            }), "localModel");

            // Initialize local persistence storage if not exists
            if (!this._persistedData) {
                this._persistedData = {};
            }
        },

        _onRouteMatched: function (oEvent) {
            var sLotId = oEvent.getParameter("arguments").lotId;
            var sPath = "/ZBL_QUA_INSPECTION_VIEW('" + sLotId + "')";

            this.getView().bindElement({
                path: sPath,
                model: "inspection",
                events: {
                    dataReceived: function (oData) {
                        this._updateLocalModel(oData.getParameter("data"));
                    }.bind(this)
                }
            });

            // If data is already there (coming from list)
            var oContext = this.getView().getModel("inspection").getContext(sPath);
            if (oContext) {
                this._updateLocalModel(oContext.getObject());
            }
        },

        _updateLocalModel: function (oData) {
            if (!oData) return;

            var oLocalModel = this.getView().getModel("localModel");
            var sLotId = oData.InspectionLot;
            var bIsPending = oData.UsageDecisionCode === "PENDING";

            // Load from persistence or default
            var oSaved = this._persistedData[sLotId] || {
                unrestricted: 0,
                block: 0,
                production: 0
            };

            oLocalModel.setData({
                unrestricted: oSaved.unrestricted,
                block: oSaved.block,
                production: oSaved.production,
                totalEntered: parseFloat(oSaved.unrestricted) + parseFloat(oSaved.block) + parseFloat(oSaved.production),
                isEditable: bIsPending,
                canDecide: false
            });

            this._validateQuantity();
        },

        onLiveChange: function () {
            var oLocalModel = this.getView().getModel("localModel");
            var oData = oLocalModel.getData();

            var fTotal = (parseFloat(oData.unrestricted) || 0) +
                (parseFloat(oData.block) || 0) +
                (parseFloat(oData.production) || 0);

            oLocalModel.setProperty("/totalEntered", fTotal);

            // Persist locally
            var sLotId = this.getView().getBindingContext("inspection").getProperty("InspectionLot");
            this._persistedData[sLotId] = {
                unrestricted: oData.unrestricted,
                block: oData.block,
                production: oData.production
            };

            this._validateQuantity();
        },

        _validateQuantity: function () {
            var oView = this.getView();
            var oLocalModel = oView.getModel("localModel");
            var fTotalEntered = oLocalModel.getProperty("/totalEntered");
            var fLotQty = parseFloat(oView.getBindingContext("inspection").getProperty("LotQuantity")) || 0;

            oLocalModel.setProperty("/canDecide", fTotalEntered === fLotQty);
        },

        onDecision: function (oEvent) {
            var sDecision = oEvent.getSource().data("decision");
            var sMsg = sDecision === "A" ? "Approve this lot?" : "Reject this lot?";

            MessageBox.confirm(sMsg, {
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        MessageBox.success("Lot " + (sDecision === "A" ? "Approved" : "Rejected") + " effectively (Simulated - Local state updated)");
                        // Update OData locally (simulated since we don't have POST yet)
                        var oContext = this.getView().getBindingContext("inspection");
                        this.getView().getModel("inspection").setProperty(oContext.getPath() + "/UsageDecisionCode", sDecision);
                        this.getView().getModel("localModel").setProperty("/isEditable", false);
                    }
                }.bind(this)
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("inspectionLots");
        }
    });
});
