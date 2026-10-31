# HyperAudio · KZ EDX Pro Setup

This guide details the installation and configuration for the KZ EDX Pro IEM profile. The chain uses three files to achieve a mathematically flat tonal foundation, dynamic safety, and optional spatial character. 

---

## Overview

The KZ EDX Pro chain requires the RootlessJamesDSP app. It uses a three-stage architecture: an identity VDC, a tonal-correcting IRS, and an EEL2 limiter.

| Component | File | Function |
|---|---|---|
| **VDC** | `HA_IEM_v3.vdc` | Identity filterbank (no tonal correction). |
| **IRS** | `HA_IEM_v3.irs` | Minimum-phase FIR (applies the actual tuning). |
| **EEL** | `HA_IEM_v3.eel` | Look-ahead limiter and dynamic safety. |

---

## Prerequisites

Before loading the files, ensure the following conditions are met in RootlessJamesDSP:

> [!WARNING]
> **Host Rate:** You must set the RootlessJamesDSP processing rate to **48 kHz**. Verify the actual running rate in the app settings, not just the system configuration. The `HA_IEM_v3.irs` file is a 48 kHz asset; running it at 44.1 kHz will change the filter timing and frequency behavior.

1. Disable all other EQ, bass boost, and OEM sound effects.
2. Set the Convolver Preamp to **0 dB**. The IRS is already level-matched.
3. Do not load the VDC and IRS if you are using a standalone EQ preset.

---

## Step-by-Step Installation

### 1. Load the VDC
Navigate to the **DDC** (Digital Direct Correction) section. Load `HA_IEM_v3.vdc`.

> [!NOTE]
> The VDC is an identity filterbank. It does not alter the frequency response; it exists only to maintain a consistent three-stage architecture across the IEM and Speaker profiles. 

### 2. Load the IRS
Navigate to the **Convolver** section. Load `HA_IEM_v3.irs`. Ensure the convolver preamp is set to `0 dB`.

> [!IMPORTANT]
> Tonal correction happens here. Never stack another EQ on top of the IRS, or you will apply the correction twice.

### 3. Load the EEL2 Limiter
Navigate to the **Liveprog** (EEL2) section. Load `HA_IEM_v3.eel`. 

The EEL script provides a true look-ahead limiter. Set the ceiling slider to `-0.5 dBFS` and the release time to `150 ms`.

---

## Verification

After loading all three files:
1. Play a familiar track at low volume.
2. Confirm the EEL2 UI renders correctly and the processing mode is active.
3. Increase the volume. The limiter should catch peaks without audible distortion or pumping.

For detailed numerical metrics, see the [IEM Technical Report](report_EDX_HA.md).

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
