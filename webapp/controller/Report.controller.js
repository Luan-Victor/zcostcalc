sap.ui.define([
	"elo/co/lvl/zcostcalc/controller/BaseController",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/type/String",
	"sap/m/Token",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/FilterType"	
], function(BaseController, ODataModel, Filter, FilterOperator, typeString, Token, exportLibrary, Spreadsheet) {
	"use strict";

	var EdmType = exportLibrary.EdmType;

	return BaseController.extend("elo.co.lvl.zcostcalc.controller.Report", {

		onInit: function(oEvent) {

			this.oDataServiceUrl = "/sap/opu/odata/sap/ZCOST_CALCULATION_SRV/";
			this.oDataModel = new sap.ui.model.odata.ODataModel(this.oDataServiceUrl, true);
			sap.ui.getCore().setModel(this.oDataModel);

			// this._oMultiInput = this.getView().byId("multiInput");

		},

		onReset: function(oEvent) {
			var sMessage = "onReset trigered";
			sap.m.MessageToast.show(sMessage);
		},

		// Funcionando
		onSearch: function(oEvent) {

			// Busca o valor informado na tela
			var pMaterial = this.getView().byId("inputMatnr").getValue();

			var filters = new Array();
			var filterByName = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, pMaterial);
			filters.push(filterByName);

			// Verifica se os campos estão preenchidos
			if (this.getView().getController().onCheckFields()) {

				// Chama o serviço passando  filtros
				var sServiceUrl = "/sap/opu/odata/sap/ZCOST_CALCULATION_SRV";
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var that = this;
				oModel.read("/calculated_costSet", {
					filters: filters,
					success: function(oData, oResponse) {
						that.getView().byId("__table0").setModel(oModel);
					},
					error: function(oError) {}
				});

			}
		},

		onValueHelpRequested: function() {
			// this._oValueHelpDialog = sap.ui.xmlfragment("elo.co.lvl.zcostcalc.view.ValueHelpDialogConditionsTabOnly", this);
			// this.getView().addDependent(this._oValueHelpDialog);
			// this._oValueHelpDialog.setRangeKeyFields([{
			// 	label: "Material",
			// 	key: "MatnrId",
			// 	type: "string",
			// 	typeInstance: new typeString({}, {
			// 		maxLength: 7
			// 	})
			// }]);

			// this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			// this._oValueHelpDialog.open();
		},

		onValueHelpOkPress: function(oEvent) {
			// var aTokens = oEvent.getParameter("tokens");
			// this._oMultiInput.setTokens(aTokens);
			// this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function() {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function() {
			this._oValueHelpDialog.destroy();
		},

		onSearchHelpMatnr: function(oEvent) {
			// var sInputValue = oEvent.getSource().getValue();
			// this.inputId = oEvent.getSource().getId();
			// var path;
			// var oTableStdListTemplate;
			// var oFilterTableNo;
			// this.oDialog = sap.ui.xmlfragment("elo.co.lvl.zcostcalc.view.valueHelpTable", this);
			// path = "/ZmatnrSet";
			// oTableStdListTemplate = new sap.m.StandardListItem({
			// 	title: "{Matnr}",
			// 	description: "{Matnr}"
			// }); // //create a filter for the binding
			// oFilterTableNo = new sap.ui.model.Filter("Matnr", FilterOperator.Contains, sInputValue);
			// this.oDialog.unbindAggregation("items");
			// this.oDialog.bindAggregation("items", {
			// 	path: path,
			// 	template: oTableStdListTemplate,
			// 	filters: [oFilterTableNo]
			// }); // }// open value help dialog filtered by the input value
			// this.oDialog.open(sInputValue);
		},

		handleTableValueHelpConfirm: function(e) {
			var s = e.getParameter("selectedItem");
			if (s) {
				this.byId(this.inputId).setValue(s.getBindingContext().getObject().Matnr);
				this.readRefresh(e);
			}
			this.oDialog.destroy();
		},

		onCheckFields: function() {
			// return this.getView().byId("materialSelect").getSelectedItem().getText() === "" ? false : true;
			return true;
		},

		createColumnConfig: function() {
			var aCols = [];

			aCols.push({
				property: "Matnr",
				type: EdmType.String
			});

			aCols.push({
				property: "Maktx",
				type: EdmType.String
			});

			return aCols;
		},

		onExport: function() {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId("__table0");
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding("items");

			aCols = this.createColumnConfig();

			var oModel = oRowBinding.getModel();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: "Level"
				},
				dataSource: {
					type: "odata",
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: this._sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true // Default for ODataModel V2
				},
				fileName: "Table export sample.xlsx",
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		}
	});
});