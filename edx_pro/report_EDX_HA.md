# HyperAudio · KZ EDX Pro Report

This document provides the technical breakdown and numerical evidence for the KZ EDX Pro IEM correction kit. It outlines the design philosophy, filter configuration, and the boundary between offline verification and physical device validation.

---

## Overview

The IEM chain relies on a three-stage architecture to correct the KZ EDX Pro's V-shaped frequency response. The voicing is a deliberate design choice tailored for a warmer, non-fatiguing presentation, rather than a strict adherence to a flat studio target.

| Component | Target Metric | Verification State |
|---|---|---|
| **Tonal Correction** | Minimum-phase FIR | Numerically validated |
| **Dynamic Safety** | True look-ahead limiter | Source-audited, app testing pending |
| **Voicing** | Warm / Harman-inspired | Subjective design choice |

---

## Numerical Evidence

The correction was derived offline using raw measurement data and custom target curves.

| Metric | Value |
|---|---|
| Raw measurement points | 695 points |
| Target curve points | 701 points |
| IRS Length | 2048 taps |
| Host sample rate | 48 kHz |
| IRS Format | IEEE Float32, Stereo |
| Maximum magnitude error | `< 0.001 dB` (vs synthesis model) |

### Filter Architecture

The IRS applies the tonal correction. The shipped VDC is an identity filterbank.

- **Bass (Low Shelf):** Cut to remove the EDX Pro's native mid-bass bloom.
- **Midrange (Peaks):** Cuts applied at 1.76 kHz and 7.8 kHz to reduce harshness and shoutiness.
- **Presence (Peaks):** Slight boost at 3.1 kHz to restore vocal clarity.
- **Treble (High Shelf):** Cut to tame sibilance without rolling off all "air."

> [!IMPORTANT]
> The IEM voicing is explicitly a design choice. It does not claim mathematical perfection against a universal standard. It aims to correct the specific physical flaws of the EDX Pro driver.

---

## Validation Scope

It is critical to distinguish between offline numerical verification and real-world device validation.

| Component | Offline Checks | Device/App Test | Listening Test |
|---|---|---|---|
| **VDC** | `PASS` (identity) | `USER REPORTED` | `USER REPORTED` |
| **IRS** | `PASS` | `USER REPORTED` | `USER REPORTED` |
| **EEL2 (v5)** | `PASS` (source review) | `PENDING` | `PENDING` |

**Evidence Boundary.** Offline checks use a source-built JamesDSP VM on x86_64. They are not native ARM, RootlessJamesDSP app, target-device or listening tests. "Numerically qualified" does not mean device validated.

---

## Technical Specifications

### EEL2 Limiter
The EEL2 script handles dynamic safety. 
- **Look-ahead:** 1.5 ms.
- **Ceiling:** -0.5 dBFS.
- **Release:** 150 ms.
- **Processing:** O(1) CPU load (no per-sample loops).

> [!WARNING]
> Sample-peak limiting is not true-peak limiting. The limiter prevents digital clipping but does not guarantee physical driver-excursion protection.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
