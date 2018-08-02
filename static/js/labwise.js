var eventBus = new Vue();


// define the item component
Vue.component('recomtile', {
	template: '#recomtile-template',
	props: [
  	'recmodel',
		'recindex'
	],
	data: function () {
  	return {

  	}
	},
	created:function(){
		var self=this;

	},
	computed: {

	},
	methods: {

	}
})

// boot up the demo
var demo = new Vue({
	el: '#app',
	data: function(){
  	return {
      inputFormModel: [{key:'tsh',prompt:'Normal TSH result in past 6 months?',value:false},
				{key:'vte',prompt:'Inpatient?',value:false},
				{key:'ana',prompt:'Positive ANA result?',value:false},
				{key:'imd',prompt:'Clinical suspicion of immune-mediated disease?',value:false}
			],
			patientModel:{patient:{name:"",id:"",gender:"",age:"",condition:0,rsm:0,obsv:0}},
			recommList:[],
			isInit:true,
			hasError: false,
			error404: false,
			autofillSelection: "",
			eventlog:[],
			localserver: false,
			objLeadUrl:"/knowledgeObject/"
	  	}
	},
	created:function(){
		var self=this;

	},
	beforeCreate: function(){
  	var self=this;
		//This gives the smart endpoint for using SMART API calls
		FHIR.oauth2.ready(function(smart)
		{
		  //get patient information from SMART API
		  // console.log(smart);
		  // console.log(smart.server.serviceUrl);
		  var ver = 0;
		  if(smart.server.serviceUrl.includes("dstu2")){
		    ver =2;
		  } else if(smart.server.serviceUrl.includes("stu3")) {
		    ver =3;
		  }
		  // console.log(ver);
			var patient = smart.patient.read()

			$.when(patient).done(function(pt)
			{
				console.log("PATIENT RESOURCE: ", pt);
		    self.appendLog('app',"Application Event : Retrieved Patient Data from SMART Sandbox.");
				var patientInfo = pt;
				console.log(patientInfo);
				$("#patient-name").text(get_patient_name(ver, pt))
				//display patient's info
				$("#patient-age").text(calculateAge(pt.birthDate));
		    $("#patient-id").text(pt.id);
		    $("#patient-gender").text(pt.gender);
				resourecount_refresh(smart);
			})
		})

	},
	computed: {
		baseUrl:function(){
			if(this.localserver) {
				return "http://localhost:9090"
			} else {
				return "https://kgrid-test.miserver.it.umich.edu/stack2"
			}
		},
		baseurlhealthlink: function(){
			return this.baseUrl+'/health';
		},
		baseurlkollink: function(){
			return this.baseUrl+'/shelf';
		},
		tshInput: function() {
			var obj={'labtest':null};
			obj.labtest=this.inputFormModel[0].value;
			return obj;
		},
		vteInput: function() {
			var obj={'labtest':null};
			obj.labtest=this.inputFormModel[1].value;
			return obj;
		},
		anaInput: function() {
			var obj={'ana':null,'imd':null};
			obj.ana=this.inputFormModel[2].value;
			obj.imd=this.inputFormModel[3].value;
			return obj;
		},
	},
mounted: function(){

},
watch:{
	autofillSelection:function(){
		var self=this;
		if(this.autofillSelection!=""){
			this.inputFormModel.forEach(function(e){
				e.value=false;
			});
			var i=parseInt(this.autofillSelection)
			window.setTimeout(function(){
				self.autofill(i)}, 50);
			this.appendLog('app',"Application Event : Autofill sample "+i+ " is selected.");
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
	autofill:function(i){
		switch(i){
			case 0:
				this.inputFormModel.forEach(function(e){
					e.value=false;
				});
				break;
			case 1:
				this.inputFormModel.forEach(function(e){
					e.value=true;
				});
			break;
			case 2:
				this.inputFormModel[0].value=false;
				this.inputFormModel[1].value=true;
				this.inputFormModel[2].value=false;
				this.inputFormModel[3].value=false;
			break;
			case 3:
				this.inputFormModel[0].value=false;
				this.inputFormModel[1].value=false;
				this.inputFormModel[2].value=false;
				this.inputFormModel[3].value=true;
			break;
			case 4:
				this.inputFormModel[0].value=false;
				this.inputFormModel[1].value=true;
				this.inputFormModel[2].value=true;
				this.inputFormModel[3].value=true;
			break;
		}
		this.getdata();
	},
	kopostcallback:function(s, response){
		var self =this;
		console.log(response);
		var recresult = JSON.parse(response.result);

		var recs = recresult.recs;
		console.log(recs);
		if(recs.length>0){
			recs.forEach(function(e){
				var newrec = {};
				newrec.status=recresult.status;
				newrec.source=recresult.source;
				newrec.link=recresult.link;
				newrec.rec=e.text;
				newrec.classkey=s;
				console.log(newrec);
				self.recommList.push(newrec);
			})
		}
		$('ul#reclist li').removeClass('active');
		window.setTimeout(function(){
			$("ul#reclist li").addClass('active')}, 100);
	},
	scrollToEnd: function() {
      var container = this.$el.querySelector("#statuslog");
      container.scrollTop = container.scrollHeight;
  },
	getdata:function(){
		var self=this;
		self.hasError =false;
		self.error404=false;
		self.recommList.splice(0,self.recommList.length);
		self.isInit =false;
		self.KOPost(
  	{
  		arkID: "ark:/99999/fk4g168s5p",
  		data: JSON.stringify(self.tshInput),
  		success: function(response) {	self.kopostcallback('tsh', response);
			},
  		error: function(response)		{	console.log(response); },
			key:'tsh'
  	});
		self.KOPost(
		{
			arkID: "ark:/99999/fk4fj2rv22",
			data: JSON.stringify(self.vteInput),
			success: function(response) {	self.kopostcallback('vte', response);	},
			error: function(response)		{	console.log(response); },
			key:'vte'
		});
		self.KOPost(
		{
			arkID: "ark:/99999/fk4b85k02x",
			data: JSON.stringify(self.anaInput),
			success: function(response) {	self.kopostcallback('ana',response);	},
			error: function(response)		{	console.log(response); },
			key:'ana'
		});
	},
	KOPost:function(instr)
	{
		var self=this;
		var set =
		 {
			"url": this.baseUrl+ this.objLeadUrl+ instr.arkID + "/result",
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

}
}
})
