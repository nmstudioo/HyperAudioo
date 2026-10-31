# HyperAudio · IRS Reference

This document defines the Impulse Response Sample (IRS) format, how it is processed by RootlessJamesDSP, and the technical boundaries of the HyperAudio `.irs` files.

---

## Overview

An `.irs` file is a WAV audio file containing an Impulse Response. When loaded into a convolver, it acts as a highly precise FIR (Finite Impulse Response) filter. 

Within HyperAudio, the IRS is the **sole tonal correction stage** for the IEM profile. It applies the exact minimum-phase EQ curve derived from offline measurements.

---

## Technical Specifications

The HyperAudio `.irs` files are generated and validated against strict digital signal processing constraints.

| Property | IEM Profile (`HA_IEM_v3.irs`) | Speaker Profile (`HA_Speaker_Master.irs`) |
|---|---|---|
| **Sample Rate** | 48,000 Hz | 48,000 Hz |
| **Format** | IEEE Float32 | IEEE Float32 |
| **Channels** | 2 (Stereo, identical L/R) | 2 (Stereo, identical L/R) |
| **Taps (Length)** | 2,048 samples | 8,192 samples |
| **Phase** | Minimum-phase | Minimum-phase |

> [!WARNING]
> **Sample Rate Lock:** The `.irs` files are strictly 48 kHz. If your Android device or audio app runs at 44.1 kHz, the convolver will either resample the file (introducing aliasing) or play it at the wrong speed. This shifts every filter frequency and ruins the tuning. Always verify the host rate is 48 kHz.

---

## Format Constraints

RootlessJamesDSP's convolver expects a standard WAV container. However, there are two critical format traps:

1.  **IEEE Float32 vs PCM:** The file must be encoded as IEEE Float32 (Audio Format Code `3`), not standard 16-bit or 32-bit PCM Integer.
2.  **Header Structure:** Standard WAV headers (like those written by Python's `wave` module) default to PCM. The header must be manually constructed to specify `WAVE_FORMAT_IEEE_FLOAT`.

---

## Processing Architecture

The IRS represents a **linear, time-invariant (LTI)** system.

> [!IMPORTANT]
> Because convolution is a linear mathematical operation, an `.irs` file cannot generate new harmonics. It can only alter the amplitude and phase of the frequencies already present in the source audio. Tape saturation and analog warmth require non-linear processing (like the EEL2 script), not an IRS.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
