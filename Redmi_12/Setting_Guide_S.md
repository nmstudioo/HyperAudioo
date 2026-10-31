# HyperAudio · Redmi 12 Speaker Setup

This guide details the installation for the Redmi 12 speaker profile. The current recommended configuration uses a standalone Liveprog PEQ script. 

---

## Overview

The Redmi 12 chain uses a single, highly optimized EEL2 script. This script combines a multi-band parametric EQ with a stereo-linked look-ahead limiter to correct the speaker's physical limitations directly.

> [!WARNING]
> **Architecture Change:** This guide uses the standalone PEQ configuration. It explicitly **excludes** the VDC and IRS files from the legacy V6 chain. Do not load `HA_Speaker_Master.vdc` or `HA_Speaker_Master.irs` with this setup.

| Component | File | Function |
|---|---|---|
| **EEL** | `HA_Speaker_Master.eel` | Standalone PEQ + look-ahead limiter. |
| *Legacy VDC* | *`HA_Speaker_Master.vdc`* | *Frozen asset (do not load with this guide).* |
| *Legacy IRS* | *`HA_Speaker_Master.irs`* | *Frozen asset (do not load with this guide).* |

---

## Prerequisites

Before loading the file, ensure the following conditions are met:

1. Set the RootlessJamesDSP host rate to **48 kHz**.
2. Disable all system-level EQ, bass boost, and OEM audio effects.
3. Leave the DDC and Convolver sections **empty**.

---

## Step-by-Step Installation

### 1. Load the Standalone EEL2 Script
Navigate to the **Liveprog** (EEL2) section. Load `HA_Speaker_Master.eel`.

This script performs the entire correction chain in one pass:
- **PEQ:** Corrects the speaker's harsh treble peaks and bloated mid-bass.
- **Limiter:** Prevents the physical driver from clipping or distorting.

### 2. Configure the Sliders
Upon loading, verify the default slider values in the Liveprog interface:
- **Pre Gain:** `0 dB` (Adjust only if additional volume is needed).
- **Limiter Ceiling:** `-1.5 dBFS` (Protects the hardware).
- **Release:** `80 ms`.

> [!NOTE]
> Because this is a standalone script, it replaces the need for external IRS files. The math is calculated directly in the EEL VM.

---

## Legacy V6 Assets

The older V6 configuration used a three-file chain (`HA_Speaker_Master.vdc` → `HA_Speaker_Master.irs` → `HA_Speaker_Master_BETA.eel`). These files remain in the repository for archival purposes and are documented in the [V6 Technical Report](report_Redmi_12.md). 

Do not mix the legacy VDC/IRS with the standalone EEL script.

---

## Verification

1. Play a bass-heavy track at moderate volume.
2. Confirm the low-end is controlled (not bloated) and the treble is no longer harsh.
3. Push the volume. The limiter should engage smoothly without causing the speaker to rattle or distort.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
