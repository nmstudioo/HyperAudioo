# HyperAudio DSP — Add-on Effects Library

These add-on components are designed to supplement the **KZ EDX Pro Core Chain** (the VDC + EEL Limiter). 

Because the core `HA_IEM_v4.vdc` mathematically flattens the IEM's frequency response, **the add-ons in this folder do not apply any EQ or tonal correction.** Instead, they add specific acoustic dimensions—such as spatial externalization, transient phase alignment, or dynamic volume compensation—without breaking the tonal foundation.

## ⚠️ Core Rules
1. **Never stack IRS files.** The RootlessJamesDSP Convolver can only load one `.irs` file at a time. Choose the one that fits your listening session.
2. **Keep the Convolver Preamp at 0 dB.** All `.irs` files in this folder are pre-normalized to safe levels. Do not apply additional gain reduction inside the Convolver.
3. **Do not use the built-in BS2B Crossfeed if you are using the EFOtech Crossfeed IRS.** They do the same job; using both will result in phase cancellation and a hollow sound.

---

## 1. Phase & Clarity Upgrade
**File:** `BBE_SonicMax.irs`
**Type:** Impulse Response (IRS)
**What it does:** Replicates the famous BBE Sonic Maximizer hardware. It applies a frequency-dependent phase shift, delaying the low frequencies so they align perfectly with the high frequencies. This restores the "attack" and punch of drums and guitars without adding artificial treble.
**How to use it:** Load this into the Convolver slot. It completely replaces the custom `EDX_Analog_Warmth.irs` if you want a more aggressive, hardware-accurate phase correction.

---

## 2. Spatial Externalization (Crossfeed)
**File:** `EFOtech_MLV_01024_TrueStereo.irs`
**Type:** True-Stereo (4-Channel) Impulse Response
**What it does:** IEMs push sound directly into your ear canal, causing "in-head" localization (the music sounds like it is inside your skull). This measured 1024-tap HRTF kernel mimics the acoustic shadow of a human head, pushing the soundstage outward to simulate a pair of studio monitors in front of you.
**How to use it:** Load this into the Convolver slot. Turn off the built-in BS2B crossfeed. 

---

## 3. Dynamic Range / Glue Reference
**File:** `GentleDynamics.json`
**Type:** EasyEffects Preset (Reference Only)
**What it does:** A highly regarded 8-band multiband compressor designed to gently "glue" the mix together and even out level differences.
**How to use it:** RootlessJamesDSP cannot natively load EasyEffects `.json` files. **Do not load this directly.** If you want this effect, open the file in a text editor, read the compressor thresholds/ratios, and manually dial them into the RootlessJamesDSP FET Compressor. *(Note: For critical listening, we recommend keeping compression OFF to preserve the original dynamic punch of the recording).*

---

## 4. Volume Compensation (Night Mode)
**File:** `Night_Listening.json`
**Type:** EasyEffects Preset (Reference Only)
**What it does:** Implements the ISO 226 equal-loudness contour. At low volumes, human hearing naturally loses sensitivity to bass and treble. This preset dynamically boosts those frequencies *only* at low volumes, keeping the music sounding full and balanced without waking the neighbours.
**How to use it:** Like above, this is a reference JSON. To achieve this in RootlessJamesDSP, enable the built-in **Dynamic Bass Boost** (or Loudness) module and set the reference volume to your typical quiet listening level. 

---

## 5. Ambient Spatial Reverb
**File:** `Concert_Hall.json`
**Type:** EasyEffects Preset (Reference Only)
**What it does:** A pure algorithmic reverb (Zita Reverb) tuned for ambient and live recordings. It adds a natural, decaying acoustic space around the music without the metallic artifacts of cheap "3D" spatializers.
**How to use it:** This is a situational reference file. To replicate it in RootlessJamesDSP, enable the built-in Reverb module and use a large room size with a wet mix of 10%–15%. Do not use this for standard studio tracks, as it will reduce clarity.
