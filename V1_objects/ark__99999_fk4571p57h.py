import math

# Prostate Cancer Prevention Trial risk calculator
# Authors:  Ankerst DP, Hoefler J, Bock S, Goodman PJ, Vickers A, Hernandez J,
#           Sokoll LJ, Sanda MG, Wei JT, Leach RJ, Thompson IM.


def ProstateRiskCalc(info):
    #
    # PSA = prostate-specific antigen in ng/mL, plugged into log2 for formula
    # DRE = Digital rectal exam, 1 (suspicious for Pcancer) versus 0 (normal)
    # PriorBiop = 1 (ever a prior biopsy negative for Pcancer) versus 0 (other)
    # FamHist = 1 (Pcancer in a father, brother or son) versus 0 (other)
    # AA = 1 (African American) versus 0 (otherwise)
    # Age = Age in years
    #

    gender = info['gender']
    op = {'success':'','errorMessage':'','result':''}
    # print gender

    if(gender == 'M' or gender == 'm') :

        patientVarList = [math.log(float(info['PSA']), 2), info['DRE'], info['PriorBiop'],
                      info['FamHist'], info['AA'], info['Age']]

        s1Constant = (-3.00215469, 1)
        s2Constant = (-7.05304534, 1)

        # Order of Coeff: L2PSA, DRE, PriorBiop, FamHist, AA, Age
        s1CoeffList = [0.25613390, -0.03864628, -0.45533257,
                   0.27197219, .12172599, 0.01643637]
        s2CoeffList = [0.70489441, 0.40068434, -0.21409933,
                   0.22467348, 1.04174529, 0.04753804]

        s1 = sum(a * b for a, b in (zip(patientVarList, s1CoeffList) +
             [s1Constant]))
        s2 = sum(a * b for a, b in (zip(patientVarList, s2CoeffList) +
             [s2Constant]))

        # risk tuple order (no risk, low risk, high risk)
    	risk = [1*100 / (1 + math.exp(s1) + math.exp(s2)),
            math.exp(s1)*100 / (1 + math.exp(s1) + math.exp(s2)),
            math.exp(s2)*100 / (1 + math.exp(s1) + math.exp(s2))]
        op['success'] = 1
        op['errorMessage'] = '-'
        op['result'] = risk

    else :
        op['success'] = 0
        op['errorMessage'] = 'Risk scores are applicable for males only'
    # return three risk values
    return op

#info = {'PSA': 1.1, 'DRE': 0, 'PriorBiop': 0,
#        'FamHist': 1, 'AA': 1, 'Age': 54,'gender':'F'
#        }
#
#print ProstateRiskCalc(info)
