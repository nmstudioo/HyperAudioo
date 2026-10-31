# HyperAudio · Add-on Effects

This document outlines the optional effects available in the `addons/` directory. These files are designed to supplement the core chain, but they must be used carefully to avoid breaking the tonal correction.

---

## Overview

The HyperAudio core chain (VDC → IRS → EEL2) is mathematically tuned for a flat, reference-grade response. The add-ons in this directory introduce specific acoustic dimensions—such as spatial externalization or transient phase alignment—without applying standard EQ.

---

## IRS Add-ons

The RootlessJamesDSP convolver can only load **one** `.irs` file at a time. Loading an add-on IRS means you are **replacing** the core tonal-correction IRS. 

> [!WARNING]
> **Level Matching:** The add-on IRS files are not level-matched to the project gates. Measured maximum gain from 20 Hz to 20 kHz:
> - `BBE SonicMax.irs`: +7.9 dB (left) and +9.8 dB (right)
> - `EFOtech MLV...irs`: +3.7 to +5.3 dB across its four channels
>
> Lower your volume significantly before swapping the core IRS for an add-on.

### BBE SonicMax (`BBE SonicMax.irs`)
- **Purpose:** Phase alignment and transient punch.
- **How it works:** It applies a frequency-dependent phase shift to realign the low and high frequencies, restoring the "attack" of drums and guitars.
- **Usage:** Load in the Convolver instead of the core IRS.

### EFOtech MLV (`EFOtech MLV 01024 (True Stereo, 48kHz).irs`)
- **Purpose:** Spatial externalization (crossfeed).
- **How it works:** A measured 1024-tap HRTF kernel that mimics the acoustic shadow of a human head, pushing the sound out of your head.
- **Usage:** Load in the Convolver instead of the core IRS. Turn off the built-in BS2B crossfeed in RootlessJamesDSP.

---

## JSON Reference Presets

The `addons/` folder contains three `.json` files from the EasyEffects project:
- `Concert Hall.json` (Reverb)
- `GentleDynamics.json` (Multiband compressor)
- `Night Listening.json` (ISO 226 loudness)

> [!NOTE]
> RootlessJamesDSP **cannot** load EasyEffects `.json` files directly. These files are provided as references. If you wish to use their effects, you must manually read the parameters in the JSON file and recreate them using the built-in Dynamic Bass Boost, FET Compressor, or Reverb modules in RootlessJamesDSP.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
