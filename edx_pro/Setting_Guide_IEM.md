# Setting Guide · KZ EDX Pro (IEM)

> **Chain:** identity DDC → 2048-tap IRS → selectable EEL processing (v5; Effects is default).

## 1 · Load order

| Order | Module | File | Role |
|:-:|---|---|---|
| 1 | DDC | `HA_IEM_v3.vdc` | Identity, dual-rate (44.1 and 48 kHz banks). No correction. |
| 2 | Convolver | `HA_IEM_v3.irs` | 2048-frame minimum-phase FIR, 48 kHz, float32, stereo. The correction. |
| 3 | Liveprog | `HA_IEM_v3.eel` | Effects (default) or limiter-only, followed by the look-ahead limiter. |

Load the correction **once**, in the convolver. The DDC is an identity, so there is no second EQ to double it.

## 2 · Before you start

1. Host rate **48 kHz** (the IRS is 48 kHz only). Check the *running* rate.
2. Convolver preamp **0 dB**.
3. Disable other EQ, bass boost and the app's own crossfeed. It stacks with Surround 3D.
4. **Low volume first** (IEM, 112 dB/mW).

## 3 · EEL controls

**Processing mode** selects the signal path. `Effects` (default) runs De-esser, Surround 3D and Space Width before the limiter. `Limiter only` bypasses all three effect blocks while retaining input gain, look-ahead limiting and the normal 48-sample latency. Switching paths clears effect memories to avoid stale state when returning to Effects.

| Control | Default | Range | Notes |
|---|:-:|:-:|---|
| Master | `On` | Off / On | |\n| Processing mode | `Effects` | Effects / Limiter only | Effects is the default; Limiter only skips all three effect blocks. |
| Limiter mode | `Default` | Default · Safe · Transparent · Customize · Full bypass | Full bypass disables the entire processing path |
| Custom ceiling tenths dBFS | `-15` | −600 … 0 | Used by Customize |
| Custom release ms | `80` | 10 … 500 | Used by Customize |
| Input gain tenths dB | `0` | −120 … 0 | |
| Deesser Amount | `40` | 0 … 100 | Max cut = amount × 0.12 dB. 0 = off |
| Deesser Threshold tenths dBFS | `-200` | −500 … −100 | Lower = more de-essing |
| Surround 3D Amount | `40` | 0 … 100 | Crossfeed. Centre signal untouched. 0 = off |
| Space Width tenths dB | `20` | 0 … 60 | Side-channel shelf above ~3 kHz. 0 = off |

| Limiter mode | Ceiling | Release |
|---|:-:|:-:|
| Default | −1.5 dBFS | 80 ms |
| Safe | −2.0 dBFS | 120 ms |
| Transparent | −1.0 dBFS | 200 ms |
| Customize | slider | slider |
| Full bypass | bypass | n/a |

## 4 · Tuning

1. Start at defaults.
2. Sibilant → lower Deesser Threshold toward `-250`. Cymbals dull → raise it toward `-150`, or lower the amount.
3. More depth → Surround 3D toward `60`. If vocals or bass feel odd → `0`.
4. Space Width above `40` can sound unnatural on wide recordings.
5. Every effect at `0` is intended to be a transparent bypass of that block. `Limiter only` skips effects but retains input gain and limiting. `Full bypass` (or Master Off) bypasses the entire EEL processing chain, including input gain and limiter.

## 5 · Notes

- The limiter is **sample-peak**, not true-peak and not a hearing-safety device.
- With the limiter engaged or on, the signal is delayed 48 samples (1 ms). Delay-compensate null tests.
- Surround 3D is crossfeed plus width, not HRTF virtualisation.
- The app rewrites the `.eel` when a control moves. Keep a clean copy.
