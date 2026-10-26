# KZ EDX Pro — IEM setup guide

> **Chain:** identity DDC → 2048-frame IRS → selectable EEL processing (v5; Effects is the default).
>
> **Listening caution:** the EDX Pro is a sensitive IEM (112 dB/mW). Begin at low volume.

## 1. Load order

| Order | Module | File | Role |
|---:|---|---|---|
| 1 | DDC | `HA_IEM_v3.vdc` | Identity; dual-rate 44.1 / 48 kHz banks; no correction |
| 2 | Convolver | `HA_IEM_v3.irs` | 2048-frame minimum-phase FIR, 48 kHz, float32 stereo; carries the correction |
| 3 | Liveprog | `HA_IEM_v3.eel` | Effects (default) or Limiter-only path, followed by look-ahead limiting |

Load correction **once**, in the convolver. The DDC is an identity stage; it does not add a second EQ.

## 2. Before you start

1. Set host rate to **48 kHz** (the IRS is 48 kHz only) and check the running rate.
2. Set convolver preamp to **0 dB**.
3. Disable other EQ, bass boost, and the app's own crossfeed; it stacks with Surround 3D.
4. Start at low volume.

## 3. Processing controls

**Processing mode** selects the signal path. `Effects` (default) runs De-esser, Surround 3D, and Space Width before the limiter. `Limiter only` bypasses all three effect blocks while retaining input gain, look-ahead limiting, and normal 48-sample latency. Switching paths clears effect memories to avoid stale state when returning to Effects.

| Control | Default | Range | Notes |
|---|---:|---|---|
| Master | `On` | Off / On | |
| Processing mode | `Effects` | Effects / Limiter only | Effects is default; Limiter only skips all three effect blocks |
| Limiter mode | `Default` | Default / Safe / Transparent / Customize / Full bypass | Full bypass disables the entire processing path |
| Custom ceiling tenths dBFS | `-15` | −600 … 0 | Used by Customize |
| Custom release ms | `80` | 10 … 500 | Used by Customize |
| Input gain tenths dB | `0` | −120 … 0 | |
| Deesser Amount | `40` | 0 … 100 | Maximum cut = amount × 0.12 dB; 0 = off |
| Deesser Threshold tenths dBFS | `-200` | −500 … −100 | Lower = more de-essing |
| Surround 3D Amount | `40` | 0 … 100 | Crossfeed; centre signal untouched; 0 = off |
| Space Width tenths dB | `20` | 0 … 60 | Side-channel shelf above ~3 kHz; 0 = off |

### Limiter modes

| Mode | Ceiling | Release |
|---|---:|---:|
| Default | −1.5 dBFS | 80 ms |
| Safe | −2.0 dBFS | 120 ms |
| Transparent | −1.0 dBFS | 200 ms |
| Customize | Slider | Slider |
| Full bypass | Bypass | n/a |

## 4. Tuning

1. Start at defaults.
2. If sibilance is prominent, lower Deesser Threshold toward `-250`. If cymbals sound dull, raise it toward `-150` or reduce Amount.
3. For more depth, raise Surround 3D toward `60`. If vocals or bass sound unnatural, set it to `0`.
4. Space Width above `40` can sound unnatural on wide recordings.
5. Each effect at `0` is intended to bypass that block transparently. `Limiter only` skips effects but retains input gain and limiting. `Full bypass` (or Master Off) bypasses the entire EEL processing chain, including input gain and limiter.

## 5. Operating notes

- The limiter is **sample-peak**, not true-peak and not a hearing-safety device.
- With the limiter engaged, signal delay is 48 samples (1 ms at 48 kHz). Delay-compensate null tests.
- Surround 3D is crossfeed plus width, not HRTF virtualisation.
- The app rewrites the `.eel` file when a control moves. Keep a clean copy.
