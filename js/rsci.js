var 		libraryUrl = 'http://kgrid.med.umich.edu/stack2/knowledgeObject/{0}/result';
var prosID;
var lungID ;
var liverID;
var prosInterpreterId;
var lungInterpreterId;
var liverInterpreterId;
var prosInput = '';
var lungInput = '';
var liverInput = '';
var devServer = true;
var inputname = [ "age", // lung cancer, Prostate , Liver Cancer
"Race", // Lung Cancer, Prostate
"DRE", // Prostate
"PSA", // Prostate
"PriorBiop", // Prostate
"edLevel", // lung cancer
"bmi", // lung cancer
"hxLungCancer", // lung cancer
"hxLungCancerFam", // lung cancer
"hxNonLungCancerDz", // lung cancer
"yrsSmoker", // lung cancer
"cigsPerDay", // lung cancer
"yrsQuit", // lung cancer
"HBVDNAlevel", // liver cancer
"ALT", // liver cancer
"HBeAg", // liver cancer
"HepB", // liver Cancer - newly added
"gender" // liver cancer
];

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function serverCheck(devServer) {
	if (devServer) {

		prosID = 'ark:/99999/fk4571p57h'; //ark:/99999/OT10164
		lungID = 'ark:/99999/fk4jh3tk9s';  //ark:/99999/OT10155
		liverID = 'ark:/99999/fk41g0zc28'; //ark:/99999/OT10156

		prosInterpreterId = 'ark:/99999/fk4n87hh26'; //ark:/99999/OT10157
		lungInterpreterId = 'ark:/99999/fk4805c32z'; //ark:/99999/OT10158
		liverInterpreterId = 'ark:/99999/fk4474n87d'; //ark:/99999/OT10159
	}
}

function appendLog(message) {
	var d = new Date();
	var ts = d.toISOString();
	$("#statusArea").append("\n" + d + "   " + message);
	$("#statusArea")[0].scrollTop = $("#statusArea")[0].scrollHeight;
}

function send() {
	initInput();
	appendLog("Sending Patient Data to Knowledge Objects ... ");
	prosURL = libraryUrl.replace("{0}",prosID);
	lungURL = libraryUrl.replace("{0}",lungID);
	liverURL = libraryUrl.replace("{0}",liverID);
	updateResult("prosData", prosInput, prosURL,prosID);
	updateResult("lungData", lungInput, lungURL,lungID);
	updateResult("liverData", liverInput, liverURL,liverID);
}
var patient_json = [];
function initPatientData(){
	console.log("Starting retrieving patient data...");
	$.getJSON("./data/patient_data.json", function(data){
		patient_json = data;
		  console.log(patient_json);
		});
}

function initInput() {

	var africanAmerican = 0;
	if (document.dataForm.Race.value == 2) {
		africanAmerican = 1;
	}

	var objProsInput = new Object();
	objProsInput.Age = document.dataForm.age.value ;
	objProsInput.gender = document.dataForm.gender.value ;
	objProsInput.AA = africanAmerican ;
	objProsInput.PSA = document.dataForm.PSA.value ;
	objProsInput.DRE = document.dataForm.DRE.value ;
	objProsInput.PriorBiop = document.dataForm.PriorBiop.value ;
	objProsInput.FamHist = document.dataForm.hxLungCancerFam.value ;
	prosInput = JSON.stringify(objProsInput);

	var objLungInput = new Object();
	objLungInput.age = document.dataForm.age.value ;
	objLungInput.ethnicity = document.dataForm.Race.value ;
	objLungInput.edLevel = document.dataForm.edLevel.value ;
	objLungInput.bmi = document.dataForm.bmi.value ;
	objLungInput.hxLungCancer = document.dataForm.hxLungCancer.value ;
	objLungInput.hxLungCancerFam = document.dataForm.hxLungCancerFam.value ;
	objLungInput.hxNonLungCancerDz = document.dataForm.hxNonLungCancerDz.value ;
	objLungInput.yrsSmoker = document.dataForm.yrsSmoker.value ;
	objLungInput.yrsQuit = document.dataForm.yrsQuit.value ;
	objLungInput.cigsPerDay = document.dataForm.cigsPerDay.value ;
	lungInput = JSON.stringify(objLungInput) ;

	var objLiverInput = new Object();
	objLiverInput.age = document.dataForm.age.value ;
	objLiverInput.gender = document.dataForm.gender.value ;
	objLiverInput.ALT = document.dataForm.ALT.value ;
	objLiverInput.HBeAg = document.dataForm.HBeAg.value ;
	objLiverInput.HepB = document.dataForm.HepB.value ;
	objLiverInput.HBVDNAlevel = document.dataForm.HBVDNAlevel.value ;
	liverInput = JSON.stringify(objLiverInput);
}

