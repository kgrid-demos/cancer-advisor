var eventBus = new Vue();
Vue.component('scorecard', {
	template: '#scorecard-template',
	props: [
  	'label',
		'score',
		'haserror'
	]
})

var demo = new Vue({
	el: '#app',
	data: function(){
  	return {
			patientModel:{patient:{name:"",id:"",gender:"",age:"",condition:0,rsm:0,obsv:0}},
      patientSelected:{},
			isInit:true,
			hasError: false,
			error404: false,
			autofillSelection: "",
			eventlog:[],
      inputready: false,
      scoreready: {"pros":false, "lung" : false, "liver": false},
      configjson:{},
      patientdata:{},
      curversion:"v1",
      resultready:{"pros":false,"lung":false,liver:false},
      results:{"pros":[],"lung":0,liver:0},
      rawresults:{pros:[],lung:0,liver:0},
      highlighted:{pros:false,lung:false,liver:false},
			interpresult:{pros:'',lung:'',liver:''},
			interp:{pros:false,lung:false,liver:false},
			errors:{pros:false,lung:false,liver:false}
    }
  },
  mounted:function(){
    var self =this;
    // this.appendLog('app',"Application Event : Retrieved Sample Patient Data ...");
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
      obj.risk=this.rawresults.lung;
      return obj
    },
    liverinterpinput:function(){
      var obj = {}
      obj.risk=this.rawresults.liver;
      return obj
    },
  },
  watch:{
    autofillSelection:function(){
      var self=this;
      if(this.autofillSelection!=""){
        var i=parseInt(this.autofillSelection)
        window.setTimeout(function(){
          self.autofill(i)}, 50);
				var j= i+1
        this.appendLog('app',"Application Event : Autofill sample patient #"+j+ " is selected.");
      }else {
        this.inputready=false;
      }
    },
		patientSelected:{
			handler: function(){
				this.inputready=false;
				this.resetDisplay()
				this.updatevalue()

			},
				deep:true
		},
  },
  methods:{
		updatevalue:_.debounce(function(){
			var count = Object.keys(this.patientSelected).length
			console.log("Key Count  "+count)
			this.inputready=(count==18)
				}, 500),
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
		resetDisplay:function(){
			this.resultready={"pros":false,"lung":false,liver:false}
      this.results={"pros":[],"lung":0,liver:0}
      this.rawresults={pros:[],lung:0,liver:0}
			this.interp={"pros":false,"lung":false,liver:false}
			this.errors={"pros":false,"lung":false,liver:false}
			this.ir_fill("lung-icon",0)
				this.ir_fill("liver-icon",0)
					this.ir_fill("pros-icon",0)
		},
    autofill:function(i){
      this.patientSelected = JSON.parse(JSON.stringify(this.patientdata.patients[i]))
      this.inputready=true
			this.resetDisplay()
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
        error: function(response)		{
					self.resultready.liver = false;
					self.interpresult.liver=response.message.split(':')[1]
					self.interp.liver=true
					self.errors.liver=true
					console.log(response); },
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
				interpretrisk:function(s){
					var self = this
					this.interp[s]=!this.interp[s]
					var s_cancer = s
					var s_input=s+'interpinput'
					var s_key='ana'
					if(s=='pros') {
						s_cancer='prostate'
					}
					if(s=='lung'){
						s_key='tsh'
					}
					if(s=='liver'){
						s_key='vte'
					}
					if(this.interp[s]){
						self.KOPost(
						{
							arkID: self.configjson[self.curversion].objects[s_cancer].inter_id,
							endpoint: self.configjson[self.curversion].objects[s_cancer].inter_endpoint,
							data: JSON.stringify(self[s_input]),
							success: function(response) {
									console.log(response.result)
									self.interpresult[s]=response.result
							},
							error: function(response)		{	console.log(response); },
							key:s_key
						});
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
