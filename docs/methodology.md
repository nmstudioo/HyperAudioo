# HyperAudio · Methodology

This document outlines the engineering methodology behind HyperAudio, with a strict focus on the boundary between mathematical evidence and physical validation.

---

## Evidence Model

HyperAudio uses a three-tier evidence model to classify the state of every DSP asset.

| Evidence Level | Definition |
|---|---|
| **Offline / Numerical** | Verified via script, source audit, or Python simulation. |
| **Device / App Test** | Tested inside the RootlessJamesDSP app on the target OS. |
| **Listening Test** | Verified by human subjective evaluation. |

> [!NOTE]
> A file that passes offline numerical checks is not automatically validated for device use. Offline checks use an x86_64 VM. They do not account for ARM architecture, Android audio thread scheduling, or physical driver limitations.

---

## Processing Rationale

### 1. Minimum-Phase FIR (IRS)
The tonal correction is applied via a 2048-tap (IEM) or 8192-tap (Speaker) minimum-phase FIR filter. This allows for precise frequency shaping without the latency of a linear-phase filter, which is critical for real-time mobile audio.

### 2. Sample-Peak Limiting (EEL2)
The dynamic safety stage uses a look-ahead limiter. It is designed to catch digital peaks before they clip the DAC. It is explicitly **not** a true-peak limiter, and it does not guarantee physical driver-excursion protection (excursion is handled by the IRS tonal cuts and hardware guards).

### 3. No Resampling
The IRS files are strictly 48 kHz. The system relies on the Android OS and the DSP app to run the host rate at exactly 48 kHz. Any resampling introduces phase shifts and frequency deviations.

---

## Target Curve Generation

The target curves are not universal standards (like Harman or IEF Neutral). They are custom offline-computed targets tailored to the specific acoustic flaws of the device.
- For the IEM, the target is a modified Harman response designed to reduce shoutiness.
- For the Speaker, the target is a custom house curve that rolls off the bass to protect the driver.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
