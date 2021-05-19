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
      patientSelected:{},
			hasError: false,
			error404: false,
			autofillSelection: "",
			eventlog:[],
      inputready: false,
      scoreready: {"prostate":false, "lung" : false, "liver": false},
      configjson:{},
      patientdata:{},
      curversion:"v2",
      resultready:{"prostate":false,"lung":false,liver:false},
      results:{"prostate":[],"lung":0,liver:0},
      rawresults:{prostate:[],lung:0,liver:0},
      highlighted:{prostate:false,lung:false,liver:false},
			interpresult:{prostate:'',lung:'',liver:''},
			interp:{prostate:false,lung:false,liver:false},
			errors:{prostate:false,lung:false,liver:false},
    }
  },
  mounted:function(){
    var self =this;
		console.log("Updated on Jan. 28, 2020")
    axios.get("./static/json/config.json").then(response=> {
      console.log(response.data)
      self.configjson =JSON.parse(JSON.stringify(response.data))
			self.appendLog('app',"Application Ready. KGrid Activator is configured as: "+self.activator_url);
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
              console.log(e.fieldname + ' '+e.prostate +' '+e.lung+' '+e.liver)
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
              console.log(e.fieldname + ' '+e.prostate +' '+e.lung+' '+e.liver)
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
          if(e.prostate){
            console.log(e.fieldname + ' '+e.prostate +' '+e.lung+' '+e.liver)
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
    prostateinterpinput:function(){
      var obj = {}
      obj.noRisk = this.rawresults.prostate.noRisk ;
    	obj.lowRisk = this.rawresults.prostate.lowRisk ;
    	obj.highRisk = this.rawresults.prostate.highRisk;
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
		riskconfig:function(s){
			var obj ={}
			var self=this
			var riskinput=s+'input'
			var visicon=s+'-icon'
			obj.arkID = self.configjson[self.curversion].objects[s].risk_id
			obj.endpoint = self.configjson[self.curversion].objects[s].risk_endpoint
			obj.data= JSON.stringify(self[riskinput])
			obj.success= function(response) {
				if(response.result.success==1){
					self.resultready[s] = true;
					switch(s){
					case 'lung':
						if(self.curversion=='v1'){
							self.rawresults[s]=response.result
						}else {
 						  self.rawresults[s]=response.result.result
						}
						self.results[s]=self.rawresults[s].toFixed(1)
						self.ir_fill(visicon,self.results[s]/100)
						break
					case 'liver':
						self.rawresults[s]=response.result.result
						self.results[s]=self.rawresults[s].toFixed(1)
						self.ir_fill(visicon,self.results[s]/100)
						break;
					case 'prostate':
					  self.rawresults[s]=JSON.parse(response.result.result)
						for (var key in self.rawresults[s]){
							var x= self.rawresults[s][key].toFixed(1)
							self.results[s].push(x)
						}
						self.ir_fill(visicon,self.results[s][2]/100)
						break
					}
				}else{
					self.resultready[s] = false;
					self.interpresult[s]=response.result.errorMessage
					self.interp[s]=true
					self.errors[s]=true
				}
			}
			obj.error = function(response)		{
				self.resultready[s] = false;
				self.interpresult[s]=response.message.split(':')[1]
				self.interp[s]=true
				self.errors[s]=true
			}
			obj.key=s
			return obj
		},
		updatevalue:_.debounce(function(){
				var count = Object.keys(this.patientSelected).length
				this.inputready=(count==18)
			}, 500),
  	appendLog:function(key,s){
  		var ts = moment().format("ddd, MMM Do YYYY, h:mm:ss A Z");
  		// console.log(ts);
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
			this.resultready={"prostate":false,"lung":false,liver:false}
      this.results={"prostate":[],"lung":0,liver:0}
      this.rawresults={prostate:[],lung:0,liver:0}
			this.interp={"prostate":false,"lung":false,liver:false}
			this.errors={"prostate":false,"lung":false,liver:false}
			this.ir_fill("lung-icon",0)
				this.ir_fill("liver-icon",0)
					this.ir_fill("prostate-icon",0)
		},
    autofill:function(i){
      this.patientSelected = JSON.parse(JSON.stringify(this.patientdata.patients[i]))
      this.inputready=true
			this.resetDisplay()
    },
    calc:function(){
      var self=this;
  		self.hasError =false;
  		self.error404=false;
      self.KOPostaxios(self.riskconfig('lung'));
      self.KOPostaxios(self.riskconfig('prostate'));
      self.KOPostaxios(self.riskconfig('liver'));
    },
		KOPostaxios:function(instr){
			var self = this
			var config = {
				method:'post',
				url:this.activator_url+ instr.arkID + instr.endpoint,
				"headers": {
					"content-type": "application/json",
				},
				"data": instr.data
			}
			self.appendLog(instr.key, "K-GRID Service Request - Sending Patient Data to Knowledge Object: " + instr.arkID);
			axios(config)
				.then(function(response){
					instr.success(response.data);
					self.appendLog(instr.key, "K-GRID Service Response - Response results returned from Knowledge Object: " + instr.arkID);
				})
				.catch(function(error){
					self.hasError = true;
					if(error.response.status==404){
						self.error404=true;
					}
					if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
					instr.error(error.response.data);
					self.appendLog('err', "K-GRID Service Response - Error returned from Knowledge Object: " + instr.arkID);
				})
		},
		interpretrisk:function(s){
					var self = this
					this.interp[s]=!this.interp[s]
					var s_cancer = s
					var s_input=s+'interpinput'
					if(this.interp[s]){
						self.KOPostaxios(
						{
							arkID: self.configjson[self.curversion].objects[s_cancer].inter_id,
							endpoint: self.configjson[self.curversion].objects[s_cancer].inter_endpoint,
							data: JSON.stringify(self[s_input]),
							success: function(response) {
									console.log(response.result)
									self.interpresult[s]=response.result
							},
							error: function(response)		{	console.log(response); },
							key:s
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
