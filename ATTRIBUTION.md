# Attribution

## AutoEq

The measurement-based correction curves in this repository are derived from
AutoEq-format parametric EQ presets. AutoEq is a project by jaakkopasanen,
licensed under the MIT License:

    https://github.com/jaakkopasanen/AutoEq

The AutoEq CSV inputs used here were sourced from RikudouGoku's
measurement database (squig.link). AutoEq output CSVs derived from that
data are used as inputs to the design process described in
`docs/methodology.md` and the numerical reports.

The IRS generator script and its complete source inputs are not included
in this repository. Consequently, the full artifact-generation process is
not reproducible from this repository alone. The MIT license on AutoEq
covers AutoEq's code; it does not automatically establish the license or
redistribution rights for third-party measurement data.

## Speaker Ranking

Some Warm preset designs were derived from Speaker Ranking's
16-measurement aggregate preset exports for the KZ EDX Pro. The
coefficients used here are a re-design derived from those exported
parameters; Speaker Ranking's original preset exports are not redistributed
in this repository. The licensing and redistribution permissions for the
upstream RikudouGoku measurements and Speaker Ranking preset exports have
not been independently verified; no claim is made here that AutoEq's MIT
license applies to those third-party data.

## RootlessJamesDSP

The EEL2 scripts in this repository target the James34602 EEL2 VM as
implemented in RootlessJamesDSP:

    https://github.com/ThePBone/RootlessJamesDSP

RootlessJamesDSP is licensed under the Apache License 2.0. No code from
RootlessJamesDSP is redistributed in this repository; only compatibility
with its EEL2 VM is claimed.

## Original measurements

This repository does not redistribute any raw headphone measurements.
All IRS and VDC artifacts are derived corrections, not measurements.
