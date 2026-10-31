# HyperAudio · VDC Reference

This document defines the Viper DDC (Digital Direct Correction) format, its constraints, and how it is implemented within the HyperAudio repository. 

---

## Overview

A Viper DDC file (`.vdc`) is a plain-text configuration containing IIR (Infinite Impulse Response) biquad coefficients. It is processed by the DDC engine in RootlessJamesDSP. 

Within HyperAudio, the shipped VDC files (`HA_IEM_v3.vdc` and `HA_Speaker_Master.vdc`) are **identity filterbanks**. They do not apply tonal correction. They exist to maintain a consistent three-stage architecture.

---

## File Format Constraints

The Viper DDC parser is strictly formatted. A single formatting error will cause the engine to reject the file and output silence.

| Constraint | Rule |
|---|---|
| **Line Count** | Exactly two lines: `SR_48000:` and `SR_44100:`. |
| **Values per Line** | Exactly 50 comma-separated values. |
| **Structure** | 10 blocks of 5 coefficients (`b0`, `b1`, `b2`, `a1`, `a2`). |
| **Preamp** | There is NO dedicated preamp slot. |
| **Line Endings** | UNIX `\n` (LF) only. Windows `\r\n` (CRLF) will cause failure. |
| **Encoding** | UTF-8 without BOM. |

> [!WARNING]
> **The 51-Value Trap:** Standard AutoEq `.txt` files often include a preamp value on the first line (making 51 values). If you copy an AutoEq file directly into a `.vdc`, the parser will shift every coefficient by one slot, resulting in unstable feedback and silence.

---

## Applying a Preamp

Because the DDC format lacks a dedicated preamp slot, any overall gain reduction (to prevent clipping from positive EQ boosts) must be mathematically folded into the first filter block.

If the preamp is `-3.0 dB` (linear `0.7079`), you multiply the `b0`, `b1`, and `b2` coefficients of the **first filter only** by `0.7079`.

---

## Sign Inversion Convention

The Viper DDC engine uses the following recurrence relation:

`y[n] = b0*x[n] + b1*x[n-1] + b2*x[n-2] - a1*y[n-1] - a2*y[n-2]`

Standard RBJ cookbook filters use:

`y[n] = b0*x[n] + b1*x[n-1] + b2*x[n-2] + a1*y[n-1] + a2*y[n-2]`

> [!IMPORTANT]
> Because the Viper engine subtracts the feedback terms, the standard RBJ `a1` and `a2` coefficients must have their signs **inverted** before being written to the `.vdc` file.

---

## Identity Filterbank Structure

An identity filter passes the signal unchanged. Its coefficients are `b0=1`, `b1=0`, `b2=0`, `a1=0`, `a2=0`.

A full 50-value identity line looks like this:

```text
SR_48000:1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000
```

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
