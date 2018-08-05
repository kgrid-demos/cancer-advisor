
var info = {'PSA': 1.1, 'DRE': 0, 'PriorBiop': 0, 'FamHist': 1, 'AA': 1, 'Age': 54,'gender':'F'};
console.info(ProstateRiskCalc(info));



function ProstateRiskCalc(info)
{

    var gender = info['gender'];
    var op = {'success':'','errorMessage':'','result':''};


    if(gender == 'M' || gender == 'm')
    {

        var patientVarList = [Math.log(parseFloat(info['PSA']), 2), info['DRE'], info['PriorBiop'], info['FamHist'], info['AA'], info['Age']];

        s1Constant = (-3.00215469, 1);
        s2Constant = (-7.05304534, 1);


        s1CoeffList = [0.25613390, -0.03864628, -0.45533257, 0.27197219, .12172599, 0.01643637];
        s2CoeffList = [0.70489441, 0.40068434, -0.21409933, 0.22467348, 1.04174529, 0.04753804];

        var a = [(patientVarList, s1CoeffList) + [s1Constant]];
        var b = [(patientVarList, s2CoeffList) + [s1Constant]];
        var sum = 0;
        var s1 = sum[a, b];


        for (var i = 0; i < a.length; i++)
        {

             s1.push([a[i], b[i]]);
        }

        var a = [(patientVarList, s2CoeffList) + [s2Constant]];
        var b = [(patientVarList, s2CoeffList) + [s2Constant]];
        var sum =0;
        var s2 = sum[a ,b ];

        for (var i = 0; i < a.length; i++)
        {

            s2.push([a[i], b[i]]);
        }



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