function interpretProstateCancerScore() {

	var htmlResult = document.getElementById("prosRawData").innerHTML;
	var actualResult = htmlResult.replace("[", "");
	actualResult = actualResult.replace("]", "");

	var risks = actualResult.split(",");
	var obj = new Object();
	obj.noRisk = risks[0] ;
	obj.lowRisk = risks[1] ;
	obj.highRisk = risks[2];

	prostateInterpreterIp =  JSON.stringify(obj);

	console.log("Prostate Interpret:" + prostateInterpreterIp);
	appendLog("Sending Risk Score to Interpreter " + prosInterpreterId);

	var interpreterURL = libraryUrl.replace("{0}",prosInterpreterId);

	$
			.ajax({
				type : 'POST',
				// url : 'http://localhost:8080/ObjectTeller/rest/getResult', // if using a remote instance (cross origin)
				url : interpreterURL,
				data : prostateInterpreterIp,
				// dataType : "json",
                // crossDomain: true, // didn't seem to be needed (forces cross domain even if same origin?)
				headers: { // dataType: "json" didn't work
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				success : function(responseData, textStatus, jqXHR) {
				  console.log("Response");
			console.log(responseData);

					var finalOut;

						appendLog("Receiving risk interpretation result from "
								+ prosInterpreterId);
						displayText("prosSource",responseData.source);
						document.getElementById("prosInterpret").innerHTML = responseData.result;


				},
				error : function(responseData, textStatus, errorThrown) {
					document.getElementById("prosInterpret").innerHTML = "Unable to interpret risk score. ";
				}
			});
}

function displayText(id, text) {
	document.getElementById(id).innerHTML = text;
}

function displayResult(id, result) {
    console.log("Result: ");
     console.log(result)
  if(typeof result == Array){
    var multirisks = result;

    console.log(multirisks);
  } else {
    var singleRisk = fixdecimalplace(parseFloat(result), 1);
    console.log("Risk" + singleRisk);
  }
	var resultText= result+"";
	var actualResult = resultText.replace("[", "");
	actualResult = actualResult.replace("]", "");
	var rawid = id.replace("Data", "RawData");
	var risks = actualResult.split(",");
	var title_pros = [ "NO RISK", "LOW GRADE", "HIGH GRADE" ];
	var title_3yr = " THREE-YEAR RISK ";
	var title_6yr = " SIX-YEAR RISK ";
	console.log(risks.length);
	var resultHtml = "";
	var riskFixed;
	for (var i = 0; i < risks.length; i++) {
		if (risks[i] < 1) {
			riskFixed = fixdecimalplace(parseFloat(risks[i]), 1);
		} else {
			riskFixed = fixdecimalplace(parseFloat(risks[i]), 1);

		}
		if (id.startsWith("pros")) {
			title = title_pros[i];
		} else if (id.startsWith("liver")) {
			title = title_3yr;
		} else {
			title = title_6yr;
		}
		resultHtml = resultHtml + addScoreCard(title, riskFixed);
	}
	document.getElementById(rawid).innerHTML = result;
	document.getElementById(id).innerHTML = resultHtml;
}

function addScoreCard(title, score) {
	var startTag = "<div class='scoreDisplay'>";
	var endTag = "</div>";
	var titleTag = "<div class='scoreTitle'>" + title + "</div>";
	var scoreTag = "<div class='scoreResult'>" + score
			+ "<span> %</span></div>";
	var card = startTag + titleTag + scoreTag + endTag;
	return card;
}
function resetDisplay() {
	$("[id$='Data']").text("Awaiting input");
	$("[id$='Interpret']").text("");
	$("[id$='InterpretBtn']").prop("disabled", true);
	$("#calc").prop("disabled", true);
}
function updateResult(id, input, url, objId) {
	var div_id = "#" + id.replace("Data", "Interpret");
	$(div_id).empty();
	var obj = JSON.parse(input);
	if (id.endsWith("Interpret")) {
		appendLog("Sending Risk Score to Interpreter " + objId);
	} else {
		appendLog("Sending Patient Data to Risk Calculator " + objId);
	}
	console.log(input);
	$.ajax({
		type : 'POST',
		// url : 'http://localhost:8080/ObjectTeller/rest/getResult', // if using a remote instance (cross origin)
		url : url, // for an endpoint on the same domain
		data : input,
		// dataType : "json",
		// crossDomain: true, // didn't seem to be needed (forces cross domain even if same origin?)
		headers: { // dataType: "json" didn't work
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		success : function(responseData, textStatus, jqXHR) {
			var out ;
			var btn_id = "#" + id.replace("Data", "InterpretBtn");
      console.log("Response");
			console.log(responseData);

			if (responseData.result) {
				out = responseData.result;
        if(out.result){
          out=out.result;
        }
				$(btn_id).prop("disabled", false);
				if (id.endsWith("Interpret")) {
					displayText(id, out);
					displayText(id.replace("Interpret", "Source"),responseData.source);
					appendLog("Receiving risk interpretation result from "
							+ objId);
				} else {
					displayResult(id, out);
					appendLog("Receiving risk calculation result from "
							+ objId);
				}

			} else {
				if (responseData.success == 0) {
					out = ' ' + responseData.errorMessage;
					appendLog("Error Message from " + objId + ":"
							+ responseData.errorMessage);
					$(btn_id).prop("disabled", true);
				} else {
					out = ' ' + responseData;
					appendLog("Error Message from " + objId + ":"
							+ responseData);
				}
				document.getElementById(id).innerHTML = out;
			}

		},
		error : function(responseData, textStatus, errorThrown) {
			console.log(responseData);
			var btn_id = "#" + id.replace("Data", "InterpretBtn");
			if(responseData.status==400){
				var out = ' ' + responseData.responseJSON.message.slice(responseData.responseJSON.message.indexOf(':')+2);
				appendLog("Error Message from " + objId + ":"
						+ responseData.errorMessage);
				$(btn_id).prop("disabled", true);
				document.getElementById(id).innerHTML = out;


			}else{
			var out = "Unable to retrieve risk score. ";
			document.getElementById(id).innerHTML = out;
		}
		}
	});
}

function fixdecimalplace(input, n) {
	var fixatn = input.toFixed(n);
	return fixatn;
}

$(document)
		.ready(
				function() {
					var aurl= getQueryVariable('stack');
					if(aurl){
						libraryUrl = aurl+'/knowledgeObject/{0}/result';
					}
					var inputname = [ "age", // lung cancer, Prostate , Liver
												// Cancer
					"Race", // Lung Cancer, Prostate
					"DRE", // Prostate
					"PSA", // Prostate
					"PriorBiop", // Prostate
					"edLevel", // lung cancer
					"bmi", // lung cancer
					"hxLungCancer", // lung cancer
					"hxLungCancerFam", // lung cancer
					"hxNonLungCancerDz", // lung cancer
					"yrsSmoker", // lung cancer
					"cigsPerDay", // lung cancer
					"yrsQuit", // lung cancer
					"HBVDNAlevel", // liver cancer
					"ALT", // liver cancer
					"HBeAg", // liver cancer
					"HepB", // liver Cancer - newly added
					"gender" // liver cancer
					];
					var patient = [ { // Patient 1
						age : 65,
						Race : 1,
						DRE : 1,
						PSA : 2,
						PriorBiop : 1,
						edLevel : 1,
						bmi : 27,
						hxLungCancer : 1,
						hxLungCancerFam : 1,
						hxNonLungCancerDz : 1,
						yrsSmoker : 20,
						cigsPerDay : 8,
						yrsQuit : 5,
						HBVDNAlevel : 99999,
						ALT : 47,
						HBeAg : 1,
						HepB : 1,
						gender : 'M'
					}, { // Patient 2
						age : 56,
						Race : 1,
						DRE : 1,
						PSA : 1,
						PriorBiop : 1,
						edLevel : 6,
						bmi : 23.4,
						hxLungCancer : 0,
						hxLungCancerFam : 0,
						hxNonLungCancerDz : 0,
						yrsSmoker : 10,
						cigsPerDay : 10,
						yrsQuit : 20,
						HBVDNAlevel : 300,
						ALT : 47,
						HBeAg : 0,
						HepB : 1,
						gender : 'M'
					}, { // Patient 3
						age : 56,
						Race : 1,
						DRE : 1,
						PSA : 1,
						PriorBiop : 1,
						edLevel : 1,
						bmi : 23.4,
						hxLungCancer : 1,
						hxLungCancerFam : 0,
						hxNonLungCancerDz : 1,
						yrsSmoker : 10,
						cigsPerDay : 10,
						yrsQuit : 10,
						HBVDNAlevel : 0,
						ALT : 47,
						HBeAg : 0,
						HepB : 0,
						gender : 'M'
					} ];
					resetDisplay();
					initPatientData();
					serverCheck(devServer);
					$(".psel")
							.click(
									function() {
										var selectedPatient = $(this).attr(
												'value');
										var selectedPatientIndex = $(this)
												.attr('index');
										var index = parseInt(selectedPatientIndex) + 1;
										appendLog("Patient " + index
												+ " has been selected.");
										var l = inputname.length;
										for (var i = 0; i < l; i++) {
											$('input[name="'+ inputname[i]+ '"]')
													.val([patient_json.patients[selectedPatientIndex][inputname[i]] ]);
										}
										$('#Race')
												.val([patient_json.patients[selectedPatientIndex]['Race'] ]);
										$('#edLevel')
												.val([ patient_json.patients[selectedPatientIndex]['edLevel'] ]);
										resetDisplay();
										$("#calc").prop("disabled", false);
									})
					$("[id$='InterpretBtn']").click(

							function() {
								var btn_id = this.id;
								var scoreid = btn_id.replace("InterpretBtn",
										"RawData");
								var actualResult = document
										.getElementById(scoreid).innerHTML;
								var id = btn_id.replace("InterpretBtn",
										"Interpret");
								var interpreterId = "";
								if (btn_id.startsWith("liver")) {
									interpreterId = liverInterpreterId;
									interpreterURL = libraryUrl.replace("{0}",liverInterpreterId);
								} else if (btn_id.startsWith("lung")) {
									interpreterId = lungInterpreterId;
									interpreterURL = libraryUrl.replace("{0}",lungInterpreterId);
								} else if (btn_id.startsWith("pros")) {
									interpreterId = prosInterpreterId;
								}

								var obj = new Object();
								obj.risk = actualResult;

								var interpreterInput = JSON.stringify(obj);

								console.log(interpreterInput);
								if (!(btn_id.startsWith("pros"))) {
									updateResult(id, interpreterInput , interpreterURL,interpreterId);
								}
							});
					var statusShown = true;
					$("#hideBtn").click(function() {
						if (statusShown) {
							$("#statusArea").hide();
							$("#hideBtn").text('SHOW');
							statusShown = false;
						} else {
							$("#hideBtn").text('HIDE');
							$("#statusArea").show();
							statusShown = true;
						}
					});
					$("[id$='Data']").hover(function() {
						var hoveredElement = this.id.replace("Data", "");
						$("." + hoveredElement).addClass("highlighted");
					}, function() {
						$(".highlighted").removeClass("highlighted");
					});
				});
