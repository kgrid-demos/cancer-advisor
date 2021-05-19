/**
 * Calculates age of a person based on their birthDate
 * @param  {String} birthday birthdate in formatted as YYY-MM-DD
 * @return {number}          returns the person's age
 */
function calculateAge(birthday)
{
	var today = new Date();
	var birthDate = new Date(birthday);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if(m < 0 || (m == 0 && today.getDate() < birthDate.getDate()))
		age--;
	return age;
}


/**
 * gets patient's full name from patient fhir resource
 * @param  {Object} patient Patient FHIR resource obtained from SMART API
 * @return {String}         returns patient's full name. Returns "anonymous" if not available
 */
function get_patient_name(ver, patient)
{
	if(patient.name)
	{
		var names = patient.name.map(function(name)
		{
      switch(ver){
        case 2:
          return name.given.join(" ") + " " + name.family.join(" ");
        case 3:
          return name.given.join(" ") + " " + name.family;
        default:
          return name.given.join(" ");
      }
		})
		return names[0];
	}
	else return "anonymous";
}

/**
 * returns true if FHIR resource contains specified path, false otherwise
 * @param  {Object} resourceObj FHIR resource
 * @param  {String} path        jsonpath string
 * @return {Boolean}            returns true if path exists in resource, false otherwise
 */
function value_in_resource(resourceObj, path)
{
	return jsonpath.query(resourceObj, path).length > 0
}


/**
 * takes in a medical codde and returns a jsonpath string for a generic FHIR resource that searches for the code
 * note: may not work for all FHIR resources
 * @param  {String|Number} code medical code
 * @return {String}      returns formatted jsonpath for the specified code
 */
function resource_path_for(code)
{
	return "$..resource.code.coding[?(@.code==" + code + ")].code"
}

function resource_counting(smart, rsc, callback){
  smart.patient.api.search({type:rsc}).done(callback);
}

function resourecount_refresh(smart) {
  resource_counting(smart, "Condition", function(rsp){
        var totalcount= rsp.data.total;
        console.log("contition:"+totalcount);
        $("#condition_count").text(totalcount);
  })
  resource_counting(smart, "Observation", function(rsp){
        var totalcount= rsp.data.total;
        console.log("Observation:"+totalcount);
        $("#observation_count").text(totalcount);
  })
  resource_counting(smart, "RiskAssessment", function(rsp){
        var totalcount= rsp.data.total;
        console.log("Risk:"+totalcount);
        $("#risk_count").text(totalcount);
  })
}
