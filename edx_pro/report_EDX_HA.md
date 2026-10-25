# Report · KZ EDX Pro IEM Chain

**Files:** as in this repository: identity VDC, v3 IRS, v5 EEL. Hashes in the README identify the current files; the new processing-mode selector has not yet been runtime-tested.
**State:** offline checks only. No coupler measurement or listening evidence exists in this project. Device use by the author is `USER REPORTED` in the repository's own notes and was not reproduced here.

## Findings that shaped v3

| # | Finding | Status |
|:-:|---|:-:|
| 1 | v2 EEL parse error: the literal text `@sample` inside a comment cut `@init` short. Reproduced in the source-built VM; fixed by rewording. | PASS |
| 2 | v2 VDC and v2 IRS had the same response (max diff 2.7e-6 dB). Loading both applied the EQ twice (~+3.5 dB mids). v3 makes the VDC identity. | PASS |
| 3 | NaN guard `!(abs(x)<1e6)` does not catch NaN in this VM. Replaced by `abs(x)<1e6 ? 0 : (x=0.0)`. | PASS |

## v3 IRS

Built from the exact magnitude of the v2 IRS (the user's own corrections kept), 1/6-oct smoothing, then a small voicing layer (design choices, not data): +2 dB shelf < 90 Hz, −1 dB @ 300 Hz, +1 dB @ ~1.6 kHz, +1 dB shelf > 11 kHz. Minimum phase (real cepstrum), 256-tap fade, level matched to v2 over 500–3000 Hz, then L1 ≤ 1.25.

| Check | Result | Status |
|---|---|:-:|
| Frames / format | 2048, float32 stereo L=R, 48 kHz | PASS |
| Peak tap | 0.4575 @ 0 | PASS |
| L1 | 1.249987 | PASS (margin ~0.000013) |
| Tail n ≥ 1024 | 1.7e-9 | PASS |
| Max gain 20 Hz–20 kHz | −0.84 dB | PASS |
| Magnitude (dB) | 30 Hz −5.0 · 100 Hz −6.9 · 200 Hz −8.5 · 500 Hz −4.3 · 1 kHz −2.3 · 3 kHz −2.2 · 5 kHz −6.5 · 8 kHz −6.5 · 15 kHz −8.4 | info |
| Realised vs design | 0.003 dB max | PASS |

Group delay is large near 200 Hz (−27.7 samples), inherited from v2's steep 160–500 Hz slope.

## EEL effects path (carried forward in v5)

| Block | Result | Status |
|---|---|:-:|
| De-esser @ 6.5 kHz | no cut ≤ −20 dBFS band level; −3.2 dB @ −15; −4.8 dB cap @ −10; 300 Hz–1 kHz untouched | PASS |
| Surround 3D (crossfeed) | mid change 0.00 dB, 100 Hz–8 kHz; hard-pan far ear −14…−27 dB | PASS |
| Space width | max setting: side +0.9 dB @ 1 kHz → +5.1 dB @ 15 kHz; mid 0.00 dB | PASS |
| All effects at 0 | bit-identical to v3 | PASS |
| Bypass | input delayed 48 samples, error 0 | PASS |
| Hot input, max settings | peak held at 0.8414 (−1.5 dBFS) | PASS |
| NaN / inf / 1e9 input | zero non-finite output; recovers | PASS |

The v5 script adds a processing-path selector: `Effects` (default) or `Limiter only`. Limiter only bypasses De-esser, Surround 3D and Space Width while retaining input gain and the sample-peak lookahead limiter. Switching paths clears effect memories. The selector change is source-reviewed only; it has not yet been run through the source-built VM or app.\n\nLimiter modes in the script: Default −1.5 dBFS / 80 ms, Safe −2.0 / 120, Transparent −1.0 / 200, Customize, Full bypass. `Full bypass` (and Master Off) selects the delayed raw-input path and bypasses the entire processing chain, not only the limiter. The Default ceiling (0.8414) was the one tested.

A first crossfeed dipped mono content 4.7 dB near 1 kHz; it was rebuilt as a delayed low-passed side cut.

## Not validated

- `NOT RUN`: app, ARM, native convolver, CPU cost of the added per-sample code, any listening.
- **Not Dolby.** Proprietary HRTF virtualisation is not reproduced. This is crossfeed plus width: speaker-like image, not true 3D.
- Clarity is addressed by de-essing and the low-mid clearing, not by a measured retune.
- De-esser threshold default is a guess.

The EEL header now states the shipped architecture accurately: the VDC is identity, the IRS carries the tonal correction, and the EEL stage adds no static tonal EQ.

SHA-256 values are in the README.
