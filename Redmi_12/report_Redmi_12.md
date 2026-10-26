# Redmi 12 Speaker — V6 technical report

**Profile state:** V6 frozen.  
**Evidence labels:** `PASS` · `FAIL` · `NOT RUN` · `CONDITIONAL` · `USER REPORTED`.

The numerical results below were computed from the repository files. Current file hashes are listed in the [README](../README.md).

## 1. Shipped assets

| File | Verified content |
|---|---|
| `HA_Speaker_Master.vdc` | Identity: ten `1,0,0,0,0` sections in both 44.1 kHz and 48 kHz banks |
| `HA_Speaker_Master.irs` | RIFF float32 stereo, L = R, 48 kHz, 8192 frames, all finite |
| `HA_Speaker_Master.eel` | “HyperAudio V6 IRS Core”: linked look-ahead limiter, 48-sample delay |

## 2. IRS results — written file

| Check | Result | Target | Status |
|---|---:|---:|---|
| Peak tap | 0.950 @ index 0 | ≤ 0.95 | **PASS** |
| L1 norm | 1.2317 | ≤ 1.25 | **PASS** |
| Second-half energy (n ≥ 4096) | −82.9 dB | ≤ −80 dB | **PASS** |
| Maximum gain, 20 Hz–20 kHz | −0.07 dB | ≤ 0 dB | **PASS** |
| DC sum | 0.799 | n/a | Info |

Magnitude response (dB): 30 Hz −1.1 · 100 Hz −0.7 · 500 Hz −0.6 · 1 kHz −1.3 · 3 kHz −0.5 · 5 kHz −0.2 · 8 kHz −0.1 · 15 kHz −0.5.

This is a gentle correction. Group delay (samples): 50 Hz 17.5 · 100 Hz 3.3 · 200 Hz −0.6 · 1 kHz −1.3.

## 3. Chain simulation

Environment: source-built JamesDSP VM (x86_64) + NumPy FIR. This is **not** the app's native convolver. Defaults, ceiling −3 dBFS = 0.7079.

The non-finite-input cases below are pending rerun after the Speaker EEL guard correction.

| Test | Pre-limiter peak | Output peak | Over ceiling | Status |
|---|---:|---:|---:|---|
| Full-scale noise | 1.003 | 0.7079 | 0 | **PASS** |
| Sine 100 Hz, 0 dBFS | 0.940 | 0.7079 | 0 | **PASS** |
| Sine 1 kHz, 0 dBFS | 0.895 | 0.7079 | 0 | **PASS** |
| Sine 3 kHz, 0 dBFS | 0.950 | 0.7079 | 0 | **PASS** |
| +FS step | 0.950 | 0.7079 | 0 | **PASS** |
| Impulse (delay) | 0.950 | 0.7079 | 0 | **PASS** · peak at 148 = 100 + 48 |
| Bypass (Processing = Bypass) | n/a | Input | n/a | **PASS** · error 0 |
| NaN input sample | — | — | — | **NOT RUN** on corrected source |
| Infinity and 1e9 input samples | — | — | — | **NOT RUN** on corrected source |

## 4. Author-reported results

- Speaker V6 loaded and used on a Redmi 12 (Android 15). **USER REPORTED**
- The V6 set is frozen. **USER REPORTED**

These statements are not independently reproduced by the offline test environment.

## 5. Not validated

- **NOT RUN:** Rootless native convolver, ARM execution, null test, re-measurement with the filter loaded, and blind listening.
- **CONDITIONAL:** slider parsing, checked only through a static port of the app's regex.
- The filter derives from measurement data whose microphone and setup provenance are not documented here.
- Limiting is sample-peak only; inter-sample peaks and driver excursion are not addressed.

See [methodology](../docs/methodology.md) and the consolidated [test report](../docs/test_report.md).
