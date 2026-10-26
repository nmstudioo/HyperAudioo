# Test report

Consolidated results, evidence scope, corrections, and outstanding questions.

> **Environment:** source-built JamesDSP VM (x86_64) + NumPy FIR model. These results are **not** native app, ARM, or target-device validation.

## 1. Results

| Area | Test | Result | Status |
|---|---|---|---|
| Speaker IRS (V6) | Peak 0.950, L1 1.2317, tail −82.9 dB, max gain −0.07 dB, format | All recorded gates met | **PASS** |
| Speaker chain | Noise, sines, step, impulse | Output pinned at 0.7079 ceiling; no overshoot in tested cases | **PASS** |
| Speaker EEL | Compile, bypass identity, 48-sample delay | Passed recorded checks | **PASS** |
| Speaker EEL | NaN, infinity, and 1e9 input | Corrected-source rerun pending | **NOT RUN** |
| IEM IRS | Recorded file-level gates | All recorded gates met | **PASS** |
| IEM chain | Noise, sines, hot input at maximum effects | Peak held at 0.8414 | **PASS** |
| IEM EEL v4 (previous revision) | Effects-off identity, bypass identity | Bit-exact | **PASS** |
| IEM EEL v4 (previous revision) | NaN / infinity / 1e9 input | No non-finite output; recovery observed | **PASS** |
| IEM EEL v5 | Effects / Limiter-only selector | Source review only; VM regression pending | **NOT RUN** |
| Both | App slider parsing | Static regex port only | **CONDITIONAL** |
| Both | App, native convolver, ARM, device | No qualifying test recorded | **NOT RUN** |
| Both | Listening, null test, re-measurement | No qualifying test recorded | **NOT RUN** |

## 2. Corrections on record

- The Speaker EEL's six non-finite guards were corrected in the repository. Its NaN / infinity / 1e9 test remains **NOT RUN** until rerun against the corrected source.
- Other results retain their previously recorded scope. This documentation update does not claim a new VM test run.
- The IEM v5 processing-mode selector is new and remains untested in the VM, app, and on ARM.
- An early report cited the wrong upstream source revision; the relevant code was identical, and the pin was corrected.

## 3. Documentation cross-check

- [VDC reference](vdc_functions.md) records the two shipped identity VDC payloads and limits claims about arbitrary non-identity VDC syntax.
- [IRS reference](irs_functions.md) records the shipped RIFF float32 stereo assets, project QA limits, profile-specific tail metrics, and the boundary between offline FIR checks and native app/device validation.
- [EEL2 reference](eel_functions) uses the conditional-assignment NaN guard documented in the methodology and EDX Pro report.
- This documentation update is not a DSP test run. The Speaker corrected-source non-finite rerun and IEM v5 mode-selector VM regression remain **NOT RUN**.

## 4. Open questions

1. **Speaker measurement provenance:** was microphone response included in the IRS source measurement?
2. **ARM behaviour:** both EEL test suites were run on x86_64.
3. **Native convolver:** how do partitioning and latency compare with the NumPy model?
4. **IEM tuning:** the voicing layer has no measurement behind it.
5. **De-esser threshold:** the default requires listening data.
6. **CPU cost:** the IEM effects need on-device profiling.

Device use is **USER REPORTED** by the author for both chains; it was not independently reproduced in this test environment.

## 5. Highest-value next tests

1. Re-measure the Speaker with the filter loaded, using the same measurement setup.
2. Obtain a coupler or in-ear measurement of the EDX Pro.
3. Run level-matched blind A/B listening on the target device using the harness.
4. Re-run the Speaker non-finite suite against the corrected source.
5. Run the IEM v5 mode-selector regression in the source-built VM before app/device testing.
