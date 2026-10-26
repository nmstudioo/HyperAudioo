# KZ EDX Pro — IEM technical report

**Assets:** identity VDC · v3 IRS · v5 EEL. Current file hashes are listed in the [README](../README.md).  
**Evidence state:** offline checks only. No coupler measurement or listening evidence exists in this project. Device use by the author is **USER REPORTED** and was not reproduced here.

## 1. Findings that shaped v3

| # | Finding | Status |
|---:|---|---|
| 1 | v2 EEL parse error: literal `@sample` inside a comment cut `@init` short. Reproduced in the source-built VM; fixed by rewording. | **PASS** |
| 2 | v2 VDC and v2 IRS had the same response (maximum difference 2.7e−6 dB). Loading both applied EQ twice (~+3.5 dB mids). v3 makes the VDC identity. | **PASS** |
| 3 | The `!(abs(x)<1e6)` NaN guard did not catch NaN in this VM. Replaced with `abs(x)<1e6 ? 0 : (x=0.0)`. | **PASS** |

## 2. v3 IRS results

Built from the exact magnitude of the v2 IRS (the user's own corrections retained), 1/6-octave smoothing, then a small voicing layer. These are design choices, not measurement data:

- +2 dB shelf below 90 Hz
- −1 dB at 300 Hz
- +1 dB around 1.6 kHz
- +1 dB shelf above 11 kHz

Minimum phase (real cepstrum), 256-tap fade, level-matched to v2 over 500–3000 Hz, then constrained to L1 ≤ 1.25.

| Check | Result | Status |
|---|---:|---|
| Frames / format | 2048, float32 stereo L=R, 48 kHz | **PASS** |
| Peak tap | 0.4575 @ 0 | **PASS** |
| L1 norm | 1.249987 (margin ~0.000013) | **PASS** |
| Tail, n ≥ 1024 | 1.7e−9 | **PASS** |
| Maximum gain, 20 Hz–20 kHz | −0.84 dB | **PASS** |
| Realised vs design | 0.003 dB maximum difference | **PASS** |

Magnitude response (dB): 30 Hz −5.0 · 100 Hz −6.9 · 200 Hz −8.5 · 500 Hz −4.3 · 1 kHz −2.3 · 3 kHz −2.2 · 5 kHz −6.5 · 8 kHz −6.5 · 15 kHz −8.4.

Group delay is large near 200 Hz (−27.7 samples), inherited from v2's steep 160–500 Hz slope.

## 3. EEL effects path — carried forward in v5

| Block | Result | Status |
|---|---|---|
| De-esser at 6.5 kHz | No cut ≤ −20 dBFS band level; −3.2 dB at −15; −4.8 dB cap at −10; 300 Hz–1 kHz untouched | **PASS** |
| Surround 3D (crossfeed) | Mid change 0.00 dB, 100 Hz–8 kHz; hard-pan far ear −14…−27 dB | **PASS** |
| Space width | Maximum setting: side +0.9 dB at 1 kHz → +5.1 dB at 15 kHz; mid 0.00 dB | **PASS** |
| All effects at 0 | Bit-identical to v3 | **PASS** |
| Bypass | Input delayed 48 samples, error 0 | **PASS** |
| Hot input, maximum settings | Peak held at 0.8414 (−1.5 dBFS) | **PASS** |
| NaN / infinity / 1e9 input | Zero non-finite output; recovery observed | **PASS** |

### v5 selector — evidence boundary

The v5 script adds a processing-path selector: `Effects` (default) or `Limiter only`. Limiter only bypasses De-esser, Surround 3D, and Space Width while retaining input gain and the sample-peak look-ahead limiter. Switching paths clears effect memories.

**The selector change is source-reviewed only.** It has not yet been run through the source-built VM or app.

Limiter modes: Default −1.5 dBFS / 80 ms; Safe −2.0 / 120 ms; Transparent −1.0 / 200 ms; Customize; Full bypass. Full bypass (and Master Off) selects the delayed raw-input path and bypasses the entire processing chain, not only the limiter. The Default ceiling (0.8414) was the one tested.

A first crossfeed version dipped mono content 4.7 dB near 1 kHz; it was rebuilt as a delayed low-passed side cut.

## 4. Not validated

- **NOT RUN:** app, ARM, native convolver, CPU cost of the added per-sample code, and listening.
- **Not Dolby:** proprietary HRTF virtualisation is not reproduced. This is crossfeed plus width, not true 3D.
- Clarity is addressed by de-essing and low-mid clearing, not by a measured retune.
- The de-esser threshold default is a design estimate, not a listening-derived value.

The EEL header describes the shipped architecture: VDC identity, IRS tonal correction, and EEL operational processing without static tonal EQ.

See the [methodology](../docs/methodology.md) and consolidated [test report](../docs/test_report.md).
