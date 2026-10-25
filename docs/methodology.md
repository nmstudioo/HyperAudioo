
# Methodology

How every file in this repository is designed, gated and labelled.

## 1 · Signal chain

```
Source → DDC (VDC) → Convolver (IRS) → Liveprog (EEL2) → Output
```

Tonal correction lives in **one** place (the IRS). The VDC is an identity unless a file says otherwise. The EEL stage is operational: gain trim, limiting, bypass, optional effects.

## 2 · Correction design

1. **Interpolate** measurement data (PCHIP) in log-frequency.
2. **Smooth** by fractional octave (finer at low frequency, coarser above 2 kHz) to remove reflection-like roughness.
3. **Reference** to a median level over a stable band; correction = reference − response.
4. **Cap** boost and cut. Caps are safety choices, stated as such, never presented as data.
5. **Synthesise** a causal minimum-phase FIR (real cepstrum), fade the tail, normalise.

## 3 · Acceptance gates (IRS)

| Gate | Limit |
|---|---|
| Peak tap | ≤ 0.95 |
| L1 norm | ≤ 1.25 |
| Tail energy | ≤ −80 dB |
| Max gain 20 Hz–20 kHz | ≤ 0 dB |
| Realised vs design | measured from the *written file* |
| Format | RIFF float32, stereo, 48 kHz, finite |

## 4 · EEL verification

A JamesDSP VM built from the pinned source runs each script on raw float32 stereo.

- compile check · bypass identity · effects-off identity
- ceiling test on noise, sines and impulses
- non-finite input (NaN, inf, 1e9) · recovery after the event
- slider/default parsing via a static port of the app regex

**EEL2 rules learnt the hard way:** never write the section tokens in comments (the loader uses the first match); assign slider defaults in the init section; keep slider labels free of `( ) : % —`; test non-finite values with `abs(x) < 1e6 ? 0 : (x = 0.0);`.

## 5 · Evidence labels

| Label | Meaning |
|---|---|
| `PASS` | Executed, met its criterion |
| `FAIL` | Executed, missed |
| `NOT RUN` | Not executed |
| `NOT POSSIBLE` | Cannot be executed here |
| `CONDITIONAL` | Passes only under a stated assumption |
| `USER REPORTED` | Stated by the user, not independently reproduced |

## 6 · Release states

**Experimental → Numerically qualified → Device-tested → Production-approved.** "Numerically qualified" never implies device testing or listening.

## 7 · Rules

Frozen references are never modified. Every claim carries a label. Predicted ≠ measured. Voicing choices are labelled as design choices.
