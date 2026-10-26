# Methodology

How HyperAudio assets are designed, gated, validated, and labelled.

> **Core principle:** predicted, numerically checked, VM-tested, device-tested, and listened-to are different evidence states. One must never be presented as another.

## 1. Processing architecture

```text
Source → DDC (VDC) → Convolver (IRS) → Liveprog (EEL2) → Output
```

Tonal correction lives in **one place: the IRS**. The shipped VDC files are identity filterbanks unless a file explicitly says otherwise. EEL2 is the operational stage for gain trim, limiting, bypass, and optional effects.

## 2. Correction design

1. **Interpolate** measurement data using PCHIP on a logarithmic frequency axis.
2. **Smooth** by fractional octave, finer at low frequencies and coarser above 2 kHz, to reduce reflection-like roughness.
3. **Reference** to a median level over a stable band; correction is reference minus response.
4. **Cap** boost and cut. These caps are engineering choices, not measured properties.
5. **Synthesize** a causal minimum-phase FIR using a real-cepstrum method, then fade and normalize the tail.

The IEM voicing layer is a design choice, not a coupler-verified correction. Speaker measurement and microphone/setup provenance is incomplete.

## 3. IRS acceptance gates

| Gate | Limit / requirement |
|---|---|
| Peak tap | ≤ 0.95 |
| L1 norm | ≤ 1.25 |
| Tail metric | ≤ −80 dB, using the profile's stated definition |
| Maximum gain, 20 Hz–20 kHz | ≤ 0 dB |
| Realised response | Recalculate from the written/exported file |
| Format | RIFF float32, stereo, 48 kHz, finite samples |

Tail results are comparable only when their measurement windows and definitions match. See the [IRS reference](irs_functions.md).

## 4. EEL verification

A JamesDSP VM built from pinned source runs each script on raw float32 stereo. The current evidence environment is x86_64; it is not the Android app or native ARM target.

Checks include:

- Compile and load behaviour.
- Bypass and effects-off identity.
- Ceiling behaviour on noise, sine, and impulse inputs.
- Non-finite input (NaN, infinity, and large finite values) and recovery.
- Slider/default parsing through a static port of the app regex.

**Authoring constraints learned from the target VM:** avoid section-token text in comments where the loader may match it; assign slider defaults in the init section; keep slider labels free of `( ) : %`; test non-finite values with:

```eel
abs(x) < 1e6 ? 0 : (x = 0.0);
```

See the [EEL2 reference](eel_functions).

## 5. Evidence labels

| Label | Meaning |
|---|---|
| `PASS` | Executed and met its stated criterion |
| `FAIL` | Executed and missed its criterion |
| `NOT RUN` | Not executed |
| `NOT POSSIBLE` | Cannot be executed in the available environment |
| `CONDITIONAL` | Passes only under a stated assumption |
| `USER REPORTED` | Reported by the user; not independently reproduced |

## 6. Release states

**Experimental → Numerically qualified → Device-tested → Production-approved**

Numerical qualification never implies device testing or listening.

## 7. Project rules

- Frozen references are not silently modified.
- Every claim carries an evidence label.
- Predicted is not measured.
- Voicing choices are identified as design choices.
- File inspection and offline numerical qualification do not prove native app acceptance, ARM runtime behaviour, or acoustic performance.

## Related references

- [VDC](vdc_functions.md) · [IRS](irs_functions.md) · [EEL2](eel_functions) · [Test report](test_report.md)
