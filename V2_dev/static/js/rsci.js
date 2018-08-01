var libraryUrl = 'http://kgrid.med.umich.edu/stack2/knowledgeObject/{0}/result';
var prosID;
var lungID ;
var liverID;
var prosInterpreterId;
var lungInterpreterId;
var liverInterpreterId;
var prosInput = '';
var lungInput = '';
var liverInput = '';

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
	// $("#calc").prop("disabled", true);
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
					$("[id$='Data']").hover(function() {
						var hoveredElement = this.id.replace("Data", "");
						$("." + hoveredElement).addClass("highlighted");
					}, function() {
						$(".highlighted").removeClass("highlighted");
					});
				});

var eventBus = new Vue();
Vue.component('scorecard', {
	template: '#scorecard-template',
	props: [
  	'label',
		'score'
	]
})

var demo = new Vue({
	el: '#app',
	data: function(){
  	return {
			patientModel:{patient:{name:"",id:"",gender:"",age:"",condition:0,rsm:0,obsv:0}},
      patientSelected:{},
			recommList:[],
			isInit:true,
			hasError: false,
			error404: false,
			autofillSelection: "",
			eventlog:[],
			localserver: false,
			objLeadUrl:"/knowledgeObject/",
      patientinput:{"pros":{},"lung":{},"liver":{}},
      inputready: false,
      scoreready: {"pros":false, "lung" : false, "liver": false},
      configjson:{},
      patientdata:{},
      curversion:"v1",
      resultready:{"pros":false,"lung":false,liver:false},
      results:{"pros":[],"lung":0,liver:0},
      rawresults:{pros:[],lung:0,liver:0},
      interp:{pros:false,lung:false,liver:false},
      highlighted:{pros:false,lung:false,liver:false}
    }
  },
  mounted:function(){
    var self =this;
    this.appendLog('app',"Application Event : Retrieved Sample Patient Data ...");
    axios.get("./static/json/config.json").then(response=> {
      console.log(response.data)
      self.configjson =JSON.parse(JSON.stringify(response.data))
      axios.get("./static/json/patient_data.json").then(resp=> {
        self.patientdata=JSON.parse(JSON.stringify(resp.data))
      }).catch(error=>{
        console.log(error)
      })

    }).catch(e=>{
			console.log(e)
		})
    if(this.getQueryVariable('version')){
      this.curversion=this.getQueryVariable('version')
    }

  },
  computed: {
    activator_url: function(){
      return this.configjson[this.curversion].activator_url
    },
    inputtemplate: function(){
      return this.configjson[this.curversion].inputtemplate
    },
    liverinput: function(){
      var self=this
      var obj = {}
      if(this.autofillSelection!=''){
        this.inputtemplate.forEach(function(e){
          if(e.liver){
              console.log(e.fieldname + ' '+e.pros +' '+e.lung+' '+e.liver)
            obj[e.fieldname]=self.patientSelected[e.fieldname]
          }
        })
      }
      return obj
    },
    lunginput: function(){
      var self=this
      var obj = {}
      if(this.autofillSelection!=''){
        this.inputtemplate.forEach(function(e){
          if(e.lung){
              console.log(e.fieldname + ' '+e.pros +' '+e.lung+' '+e.liver)
            obj[e.fieldname]=self.patientSelected[e.fieldname]
          }
        })
        obj.ethnicity=self.patientSelected.Race
      }
      return obj
    },
    prostateinput: function(){
      var self=this
      var obj = {}
      if(this.autofillSelection!=''){
        this.inputtemplate.forEach(function(e){
          if(e.pros){
            console.log(e.fieldname + ' '+e.pros +' '+e.lung+' '+e.liver)
            obj[e.fieldname]=self.patientSelected[e.fieldname]
          }
        })
        if(self.patientSelected.Race==2){
          obj.AA= 1
        }else {
          obj.AA=0
        }
        obj.Age=self.patientSelected.age
        obj.FamHist = self.patientSelected.hxLungCancerFam
      }
      return obj
    },
    prosinterpinput:function(){
      var obj = {}
      obj.noRisk = this.rawresults.pros[0] ;
    	obj.lowRisk = this.rawresults.pros[1] ;
    	obj.highRisk = this.rawresults.pros[2];
      return obj
    },
    lunginterpinput:function(){
      var obj = {}
      obj.risk=ths.rawresults.lung;
      return obj
    },
    liverinterpinput:function(){
      var obj = {}
      obj.risk=ths.rawresults.liver;
      return obj
    },
  },
  watch:{
    autofillSelection:function(){
      var self=this;
      if(this.autofillSelection!=""){
        // this.inputFormModel.forEach(function(e){
        //   e.value=false;
        // });
        var i=parseInt(this.autofillSelection)
        window.setTimeout(function(){
          self.autofill(i)}, 50);
        this.appendLog('app',"Application Event : Autofill sample "+i+ " is selected.");
      }else {
        ths.inputready=false;
      }
    }
  },
  methods:{
  	appendLog:function(key,s){
  		var ts = moment().format("ddd, MMM Do YYYY, h:mm:ss A Z");
  		console.log(ts);
  		var entry = {};
  		entry.key=key;
  		entry.timestamp = ts;
  		entry.text=s;
  		this.eventlog.push(entry);
  		this.scrollToEnd();
  	},
    scrollToEnd: function() {
        var container = this.$el.querySelector("#statuslog");
        container.scrollTop = container.scrollHeight;
    },
    autofill:function(i){
      this.patientSelected = JSON.parse(JSON.stringify(this.patientdata.patients[i]))
      this.inputready=true
      // this.getdata();
    },
    calc:function(){
      var self=this;
  		self.hasError =false;
  		self.error404=false;
      self.KOPost(
      {
        arkID: self.configjson[self.curversion].objects.lung.risk_id,
        endpoint: self.configjson[self.curversion].objects.lung.risk_endpoint,
        data: JSON.stringify(self.lunginput),
        success: function(response) {
          self.resultready.lung = true;
          self.rawresults.lung=response.result
          self.results.lung=response.result.toFixed(1)
          console.log(response);
          self.ir_fill("lung-icon",self.results.lung/100)
        },
        error: function(response)		{	console.log(response); },
        key:'tsh'
      });
      self.KOPost(
      {
        arkID: self.configjson[self.curversion].objects.prostate.risk_id,
        endpoint: self.configjson[self.curversion].objects.prostate.risk_endpoint,
        data: JSON.stringify(self.prostateinput),
        success: function(response) {
          self.resultready.pros = true;
          self.rawresults.pros=JSON.parse(JSON.stringify(response.result.result))
          response.result.result.forEach(function(e){
            var x=e.toFixed(1)
            self.results.pros.push(x)
          })
            self.ir_fill("pros-icon",self.results.pros[2]/100)
          console.log(response);
        },
        error: function(response)		{	console.log(response); },
        key:'ana'
      });
      self.KOPost(
      {
        arkID: self.configjson[self.curversion].objects.liver.risk_id,
        endpoint: self.configjson[self.curversion].objects.liver.risk_endpoint,
        data: JSON.stringify(self.liverinput),
        success: function(response) {
          self.resultready.liver = true;
          self.rawresults.liver=response.result.result
          self.results.liver=response.result.result.toFixed(1)
          console.log(response);
            self.ir_fill("liver-icon",self.results.liver/100)
        },
        error: function(response)		{	console.log(response); },
        key:'vte'
      });
    },
    KOPost:function(instr)
      {
        var self=this;
        var set =
          {
            "url": this.activator_url+ instr.arkID + instr.endpoint,
            "method": "POST",
            "headers": {
              "content-type": "application/json",
            },
            "data": instr.data
          }
          self.appendLog(instr.key, "K-GRID Service Request - Sending Patient Data to Knowledge Object: " + instr.arkID);
          console.log("AJAX SETTINGS: ", set)
          $.ajax(set).done(function(data, textStatus, jqXHR)
          {
            //  console.log(jqXHR);
            instr.success(data);
            self.appendLog(instr.key, "K-GRID Service Response - Recommendation results returned from Knowledge Object: " + instr.arkID);
          }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("error");
            console.log(jqXHR);
            self.hasError = true;
            if(jqXHR.statusText=='error'&&jqXHR.status==404){
              self.error404=true;
            }
            instr.error(jqXHR.responseJSON);
            self.appendLog(instr.key, "K-GRID Service Response - Error returned from Knowledge Object: " + instr.arkID);
          }).always(function(){
            console.log("Finished");
          })
        },
        interpretlung:function(){
          this.interp.lung=!this.interp.lung
          if(this.interp.lung){
            //call interp ko
          }
        },
        interpretliver:function(){
          this.interp.liver=!this.interp.liver
          if(this.interp.liver){
            //call interp ko
          }
        },
        interpretpros:function(){
          this.interp.pros=!this.interp.pros
          if(this.interp.pros){
            //call interp ko
          }
        },
        getQueryVariable(variable)
        {
               var query = window.location.search.substring(1);
               var vars = query.split("&");
               for (var i=0;i<vars.length;i++) {
                       var pair = vars[i].split("=");
                       if(pair[0] == variable){return pair[1];}
               }
               return(false);
        },
        ir_fill:function(divID, score){
          var count_ = score;
          var arrayDiv = $("#" + divID);
          arrayDiv.empty();
          draw_array({divID: divID, count: count_ * 100, gridWidth: 10, gridHeight: 10, personFill: "steelblue",
                backgroundFill: "#FFFFFF", key: true})
              }
  }
})
