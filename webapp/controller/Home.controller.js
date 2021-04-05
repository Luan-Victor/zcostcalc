sap.ui.define([
	"elo/co/lvl/zcostcalc/controller/BaseController",
	"sap/m/MessageBox"
], function(BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("elo.co.lvl.zcostcalc.controller.Home", {
		onNavToRegister: function() {

			var messageBoxText = this.getView().getModel("i18n").getResourceBundle().getText("MessageBoxNavText");
			var messageBoxTitle = this.getView().getModel("i18n").getResourceBundle().getText("MessageBoxNavTitle");

			MessageBox.confirm(messageBoxText, {
				title: messageBoxTitle,
				icon: MessageBox.Icon.INFORMATION,
				onClose: function(oAction) {
					if (oAction === "OK") {

						// get a handle on the global XAppNav service
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.isIntentSupported(["zcot001-display"])

						.done(function(aResponses) {

						})

						.fail(function() {
							sap.m.MessageToast("Provide corresponding intent to navigate");
						});

						// generate the Hash to display a employee Id
						var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
							target: {
								semanticObject: "zcot001",
								action: "display"
							}
						})) || ""; //Generate a  URL for the second application
						var url = window.location.href.split("#")[0] + hash; 
						//Navigate to second app
						sap.m.URLHelper.redirect(url, true);
					}
				}
			});
		},
		
		onNavToReport: function() {
			this.getRouter().navTo("report");
       	 //var loRouter = sap.ui.core.UIComponent.getRouterFor(this);
       	 //loRouter.navTo("report");			
		},
		
		onNavToCK40N: function(oEvent) {
			var messageBoxText = this.getView().getModel("i18n").getResourceBundle().getText("MessageBoxNavText");
			var messageBoxTitle = this.getView().getModel("i18n").getResourceBundle().getText("MessageBoxNavTitle");

			MessageBox.confirm(messageBoxText, {
				title: messageBoxTitle,
				icon: MessageBox.Icon.INFORMATION,
				onClose: function(oAction) {
					if (oAction === "OK") {

						// get a handle on the global XAppNav service
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.isIntentSupported(["MaterialCostEstimateRun-createEdit"])

						.done(function(aResponses) {

						})

						.fail(function() {
							sap.m.MessageToast("Provide corresponding intent to navigate");
						});

						// generate the Hash to display a employee Id
						var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
							target: {
								semanticObject: "MaterialCostEstimateRun",
								action: "createEdit"
							}
						})) || ""; //Generate a  URL for the second application
						var url = window.location.href.split("#")[0] + hash; 
						//Navigate to second app
						sap.m.URLHelper.redirect(url, true);
					}
				}
			});
		}
		
	});
});