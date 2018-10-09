---
home: false
sidebarDepth: 2
---

# Cancer Advisor Demo App Guide

## Introduction

`Cancer Advisor Demo App` is a single page web app to demonstrate the capabilities of KGrid and [Cancer Risk Knowledge Objects](https://kgrid-objects.github.io/cancer-risk-collection/).

The app connects with the KGrid Sandbox instances of [Activator](https://activator.kgrid.org) and interacts with the activated Knowledge Objects.


## Usage

  * Choose one of three preset patient samples;

  * The app will load the sample patient data;

  * Click on   <button style='background-color:#364496;color:#fff;padding:6px 10px;'>Calculate Risks</button> to initiate the interaction with Sandbox KGird Activator

  * The cancer risk scores will be computed by the risk score Knowledge Objects and displayed along with the visualization using [Icon Array](https://kgrid-objects.github.io/icon-array/)

  * Click on  <button style='background-color:#364496;color:#fff;padding:6px 10px;'>Interpret</button> in each cancer risk advice panel, the respective risk score will be interpreted using the interpretation Knowledge Objects.

Note:

  1. In each advice panel, the link of `source` will direct to the Knowledge Object in [Kgrid Library](https://library.kgrid.org);

  1. Hovering the mouse over the calculated risk score will highlight the input data used for the risk model.

  1. Patient data can be manually adjusted and the risk scores can be recalculated.


  <div style="text-align:center;"><button style='background-color:green; color:#fff;padding:16px 10px;font-size: 1.3em;'><a href='https://demo.kgrid.org/cancer-advisor/app'  style='color:#fff;'>LAUNCH DEMO</a></button></div>
