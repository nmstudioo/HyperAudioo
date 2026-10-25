# Setting Guide · Redmi 12 Speaker

> **Chain:** identity DDC → 8192-tap IRS → transparent limiter. Files are the frozen V6 set.

## 1 · Load order

| Order | Module | File | Role |
|:-:|---|---|---|
| 1 | DDC | `HA_Speaker_Master.vdc` | Identity (10 pass-through sections, 44.1 kHz and 48 kHz banks). No correction. |
| 2 | Convolver | `HA_Speaker_Master.irs` | 8192-frame minimum-phase FIR, 48 kHz, float32, stereo. The correction. |
| 3 | Liveprog | `HA_Speaker_Master.eel` | Post-IRS linked look-ahead limiter. No EQ or tonal change. |

All three are used together. Unlike the EDX Pro chain, they are meant to stack: the VDC does nothing, so nothing is doubled.

## 2 · Before you start

1. Host rate **48 kHz**. The IRS is 48 kHz only. Check the *running* rate in Rootless, not only the configured one.
2. Convolver preamp **0 dB**.
3. Turn off every other EQ, bass boost and OEM sound effect.
4. Start at a moderate volume.

## 3 · EEL controls

| Control | Default | Range | Meaning |
|---|:-:|:-:|---|
| Processing | `Protect` | Bypass / Protect | Bypass is a true bypass: no gain, no delay, no limiter |
| Input Gain tenths dB | `0` | −120 … +60 | Trim ahead of the limiter, 0.1 dB steps |
| Peak Ceiling tenths dBFS | `-30` | −120 … 0 | −3.0 dBFS sample-peak ceiling |
| Release ms | `80` | 20 … 300 | Gain recovery time after limiting |

Limiter behaviour: 48-sample look-ahead (1 ms at 48 kHz), instant attack, exponential release, both channels linked so the image does not shift. In Protect mode the output is delayed 48 samples.

## 4 · Tuning

- **Quiet or thin** → raise volume first. The IRS is close to flat (about −0.1 to −1.3 dB), so it is not the cause. Raising Input Gain only makes the limiter work harder.
- **Pumping or dulling on loud material** → lower Input Gain, or raise the ceiling toward `-20`.
- **Slow recovery after peaks** → lower Release toward `50`.
- **Before A/B tests** → level-match; Protect adds 1 ms delay, so use a delay-compensated null.

## 5 · Notes

- The limiter is a **sample-peak** limiter. It is not true-peak or speaker-excursion protection, and not a hearing-safety device.
- The app rewrites the `.eel` when a control moves. Keep a clean copy.
