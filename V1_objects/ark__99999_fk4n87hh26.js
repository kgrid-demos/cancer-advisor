function interpretProstateCancerRisk(info)
{

    noRisk = float(info['noRisk']);
    lowRisk = float(info['lowRisk']);
    highRisk = float(info['highRisk']);

    interpretation = "";

    if (highRisk > 3)

    {
        interpretation = [ ];

        console.log('RECOMMENDATION: Consider a prostate biopsy. prostate biopsy is indicated because the chance of having high-grade prostate cancer is greater than 3%');

     }

    else
    {
        interpretation = [];

        console.log('RECOMMENDATION: A prostate biopsy is not indicated. Because the <b>risk of high-grade prostate cancer is low, a prostate biopsy is not indicated. Watchful waiting and reassessment of risk after one year are advised.');

}

    return ('interpretation' %s %interpretation);

}
