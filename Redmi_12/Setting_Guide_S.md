# Setting Guide · Redmi 12 Speaker PEQ

> **Standalone chain:** RootlessJamesDSP Liveprog (EEL) only. This setup replaces the previous DDC → IRS → limiter chain for PEQ audition/use.

## 1 · Load order

Load only:

| Order | Module | File | Role |
|:-:|---|---|---|
| 1 | Liveprog | `HA_Speaker_Master.eel` | Standalone parametric EQ plus stereo-linked look-ahead limiter |

**Do not load** `HA_Speaker_Master.vdc`, any Speaker DDC, or `HA_Speaker_Master.irs` / any Speaker convolver impulse response with this setup. Disable other system/player EQ, bass enhancement and OEM sound effects to avoid stacking corrections.

The three PEQ choices are alternatives. Select one profile at a time; never stack profiles.

## 2 · Before you start

1. Set the RootlessJamesDSP processing rate to **48 kHz** where possible. The limiter look-ahead is 48 samples (1 ms at 48 kHz); the biquad coefficients are calculated using the active EEL sample rate.
2. Start at a moderate listening volume.
3. Level-match when comparing profiles. The profile-specific preamp is built into each selected profile.

## 3 · EEL controls

| Control | Default | Range | Meaning |
|---|:-:|---|---|
| Processing | `Protect` | Bypass / Protect | Bypass is a true bypass; Protect enables selected PEQ and limiter |
| Speaker PEQ Profile | `Off` | Off / Fusion Hybrid / Equilibrium / Stellar Master | Select exactly one PEQ profile |
| Input Gain tenths dB | `0` | −12.0 … +6.0 dB | Additional trim ahead of PEQ and limiter |
| Peak Ceiling tenths dBFS | `-30` | −12.0 … 0 dBFS | Linked sample-peak ceiling; default −3.0 dBFS |
| Release ms | `80` | 20 … 300 ms | Limiter gain recovery time |

### Profile selector

| Value | Profile | Built-in preamp |
|:-:|---|---:|
| 0 | Off (limiter only) | 0 dB |
| 1 | Fusion Hybrid | −7.5 dB |
| 2 | Equilibrium | −7.2 dB |
| 3 | Stellar Master | −0.1 dB |

The PEQ profiles are implemented as cascaded RBJ biquads. The low/high-shelf Q-to-slope conversion follows the RBJ cookbook mapping; confirm shelf response against Poweramp or measurement before treating it as bit-identical to the exported EQ.

## 4 · Limiter

Protect mode uses a stereo-linked 48-sample look-ahead limiter, instant attack and exponential release. At 48 kHz, the added look-ahead latency is 1 ms. The output is sample-peak clamped to the selected ceiling.

The limiter is not a true-peak limiter, excursion model, or hearing-safety device. It cannot guarantee protection from speaker damage at arbitrary volume.

## 5 · Notes

- `Off` means no PEQ and no profile preamp; the limiter remains active in Protect mode.
- `Bypass` disables PEQ, input gain, delay, limiter and output clamp.
- Changing profiles clears filter history and immediately installs the new coefficients. For clean A/B comparisons, change profiles while playback is paused or muted.
- Keep a clean copy of this EEL file before editing.