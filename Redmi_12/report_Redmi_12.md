# Report · Redmi 12 Speaker Chain (V6)

**Files:** the frozen V6 set as in this repository. **Evidence labels:** `PASS` · `FAIL` · `NOT RUN` · `CONDITIONAL` · `USER REPORTED`.
Numbers below were computed from the files in this repo (SHA-256 in the README).

## Assets

| File | Verified content |
|---|---|
| `- HA™ S Master.vdc` | Identity: ten `1,0,0,0,0` sections in both the 44.1 kHz and 48 kHz banks |
| `- HA™ S Master.irs` | RIFF float32 stereo, L = R, 48 kHz, 8192 frames, all finite |
| `- HA™ S Master.eel` | "HyperAudio V6 IRS Core": linked look-ahead limiter, 48-sample delay |

## IRS (from the written file)

| Check | Result | Target | Status |
|---|---|---|:-:|
| Peak tap | 0.950 @ index 0 | ≤ 0.95 | PASS |
| L1 norm | 1.2317 | ≤ 1.25 | PASS |
| Energy in second half (n ≥ 4096) | −82.9 dB | ≤ −80 dB | PASS |
| Max gain 20 Hz – 20 kHz | −0.07 dB | ≤ 0 dB | PASS |
| DC sum | 0.799 | n/a | info |

Magnitude (dB): 30 Hz −1.1 · 100 Hz −0.7 · 500 Hz −0.6 · 1 kHz −1.3 · 3 kHz −0.5 · 5 kHz −0.2 · 8 kHz −0.1 · 15 kHz −0.5. This is a gentle correction. Group delay (samples): 50 Hz 17.5 · 100 Hz 3.3 · 200 Hz −0.6 · 1 kHz −1.3.

## Chain simulation

Source-built JamesDSP VM (x86_64) + NumPy FIR. Defaults, ceiling −3 dBFS = 0.7079. **Not** the app's convolver.

| Test | Pre-limiter peak | Output peak | Over ceiling | Status |
|---|:-:|:-:|:-:|:-:|
| Full-scale noise | 1.003 | 0.7079 | 0 | PASS |
| Sine 100 Hz, 0 dBFS | 0.940 | 0.7079 | 0 | PASS |
| Sine 1 kHz, 0 dBFS | 0.895 | 0.7079 | 0 | PASS |
| Sine 3 kHz, 0 dBFS | 0.950 | 0.7079 | 0 | PASS |
| +FS step | 0.950 | 0.7079 | 0 | PASS |
| Impulse (delay) | 0.950 | 0.7079 | 0 | PASS: peak at 148 = 100 + 48 |
| Bypass (Processing = Bypass) | n/a | input | n/a | PASS: error 0 |
| NaN input sample | n/a | no non-finite, recovers | n/a | PASS |
| inf and 1e9 input samples | n/a | no non-finite, recovers | n/a | PASS |

## Author-reported (not independently reproduced)

- Speaker V6 loaded and used on a Redmi 12 (Android 15). `USER REPORTED`
- The V6 set is frozen. `USER REPORTED`

## Not validated

- `NOT RUN`: Rootless native convolver, ARM, null test, re-measurement with the filter loaded, blind listening.
- `CONDITIONAL`: slider parsing, checked only by a static port of the app's regex.
- The filter is a design from measurement data whose mic and setup are not documented here.
- Sample-peak limiting only; inter-sample peaks and excursion are not addressed.
