# HyperAudio · Redmi 12 Speaker Report

This document provides the technical breakdown and numerical evidence for the Redmi 12 speaker correction. It covers the transition from the legacy V6 three-file chain to the current standalone EEL2 PEQ script.

---

## Overview

The Redmi 12 speaker profile addresses the physical limitations of a small mobile driver. The architecture has evolved from a multi-file VDC/IRS chain (V6) to a consolidated standalone Liveprog PEQ (V1.0) for more direct control.

| Component | Current State | Verification State |
|---|---|---|
| **Standalone EEL (V1.0)** | Active recommended setup | App testing pending |
| **Legacy V6 Chain** | Frozen in repository | User reported |
| **Target Curve** | Custom Room/House Curve | Offline computed |

---

## Legacy V6 Architecture (Frozen)

The V6 configuration used a three-file chain. These assets remain in the repository for archival purposes but are superseded by the standalone PEQ.

| Component | File | Description |
|---|---|---|
| **VDC** | `HA_Speaker_Master.vdc` | Identity filterbank. |
| **IRS** | `HA_Speaker_Master.irs` | 8192 taps, 48 kHz, Float32. |
| **EEL** | `HA_Speaker_Master_BETA.eel` | Post-IRS limiter with optional PEQ. |

> [!WARNING]
> Do not mix the legacy VDC and IRS with the standalone V1.0 EEL script. The standalone script expects a raw input signal and applies its own corrections internally.

---

## Current Architecture (Standalone PEQ)

The current recommendation is to use only `HA_Speaker_Master.eel`. This script combines multi-band EQ with a look-ahead limiter.

### Numerical Evidence

| Metric | Value |
|---|---|
| Raw measurement points | 59 points |
| Target curve points | 701 points |
| Processing | Standalone EEL2 (Liveprog) |
| Host sample rate | 48 kHz |

### Processing Stages

1. **Excursion Guard:** 24 dB/oct high-pass filter to protect the driver from sub-bass frequencies it cannot reproduce.
2. **Parametric EQ:** Cuts the harsh 3 kHz resonance and restores clarity to the 1.5 kHz range.
3. **Look-ahead Limiter:** Prevents clipping and digital distortion at the output stage.

---

## Validation Scope

| Component | Offline Checks | Device/App Test | Listening Test |
|---|---|---|---|
| **VDC (V6)** | `PASS` (identity) | `USER REPORTED` | `USER REPORTED` |
| **IRS (V6)** | `PASS` | `USER REPORTED` | `USER REPORTED` |
| **Standalone EEL (V1.0)** | No recorded test | `NOT RUN` | `NOT RUN` |

**Evidence Boundary.** The V6 chain has physical user reports, but the new standalone V1.0 script has only been source-audited. Always verify the running sample rate is 48 kHz before evaluating.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
