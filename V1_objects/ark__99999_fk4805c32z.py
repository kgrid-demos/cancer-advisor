from math import exp
import math


def interpretLungCancerRisk(info):
    risk = float(info['risk'])

    output = ""

    if risk > 1.35:
        output = """
        <div class="interpretation">
        <p style="font-weight: bold;">RECOMMENDATION: Consider lung cancer screening.</p>
        <p>Because the chance is <b>greater than 1.35%</b>, engaging in a process of shared
        decision making about lung cancer screening should be considered, during which other
        factors, including the health status and disposition of the individual, should be
        taken into account.</p>
        </div>
        """
    else:
        output = """
        <div class="interpretation">
        <p style="font-weight: bold;">RECOMMENDATION: Lung cancer screening is not advised.</p>
        <p>Because this chance is <b>lower than 1.35%</b>, lung cancer screening is not indicated
        as the risk of lung cancer screening exceeds its likely benefits.</p>
        </div>
        """

    return output
