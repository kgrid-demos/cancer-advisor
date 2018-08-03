function interpretLiverCancerRisk(info)
{
    var risk = float(info['risk']);

    output = '';

    if (risk < 0.2)
    {
        output = [];
console.log('TREATMENT RECOMMENDATION: No antiviral treatment for Hepatitis B is indicated at this time.MONITORING RECOMMENDATION: Every 3 to 6 months, monitor and reassess liver function (ALT), Hepatitis B e Antigen status (HBeAG), and Hepatitis B DNA virus copy counts(HBV-DNA).');
   }

    else if (0.2 <= risk < 1)
    {
        output = [];
console.log('TREATMENT RECOMMENDATION: Consider a liver biopsy or a non-invasive liver fibrosis assessment and, if moderate or greater inflammation or fibrosis are detected then treat Hepatitis B with one of two first-line oral antiviral medications, Entecavir (1 mg tablet by mouth on an empty stomach daily for adults) r Tenofovir (300mg tablet by mouth daily for adults) MONITORING RECOMMENDATION: Every 3 to 6 months, monitor and reassess liver function (ALT), Hepatitis B e Antigen status (HBeAG), and Hepatitis B DNA virus copy counts (HBV-DNA).');

}

    else if (1 <= risk <= 30)

    {
        output = [];
 console.log('TREATMENT RECOMMENDATION: Antiviral treatment with Pegylated Interferon alpha-2a (PEG-INFa2a) is recommended.The normal adult dose is 180 micrograms by injection every week for 48 weeks. Common side effects include flu-like symptoms, headache, fatigue, muscle soreness, and hair loss.>MONITORING RECOMMENDATION: Monitor the impact and effectiveness of antiviral treatment every month by reassessing liver function (ALT), Hepatitis B e Antigen status (HBeAG),and Hepatitis B DNA virus copy counts (HBV-DNA). If improvements are apparent consider changing the monitoring frequency to every 3 months.');

}
    else
    {

        output = [];
 console.log('ALERT: A 3 year risk of hepatocelluar cancer of more than 30% may indicate a problem with the risk scoring calculation itself. Check all patient data and reassess hepatocellular risk to confirm. Assuming that the risk is more than 30%, which is very high, then antiviral treatment is highly recommended.TREATMENT RECOMMENDATION: Antiviral treatment is recommended. MONITORING RECOMMENDATION: Monitor the impact and effectiveness of antiviral treatment every month by reassessing liver function (ALT), Hepatitis B e Antigen status (HBeAG), and Hepatitis B DNA virus copy counts (HBV-DNA). If improvements are apparent, consider changing the monitoring frequency to every 3 months.');
 }

    return output ('interpretation' %s %output);


}
