from math import exp
import math


def interpretProstateCancerRisk(info):
    # noRisk,lowRisk,highRisk
    noRisk = float(info['noRisk'])
    lowRisk = float(info['lowRisk'])
    highRisk = float(info['highRisk'])

    interpretation = ""

    if highRisk > 3:
        interpretation = """
        <p style="font-weight: bold;">
        RECOMMENDATION: Consider a prostate biopsy.</p>

        <p>A prostate biopsy is indicated because
        the chance of having high-grade prostate cancer is <b>greater than 3%</b>.</p>
        """
    else:
        interpretation = """
        <p style="font-weight: bold;">
        RECOMMENDATION: A prostate biopsy is not indicated.</p>

        <p>Because the <b>risk of high-grade prostate cancer is low</b>, a prostate biopsy is not
        indicated. Watchful waiting and reassessment of risk after one year are advised.</p>
        """

    return """
        <div class="interpretation">
        %s
        </div>
        """ % interpretation
