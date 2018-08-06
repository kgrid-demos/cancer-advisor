
var info = {'PSA': '1.1', 'DRE': 1, 'PriorBiop': 1, 'FamHist': 1, 'AA': 1, 'Age': 54,'gender':'M'};
console.info(ProstateRiskCalc(info));



function ProstateRiskCalc(info)
{

    var gender = info['gender'];
    var op = {'success':'','errorMessage':'','result':''};


    if(gender == 'M' || gender == 'm')
    {

        var patientVarList = [Math.log2(parseFloat(info['PSA'])), info['DRE'], info['PriorBiop'], info['FamHist'], info['AA'], info['Age']];
        console.log(patientVarList)

        s1Constant = -3.00215469;
        s2Constant = -7.05304534;

        s1CoeffList = [0.25613390, -0.03864628, -0.45533257, 0.27197219, .12172599, 0.01643637];
        s2CoeffList = [0.70489441, 0.40068434, -0.21409933, 0.22467348, 1.04174529, 0.04753804];

        var s1 = 0
        var s2 = 0

        patientVarList.forEach(function(e, index){
          var prod1 = e * s1CoeffList[index]
          var prod2 = e * s2CoeffList[index]
          s1 = s1 + prod1
          s2 = s2 + prod2
        })
        s1 = s1 + s1Constant
        s2 = s2 + s2Constant
        console.log(s1)
        console.log(s2)
        //
        //
        // var a = [(patientVarList, s1CoeffList) + [s1Constant]];
        // var b = [(patientVarList, s2CoeffList) + [s1Constant]];
        // var sum = 0;
        // var s1 = sum[a, b];
        //
        //
        // for (var i = 0; i < a.length; i++)
        // {
        //
        //      s1.push([a[i], b[i]]);
        // }
        //
        // var a = [(patientVarList, s2CoeffList) + [s2Constant]];
        // var b = [(patientVarList, s2CoeffList) + [s2Constant]];
        // var sum =0;
        // var s2 = sum[a ,b ];
        //
        // for (var i = 0; i < a.length; i++)
        // {
        //
        //     s2.push([a[i], b[i]]);
        // }



    	var risk = [1*100 / (1 + Math.exp(s1) + Math.exp(s2)), Math.exp(s1)*100 / (1 + Math.exp(s1) + Math.exp(s2)), Math.exp(s2)*100 / (1 + Math.exp(s1) + Math.exp(s2))]
        op['success'] = 1;
        op['errorMessage'] = '-';
        op['result'] = risk;
     }
    else
    {
         op['success'] = 0;
         op['errorMessage'] = 'Risk scores are applicable for males only';
    }
    return op;

}
