# HyperAudio · System Reference

This document provides a complete architectural overview of the HyperAudio DSP system, detailing how the VDC, IRS, and EEL2 components interact across both the IEM and Speaker profiles.

---

## Overview

The HyperAudio system is a modular DSP chain designed for RootlessJamesDSP. It separates audio processing into three distinct domains: tonal correction, spatial character, and dynamic safety.

| Domain | Processing Block | Responsibility |
|---|---|---|
| **Tonal Correction** | IRS (Convolver) | Applies the exact minimum-phase EQ curve. |
| **Tonal Baseline** | VDC (DDC) | Identity filterbank (maintains chain architecture). |
| **Dynamic Safety** | EEL2 (Liveprog) | Look-ahead limiting and driver protection. |

---

## Signal Flow

The standard signal flow for the three-file architecture (used by the IEM and the legacy Speaker V6) is linear:

```mermaid
flowchart LR
    A[Source Audio] --> B["VDC<br/>Identity Filter"]
    B --> C["IRS<br/>Minimum-Phase EQ"]
    C --> D["EEL2 Liveprog<br/>Limiter / Character"]
    D --> E[Output to DAC]
```

[!IMPORTANT]
The VDC and IRS must never apply the same EQ twice. In the HyperAudio architecture, the VDC is intentionally left as an identity filter, allowing the IRS to act as the sole tonal authority.

---

The data/ Directory

The data/ directory serves as the empirical foundation of the project. It contains the raw measurement data and the target curves used to generate the IRS files offline.

Directory Contents
data/Raw/ Contains the raw frequency response measurements (.txt) for the KZ EDX Pro and Redmi 12.
data/target/ Contains the custom target curves (.txt) used to calculate the delta.

For a detailed explanation of how these curves are generated and aligned, see Raw and Target Curves.

---

The addons/ Directory

The addons/ folder contains optional effects that do not form part of the core correction chain.

· IRS Add-ons: BBE SonicMax.irs and EFOtech MLV...irs can be loaded into the Convolver instead of the core IRS to provide phase alignment or spatial crossfeed.
· JSON Presets: Reference files for EasyEffects that must be manually replicated in RootlessJamesDSP.

[!WARNING]
Loading an add-on IRS replaces the core IRS. You cannot use them simultaneously. Always lower the volume before swapping, as add-on IRS files are not level-matched to the core gates.

---

Verification Harness

The browser site includes a verification harness that fetches the repository assets and runs offline checks.

· It verifies the file format (e.g., IEEE Float32, 50-value VDC lines).
· It runs a digital magnitude response check on the IRS.
· It does not emulate the ARM processor, the Android audio thread, or the physical acoustics of the hardware.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
```

---

2. docs/methodology.md

```markdown
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
