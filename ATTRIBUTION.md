# Attribution & third-party sources

This document identifies upstream projects and data sources used in HyperAudio. Code licences do not automatically grant rights to third-party measurement data or preset exports.

## AutoEq

The measurement-based correction curves in this repository are derived from AutoEq-format parametric EQ presets. AutoEq is a project by jaakkopasanen, licensed under the MIT License:

- Project: https://github.com/jaakkopasanen/AutoEq
- Source data: RikudouGoku's measurement database (squig.link)

AutoEq output CSVs derived from that data are inputs to the design process described in [methodology](docs/methodology.md) and the numerical reports.

**Reproducibility boundary:** The IRS generator script and its complete source inputs are not included. The full artifact-generation process is therefore not reproducible from this repository alone. AutoEq's MIT licence covers its code; it does not automatically establish the licence or redistribution rights for third-party measurement data.

## Speaker Ranking

Some Warm preset designs were derived from Speaker Ranking's 16-measurement aggregate preset exports for the KZ EDX Pro. The coefficients used here are a redesign derived from those exported parameters; the original Speaker Ranking preset exports are not redistributed.

The licensing and redistribution permissions for upstream RikudouGoku measurements and Speaker Ranking preset exports have not been independently verified. No claim is made that AutoEq's MIT licence applies to those third-party data.

## RootlessJamesDSP

HyperAudio's EEL2 scripts target the James34602 EEL2 VM as implemented in [RootlessJamesDSP](https://github.com/ThePBone/RootlessJamesDSP).

RootlessJamesDSP is licensed under Apache License 2.0. No RootlessJamesDSP code is redistributed here; HyperAudio claims compatibility with its EEL2 VM only.

## Original measurements

This repository does not redistribute raw headphone measurements. The IRS and VDC files are derived correction artifacts, not measurements.
