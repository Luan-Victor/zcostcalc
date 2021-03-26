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

			this.oDataServiceUrl = "/sap/opu/odata/sap/ZCOST_CALCULATION_SRV";
			this.oDataModel = new sap.ui.model.odata.ODataModel(this.oDataServiceUrl, true);
			sap.ui.getCore().setModel(this.oDataModel);

			// Search Help Matnr
			this._oMultiInput = this.getView().byId("inputMatnr");
			this.oColModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("elo/co/lvl/zcostcalc/model") + "/columnsModel.json");
			// this.getView().setModel(this.oDataModel);
		},

		onReset: function(oEvent) {
			var sMessage = "onReset trigered";
			sap.m.MessageToast.show(sMessage);
		},

		// Funcionando
		onSearch: function(oEvent) {

			// aCols = this.createColumnConfig();

			// Busca o valor informado na tela
			var filters = this.getScreenFilters();

			// var pMaterial = this.getView().byId("inputMatnr").getValue();

			// var filters = new Array();
			// var filterByName = new sap.ui.model.Filter("Material", FilterOperator.EQ, pMaterial);
			// filters.push(filterByName);

			// Verifica se os campos estão preenchidos
			if (this.checkScreenFilters(filters)) {

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

		getScreenFilters: function() {

			var filters = new Array();

			var inputField = this.getView().byId("inputKlvar").getValue();
			filters.push(new sap.ui.model.Filter("Klvar", FilterOperator.EQ, inputField));

            //Corrige o campo data para DateTime - evitando erro no webservice
			var fullDate = this.getView().byId("dPickerAmdat").getDateValue(); 
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern : "yyyy-MM-ddThh:mm:ss" });
			inputField = oDateFormat.format(fullDate);
			if(inputField !== ""){  
			filters.push(new sap.ui.model.Filter("Amdat", FilterOperator.EQ, inputField));  
			}
            
			inputField = this.getView().byId("inputTvers").getValue();
			if (inputField !== "") {
				filters.push(new sap.ui.model.Filter("Tvers", FilterOperator.EQ, inputField));
			}

			inputField = this.getView().byId("cboxLvorm").getSelected();
			if (inputField !== "") {
				filters.push(new sap.ui.model.Filter("Lvorm", FilterOperator.EQ, inputField));
			}

			inputField = this.getView().byId("inputWerks").getValue();
			filters.push(new sap.ui.model.Filter("Plant", FilterOperator.EQ, inputField));

			var aTokens = this.getView().byId("inputMatnr").getTokens();
			for (var i = 0; i < aTokens.length; i++) {

				if (typeof aTokens[i].data().range !== "undefined") {

					var aTokenRange = aTokens[i].data().range;
					filters.push(new sap.ui.model.Filter(
						"Material",
						aTokenRange.operation,
						aTokenRange.value1,
						aTokenRange.value2
					));

				} else {
					inputField = aTokens[i].getKey();
					filters.push(new sap.ui.model.Filter("Material", FilterOperator.EQ, inputField));
				}
			}

			return filters;

		},

		checkScreenFilters: function(filterTable) {

			// for (var i = 0; i < filterTable.length; i++) {

			// 	if (filterTable[i].sPath === "Plant" ||
			// 		filterTable[i].sPath === "Material" ||
			// 		filterTable[i].sPath === "Klvar") {

			// 		if (filterTable[i].oValue1 === "") {
			// 			sap.m.MessageToast.show("Preencher campos obrigatórios");
			// 			return false;
			// 		}
			// 	}
			// }

			return true;
		},

		onChangeDatePicker: function(oEvent) {
			this.oFilterBar.fireFilterChange(oEvent);
		},

		onSearchHelpWerks: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			this.oDialog = sap.ui.xmlfragment("elo.co.lvl.zcostcalc.view.fragment.valueHelpWerks", this);
			var path = "/ZshwerksSet";
			var oTableStdListTemplate = new sap.m.StandardListItem({
				title: "{Werks}",
				description: "{Name1}"
			});
			//create a filter for the binding
			var sInputValue = oEvent.getSource().getValue();
			var oFilterTableNo = new sap.ui.model.Filter("Werks", FilterOperator.Contains, sInputValue);
			this.oDialog.unbindAggregation("items");
			this.oDialog.bindAggregation("items", {
				path: path,
				template: oTableStdListTemplate,
				filters: [oFilterTableNo]
			});
			// open value help dialog filtered by the input value
			this.oDialog.open(sInputValue);
		},

		handleValueHelpWerksConfirm: function(e) {
			var s = e.getParameter("selectedItem");
			if (s) {
				this.byId(this.inputId).setValue(s.getBindingContext().getObject().Werks);
			}
			this.oDialog.destroy();
		},

		onSearchHelpKlvar: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			this.oDialog = sap.ui.xmlfragment("elo.co.lvl.zcostcalc.view.fragment.valueHelpKlvar", this);
			var path = "/ZshklvarSet";
			var oTableStdListTemplate = new sap.m.StandardListItem({
				title: "{Klvar}",
				description: "{Txklv}"
			});
			//create a filter for the binding
			var sInputValue = oEvent.getSource().getValue();
			var oFilterTableNo = new sap.ui.model.Filter("Klvar", FilterOperator.Contains, sInputValue);
			this.oDialog.unbindAggregation("items");
			this.oDialog.bindAggregation("items", {
				path: path,
				template: oTableStdListTemplate,
				filters: [oFilterTableNo]
			});
			// open value help dialog filtered by the input value
			this.oDialog.open(sInputValue);
		},

		handleValueHelpKlvarConfirm: function(e) {
			var s = e.getParameter("selectedItem");
			if (s) {
				this.byId(this.inputId).setValue(s.getBindingContext().getObject().Klvar);
			}
			this.oDialog.destroy();
		},

		onSearchHelpMatnr: function() {
			var aCols = this.oColModel.getData().cols;
			this._oBasicSearchField = new sap.m.SearchField({
				visible: false
			});
			this._oValueHelpDialog = sap.ui.xmlfragment("elo.co.lvl.zcostcalc.view.fragment.valueHelpMatnr", this);
			this.getView().addDependent(this._oValueHelpDialog);

			// var matnrLabel = this.getView().getModel("i18n").getResourceBundle().getText("filterMatnr");

			this._oValueHelpDialog.setRangeKeyFields([{
				label: "Matnr",
				key: "Matnr",
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);

			var oFilterBar = this._oValueHelpDialog.getFilterBar();
			oFilterBar.setFilterBarExpanded(false);
			oFilterBar.setBasicSearch(this._oBasicSearchField);

			this._oValueHelpDialog.getTableAsync().then(function(oTable) {
				oTable.setModel(this.oDataModel);
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZmatnrSet");
				}

				// if (oTable.bindItems) {
				// 	oTable.bindAggregation("items", "/ZmatnrSet", function () {
				// 		return new sap.m.ColumnListItem({
				// 			cells: aCols.map(function (column) {
				// 				return new sap.m.Label({ text: "{" + column.template + "}" });
				// 			})
				// 		});
				// 	});
				// }

				this._oValueHelpDialog.update();
			}.bind(this));

			this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			this._oValueHelpDialog.open();
		},

		onValueHelpOkPress: function(oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function() {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function() {
			this._oValueHelpDialog.destroy();
		},

		onFilterBarSearch: function(oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function(aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			// aFilters.push(new Filter({
			// 	filters: [
			// 		new Filter({ path: "Matnr", operator: FilterOperator.Contains, value1: sSearchQuery })
			// 	],
			// 	and: false
			// }));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTable: function(oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;

			oValueHelpDialog.getTableAsync().then(function(oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				// if (oTable.bindItems) {
				// 	oTable.getBinding("items").filter(oFilter);
				// }

				oValueHelpDialog.update();
			});
		},

		_onMultiInputValidate: function(oArgs) {
			if (oArgs.suggestionObject) {
				var oObject = oArgs.suggestionObject.getBindingContext().getObject(),
					oToken = new Token();

				oToken.setKey(oObject.Matnr);
				oToken.setText(oObject.Maktx + " (" + oObject.Matnr + ")");
				return oToken;
			}

			return null;
		},

		createColumnConfig: function(oModel) {
			var aCols = [];

			//Obtem o metadata do webservice
			var serviceMetadata = sap.ui.getCore().getModel(oModel).getServiceMetadata();
			//Obtem o schema do werbservice
			var modelSchema = serviceMetadata.dataServices.schema[0];
			//Obtem o número de entidades do webservice
			var lengthEntities = modelSchema.entityType.length;

			for (var i = 0; i < lengthEntities; i++) {

				//Verifica se é a entidade correta da tabela
				if (modelSchema.entityType[i].name === "calculated_cost") {

					//Obtem o número de colunas
					var lengthColumns = modelSchema.entityType[i].property.length;
					var oColumn = modelSchema.entityType[i].property;

					//Para cada coluna encontrada no webservice cria uma coluna para geração do excel
					for (var j = 0; j < lengthColumns; j++) {

						var arrayExtension = oColumn[j].extensions;
						var extension = arrayExtension.find(function(arrayExtension) {
							return arrayExtension.name === "label";
						});
						var labelText = extension.value;
						aCols.push({
							property: oColumn[j].name,
							type: oColumn[j].type,
							label: labelText
						});

					}

				}

			}

			return aCols;
		},

		onExport: function() {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			// if (!this._oTable) {
			this._oTable = this.byId("__table0");
			// }

			oTable = this._oTable;
			oRowBinding = oTable.getBinding("rows");

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