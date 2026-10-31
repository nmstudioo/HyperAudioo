# HyperAudio · Test Report

This report consolidates the verification status of all assets in the HyperAudio repository.

---

## Validation Matrix

The following table summarizes the testing state of each component across the three evidence levels.

| Component | Offline / Numerical | Device / App | Listening |
|---|---|---|---|
| **Redmi 12 Speaker** | | | |
| VDC (`HA_Speaker_Master.vdc`) | `PASS` (identity) | `USER REPORTED` | `USER REPORTED` |
| IRS (`HA_Speaker_Master.irs`) | `PASS` | `USER REPORTED` | `USER REPORTED` |
| EEL V6 (`HA_Speaker_Master_BETA.eel`) | `PARTIAL` | `USER REPORTED` | `USER REPORTED` |
| EEL V1.0 (`HA_Speaker_Master.eel`) | `NO RECORD` | `NOT RUN` | `NOT RUN` |
| **KZ EDX Pro IEM** | | | |
| VDC (`HA_IEM_v3.vdc`) | `PASS` (identity) | `USER REPORTED` | `USER REPORTED` |
| IRS (`HA_IEM_v3.irs`) | `PASS` | `USER REPORTED` | `USER REPORTED` |
| EEL v5 (`HA_IEM_v3.eel`) | `PASS` (source review) | `NOT RUN` | `NOT RUN` |

---

## Outstanding Work

### 1. EEL2 v5 Mode Selector (IEM)
The EEL script for the IEM has been source-audited, but the processing-mode selector has not been tested inside the JamesDSP VM or on an Android device.

### 2. EEL2 Standalone (Speaker)
The new standalone PEQ script for the Speaker profile has not yet been tested on device.

### 3. ARM Compatibility
All offline checks were performed on an x86_64 build of the JamesDSP VM. ARM-specific floating-point behavior (denormals, etc.) has not been formally tested for the latest script revisions.

---

## Open Questions

- **Reproducibility:** The source scripts used to generate the IRS files (`generate_irs.py`, `iem_build.py`) are not currently included in the repository. The published `.irs` files cannot be regenerated from source alone.
- **Speaker IRS Provenance:** The exact measurement environment for the Redmi 12 Speaker IRS is not documented. If a microphone response was included in the source measurement, it is inherently present in the filter.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
