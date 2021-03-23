sap.ui.define([
	"elo/co/lvl/zcostcalc/controller/BaseController"
], function(BaseController, ResourceModel) {
	"use strict";

	return BaseController.extend("elo.co.lvl.zcostcalc.controller.App", {

		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

	});
});