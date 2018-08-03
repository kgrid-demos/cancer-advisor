
function interpretLungCancerRisk (info)
{


 var risk = float (info['4']);

var output = "";

 if (risk > 1.35)

 {
output= [];


console.log('RECOMMENDATION: Consider lung cancer screening. Because the chance is greater than 1.35%, engaging in a process of shared decision making about lung cancer screening should be considered, during which other factors, including the health status and disposition of the individual, should be taken into account.');

 }

 else

 {

 output= [];

console.log ('RECOMMENDATION: Lung cancer screening is not advised. Because this chance is <b>lower than 1.35% lung cancer screening is not indicated as the risk of lung cancer screening exceeds its likely benefits.');


 }

  return output;

}
