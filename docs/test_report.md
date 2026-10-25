# Test Report

Consolidated results and open questions. Environment: source-built JamesDSP VM (x86_64) + NumPy FIR. **Not** the app, not ARM, not the device.

## Results

| Area | Test | Result | Status |
|---|---|---|:-:|
| Speaker IRS (V6) | peak 0.950, L1 1.2317, tail −82.9 dB, max gain −0.07 dB, format | all met | PASS |
| Speaker chain | noise, sines, step, impulse | output pinned at ceiling 0.7079, never exceeded | PASS |
| Speaker EEL | compile · bypass identity · delay 48 samples | OK | PASS |
| Speaker EEL | NaN, inf and 1e9 input | no non-finite output, identical to clean afterwards | PASS |
| IEM IRS | gates | all met | PASS |
| IEM chain | noise, sines, hot input at max effects | peak held 0.8414 | PASS |
| IEM EEL v4 | effects-off identity · bypass identity | bit-exact | PASS |
| IEM EEL v4 | NaN / inf / 1e9 input | no non-finite output, recovers | PASS |
| Both | app slider parse | static regex port only | CONDITIONAL |
| Both | app, native convolver, ARM, device | — | NOT RUN |
| Both | listening, null test, re-measurement | — | NOT RUN |

## Corrections on record

- An earlier validation of a *different* speaker script (a Stage 2B variant, not shipped here) latched on a single NaN. The repository's speaker EEL was re-tested and does **not** show that behaviour.
- Every item above was re-run on the files in this repository, identified by SHA-256.
- An early report cited the wrong upstream source revision; the relevant code was identical, and the pin was corrected.

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
