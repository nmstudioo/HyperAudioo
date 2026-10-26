# Test Report

Consolidated results and open questions. Environment: source-built JamesDSP VM (x86_64) + NumPy FIR. **Not** the app, not ARM, not the device.

## Results

| Area | Test | Result | Status |
|---|---|---|:-:|
| Speaker IRS (V6) | peak 0.950, L1 1.2317, tail −82.9 dB, max gain −0.07 dB, format | all met | PASS |
| Speaker chain | noise, sines, step, impulse | output pinned at ceiling 0.7079, never exceeded | PASS |
| Speaker EEL | compile · bypass identity · delay 48 samples | OK | PASS |
| Speaker EEL | NaN, inf and 1e9 input | pending rerun after guard correction | NOT RUN |
| IEM IRS | gates | all met | PASS |
| IEM chain | noise, sines, hot input at max effects | peak held 0.8414 | PASS |
| IEM EEL v4 (previous revision) | effects-off identity · bypass identity | bit-exact | PASS |
| IEM EEL v4 (previous revision) | NaN / inf / 1e9 input | no non-finite output, recovers | PASS |
| IEM EEL v5 | Effects / Limiter only selector | source review only; VM regression pending | NOT RUN |
| Both | app slider parse | static regex port only | CONDITIONAL |
| Both | app, native convolver, ARM, device | — | NOT RUN |
| Both | listening, null test, re-measurement | — | NOT RUN |

## Corrections on record

- The speaker EEL's six non-finite guards were corrected in the repository. The speaker NaN / inf / 1e9 test is now explicitly marked `NOT RUN` until rerun against the corrected source.
- Other listed results retain their previously recorded scope; this edit does not claim a new VM test run. The v5 processing-mode selector is new and remains untested in the VM, app and on ARM.
- An early report cited the wrong upstream source revision; the relevant code was identical, and the pin was corrected.

## Documentation cross-check

- `docs/vdc_functions.md` records the two shipped identity VDC payloads and explicitly limits claims about arbitrary non-identity VDC syntax.
- `docs/irs_functions.md` records the shipped RIFF float32 stereo assets, project QA limits, profile-specific tail metrics, and the boundary between offline FIR checks and native-app/device validation.
- `docs/eel_functions` now uses the conditional-assignment NaN guard documented in `docs/methodology.md` and the EDX Pro report. The older negated-comparison example was removed because it did not catch NaN in the tested VM.
- This documentation update does not constitute a new DSP test run. In particular, the Speaker corrected-source NaN/Inf/large-input rerun and the IEM v5 mode-selector VM regression remain `NOT RUN`.

## Open questions

1. **Measurement provenance** for the speaker IRS (mic response inside the filter?).
2. **ARM behaviour** of both EEL scripts (all tests ran on x86_64).
3. **Native convolver** partitioning and latency versus the NumPy model.
4. **IEM tuning** has no measurement behind it; the voicing layer is a design choice.
5. **De-esser default threshold** needs listening data.
6. **CPU cost** of the IEM effects on device.

- Device use is `USER REPORTED` by the author for both chains.

## Highest-value next tests

1. Re-measure the speaker with the filter loaded, same setup.
2. Coupler or in-ear measurement of the EDX Pro.
3. Level-matched blind A/B on device using the harness.
