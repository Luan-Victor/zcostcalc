sap.ui.require(
	["sap/m/Shell",
		"sap/m/App",
		"sap/m/Page",
		"sap/ui/core/ComponentContainer"
	],

	function(Shell, App, Page, ComponentContainer) {
		"use strict";

		sap.ui.getCore().attachInit(function() {
			new Shell({
				app: new ComponentContainer({
					height: "100%",
					name: "elo.co.lvl.zcostcalc",
					settings: {
						id: "elo.co.lvl.zcostcalc"

					}

				})

			}).placeAt("content");

		});

	});