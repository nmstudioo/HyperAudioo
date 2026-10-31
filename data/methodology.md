# HyperAudio · Data Methodology

This document explains how the raw measurement data and the custom target curves in the `data/` directory are processed and aligned.

---

## Overview

The HyperAudio corrections are not fitted to universal standards (like Harman or IEF Neutral). They are fitted to **custom, offline-computed targets** designed specifically for the physical limitations of the target hardware.

The data in this directory serves as the empirical foundation for generating the `.irs` files.

---

## Data Format

Both the raw measurements and the target curves are plain-text `.txt` files containing two columns: `frequency` and `amplitude` (in dB).

| File | Source | Points |
|---|---|---|
| `data/Raw/kz_edx_pro_raw.txt` | 3rd-party measurement database (RikudouGoku) | 695 points |
| `data/Raw/redmi12_speaker_raw.txt` | GSM Arena speaker measurement | 59 points |
| `data/target/kz_edx_pro_target.txt` | Custom target (Harman-inspired) | 701 points |
| `data/target/redmi12_speaker_target.txt` | Custom target (House curve) | 701 points |

---

## Alignment and Normalization

To calculate the correction delta, the raw measurement and the target curve must be aligned onto the exact same frequency grid, and their absolute levels must be normalized.

> [!IMPORTANT]
> **1 kHz Normalization:** Both curves are independently normalized so that their amplitude at exactly 1,000 Hz is `0.0 dB`. This removes any arbitrary volume offset from the measurement rig and ensures the DSP only corrects the tonal shape, not the overall loudness.

### Interpolation
Because the raw measurement (695 points) and the target (701 points) have different frequency spacing, the target curve is interpolated onto the native frequency grid of the raw measurement before the delta is calculated.

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
