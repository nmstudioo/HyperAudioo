# Raw Measurements and Target Curves: Methodology and Principles

Custom target curves for **KZ EDX Pro** (IEM) and **Xiaomi Redmi 12 4G** (internal speaker), used to design VDC, IRS and PEQ corrections for RootlessJamesDSP.

> **Status:** the targets and every filter derived from them are computed offline. They are not measured in the app, not validated with a calibrated rig, and are not published standards. The only real-world evidence is subjective listening (see section 5).

## 1. Conventions

- All levels are **dB relative to 1 kHz** (1 kHz = 0 dB). The raw files are normalised the same way before comparison.
- Targets are shipped as CSV: `frequency,target`, 701 points, log-spaced 20 Hz to 20 kHz.
- Interpolation between anchor points: **PCHIP on log10(frequency)**, which keeps the curve monotone between anchors and avoids overshoot.
- Correction filters are RBJ peaking biquads, designed separately at 44.1 kHz and 48 kHz.

## 2. Raw data

| Device | Source format | Notes |
|---|---|---|
| KZ EDX Pro | `frequency,raw`, about 700 points, 20 Hz to 20 kHz | Coupler measurement. Dips near 6.8, 10 and 13.7 kHz are treated as coupler artifacts. Data above 10 kHz is low-confidence |
| Redmi 12 4G speaker | `frequency,raw`, 59 points, 27 Hz to 19.9 kHz | Single-position measurement. Narrow features (for example the 2.7 kHz dip and the 3.3 kHz peak) are unreliable |

Principles for reading raw data:

1. Trust broad shape over narrow detail.
2. Never correct a feature that is a measurement artifact (coupler resonance, room or position effect).
3. Do not boost where the device has no output. For the speaker that means below about 100 Hz.

## 3. KZ EDX Pro target

<img src="https://nmstudioo.github.io/HyperAudioo/assets/KZ_EDX_Pro_target.png" alt="KZ EDX Pro raw response vs target" width="100%">

*The raw trace in this plot is subsampled, so fine peaks are smoothed.*

### Method

1. **Base shape:** a Harman-IE-style curve (bass shelf, ear-gain peak near 2.7 kHz, gentle treble tilt). It was typed from memory, **not** checked against the published data.
2. **Taste bias:** the response of the preferred listening chain was computed (raw + `IEM_B_v5C_plus.vdc` + HRIR IRS mono response). It was darker than Harman above 5 kHz and lighter in the bass, so the base was pulled toward it.
3. **Artifacts excluded:** the narrow raw peaks at 5, 8 and 11.8 kHz and the dips at 6.8, 10 and 13.7 kHz are not in the target.
4. **Above 10 kHz:** smooth roll-off, low weight in any fit.

### Anchor points

| Hz | dB | Hz | dB |
|---|---|---|---|
| 20 | +7.0 | 3000 | +9.0 |
| 40 | +7.3 | 3500 | +7.6 |
| 60 | +6.5 | 4000 | +6.8 |
| 100 | +4.0 | 5000 | +5.0 |
| 150 | +2.2 | 6000 | +4.0 |
| 200 | +0.8 | 7000 | +3.2 |
| 300 | −0.2 | 8000 | +2.2 |
| 450 | −0.4 | 9000 | +0.8 |
| 700 | −0.2 | 10000 | −0.8 |
| 1000 | 0 | 12000 | −3.0 |
| 1500 | +2.4 | 14000 | −5.5 |
| 2000 | +5.8 | 16000 | −8.5 |
| 2500 | +9.0 | 18000 | −12 |
| 2700 | +9.5 | 20000 | −16 |

If the result sounds too bright, lower 5 to 8 kHz by 1 to 1.5 dB.

## 4. Redmi 12 speaker target

<img src="https://nmstudioo.github.io/HyperAudioo/assets/Redmi12_Speaker_target.png" alt="Redmi 12 speaker raw response vs target" width="100%">

### Principle: target what the driver can actually do

A phone speaker has almost no output below 100 Hz and a deep notch at 400 to 650 Hz (about 17 dB down). A target must be physically reachable, so:

- **Low end:** follows the driver's natural roll-off. No bass boost (it only adds distortion and rattle). A 150 Hz high-pass guard is kept in the VDC.
- **Notch:** a **partial fill only**. A full fill would need more than 11 dB of boost. The target sits at −5 to −3 dB there, reachable with about +4 to +6 dB.
- **Treble:** the raw curve is about 10 dB hot from 2 to 10 kHz, so the target is a broad cut toward a gentle presence lift.
- **Filters:** broad only (Q of about 2 or less). A single-position measurement does not justify narrow filters.

### Anchor points

| Hz | dB | Hz | dB |
|---|---|---|---|
| 20 | −45 | 1500 | +1.8 |
| 40 | −34 | 2000 | +3.0 |
| 60 | −26 | 3000 | +3.5 |
| 90 | −18 | 4000 | +3.5 |
| 120 | −13 | 5000 | +3.0 |
| 160 | −10 | 6500 | +2.0 |
| 250 | −7 | 8000 | +1.0 |
| 400 | −5 | 10000 | −0.5 |
| 600 | −3 | 12000 | −3.0 |
| 800 | −1 | 14000 | −6.5 |
| 1000 | 0 | 16000 | −10.5 |
| | | 18000 | −14 |
| | | 20000 | −18 |

## 5. From target to filters

1. **Residual:** `raw + existing chain response (VDC + IRS mono) − target`, level-aligned over 400 Hz to 1.5 kHz.
2. **Fit:** least-squares fit of peaking biquads to the residual, with bounded frequency, Q and gain. Weight is reduced above about 9 kHz.
3. **Constraints:**
   - Cut-only where possible. Boosts are capped (+1.5 dB for the IEM trim, +4 dB for the speaker).
   - Q is capped (IEM trim 1.5 to 4, speaker 2 or less).
   - Any preamp is folded into the first section so that peak gain stays at or below 0 dB.
4. **Output:** coefficients as `b0,b1,b2,-a1,-a2` per section, with matching `SR_44100` and `SR_48000` banks.
5. **Chain awareness:** when the HRIR IRS is in the chain, its own tonal tilt is accounted for. An IRS-aware refit gave trims about half as deep as the IRS-blind fit.

### Listening evidence so far

- VDC + IRS + EEL beat a PEQ-only build by a large margin.
- `IEM_B_v5C_plus.vdc` with the HRIR IRS sounded good, even though it scores worse against the Harman-style target than v5C alone. The target is therefore a guide, not a judge.

## 6. Known limitations

- Targets are approximations; the Harman-style base was not checked against the published data.
- The raw files are single measurements. No repeat measurements, no fit or seal variation for the IEM.
- RMS figures quoted elsewhere in this repo are against these targets, not against listening preference.
- The biquad sign convention in the engine was not re-confirmed from the process function. Check any new VDC with a left-only tone or a sweep.
- Nothing here has been run on ARM or measured at the output.

## 7. Files

| File | Purpose |
|---|---|
| `KZ_EDX_Pro_target.csv` | IEM target, 701 points |
| `Redmi12_Speaker_target.csv` | Speaker target, 701 points |
| `images/KZ_EDX_Pro_target.png` | IEM raw vs target plot |
| `images/Redmi12_Speaker_target.png` | Speaker raw vs target plot |
