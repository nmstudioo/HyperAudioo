# HyperAudio DSP

DSP correction chains for two specific playback systems, built for
[RootlessJamesDSP](https://github.com/ThePBone/RootlessJamesDSP). Each chain
is a matched pair of correction files (VDC or IRS) plus a residual limiter.

Not a general-purpose EQ preset collection. These are corrections designed
against specific devices, with the numerical work to back the claims.

## Devices

| Device | Chain | Status |
|---|---|---|
| Redmi 12 speaker (MediaTek Helio G88, Android 15) | `redmi_12/` | Complete, frozen |
| KZ EDX Pro IEM (24 Ω, 112 dB/mW) | `edx_pro/` | VDC frozen; IRS numerically qualified; EEL in progress |

## Architecture

```
Source audio
    │
    ├── VDC path      10-biquad IIR correction (48 kHz and 44.1 kHz banks)
    │
    └── IRS path      2048-tap minimum-phase FIR, equivalent to VDC
    │
    └── EEL           Residual limiter (no tonal correction)
    │
Output
```

**VDC and IRS are alternative implementations of the same correction.**
Use one or the other, never both. The two paths are equivalent to within
3 × 10⁻⁶ dB across 8,459 frequency points (measured), so stacking them
double-corrects the signal.

The EEL stage is purely operational — sample-peak limiting, input gain
matching, click-free bypass. It does **not** apply EQ, compression, or
tone shaping, because the residual between the VDC and IRS is numerically
zero.

## Key engineering findings

1. **The IRS reproduces the VDC's transfer function to 3 × 10⁻⁶ dB**
   (Float32, 8,459-point grid: DC, 128 linear points 0.1–20 Hz, 8192 log
   points 20 Hz–20 kHz, 128 linear points 20 kHz–Nyquist, 9 filter centers,
   Nyquist). RMS error 1 × 10⁻⁶ dB. This is measured against the actual
   written file, not the synthesis intermediate.

2. **The VDC is minimum-phase over 20 Hz – 20 kHz.** Phase error between
   the IIR and the minimum-phase FIR is 0.0000 rad across 8192 log-grid
   points; group-delay error is 0.0004 samples maximum. If the VDC had
   mixed-phase behavior (e.g. shelf cuts pushing zeros outside the unit
   circle), these numbers would be large even at perfect magnitude match.
   They are not.

3. **Consequence:** the IIR-vs-FIR A/B on a level-matched pair cannot
   produce an audible phase difference. Any residual difference on device
   traces to the convolver pipeline (FFT partitioning, resampling, denormal
   handling), not to the filter itself.

## Repository structure

```
hyperaudio-dsp/
├── LICENSE                   Points to the two license files
├── LICENSE-MIT               Code (Python, EEL2)
├── LICENSE-CC-BY-SA-4.0      Audio artifacts (.irs, .vdc, reports)
├── ATTRIBUTION.md            AutoEq, Speaker Ranking, RootlessJamesDSP
├── README.md                 This file
│
├── edx_pro/
│   ├── EDX_HA_Warm.vdc               Dual-rate VDC (48 kHz + 44.1 kHz banks)
│   ├── EDX_HA_Warm_48k.irs           IRS, 48 kHz, 2048 taps, stereo Float32
│   ├── EDX_HA_Core_v1.eel            Residual limiter (in progress)
│   ├── generate_irs.py               IRS generator from VDC
│   └── report_EDX_HA_Warm.txt        Numerical report
│
├── redmi_12/
│   ├── Speaker_HA_v6.vdc             Identity DDC (frozen)
│   ├── Speaker_HA_48k_v6.irs         8192-tap FIR (frozen)
│   └── HyperAudio_V6_IRS_Core_v2.eel Transparent post-IRS limiter (frozen)
│
└── docs/
    └── methodology.md                Synthesis, gating, and validation method
```

## How to use

### RootlessJamesDSP setup

1. **Host rate: 48 kHz.** The EDX Pro IRS is 48 kHz only. Verify the
   actual running rate in Rootless's settings, not just the configured
   rate — Android can negotiate different rates on different outputs.

2. **Choose one correction path**:
   - **VDC path** — load `EDX_HA_Warm.vdc` as DDC. Bypass the convolver.
   - **IRS path** — load `EDX_HA_Warm_48k.irs` in the convolver. Bypass DDC.
     Set the convolver's preamp to **0 dB** — the −2.7 dB preamp is baked
     into the FIR.

3. **EEL** — load `EDX_HA_Core_v1.eel` as a separate module if you want
   peak protection. Default is −1.5 dBFS ceiling, 0 dB input gain. This
   is a sample-peak limiter, not a hearing-safety device.

4. **Disable any other EQ, bass boost, or system audio processing**
   (Android sound settings, OEM audio apps) before A/B testing.

### Redmi 12

The three files in `redmi_12/` are used together (VDC + IRS + EEL).
Unlike the EDX Pro chain, they are designed to stack:

- `Speaker_HA_v6.vdc` — identity DDC (placeholder; does no correction)
- `Speaker_HA_48k_v6.irs` — the actual correction
- `HyperAudio_V6_IRS_Core_v2.eel` — post-IRS transparent limiter

## Validation state

Honest accounting of what has and has not been verified:

| Component | Numerical | Device listening | SHA frozen |
|---|---|---|---|
| Redmi 12 VDC | — | Yes | Yes |
| Redmi 12 IRS | — | Yes | Yes |
| Redmi 12 EEL | — | Yes | Yes |
| EDX Pro VDC (48 kHz) | Coefficient audit | Yes | Yes |
| EDX Pro VDC (44.1 kHz) | Not independently audited | No | Yes |
| EDX Pro IRS | Yes (3e-6 dB, all gates) | **No** | Yes |
| EDX Pro EEL v1 | In progress | No | No |

"Numerically qualified" means the file has been verified against a
reference within a defined tolerance. It does **not** mean the file has
been tested on device, and it does **not** mean a subjective comparison
has been done.

## Building from source

### IRS generator

```bash
cd edx_pro/
python3 generate_irs.py
```

Requires `EDX_HA_Warm.vdc` in the same directory. In measurement mode
(`MAG_TOL_DB=None`), the generator writes the `.irs` and a numerical
report if all structural gates pass, but does not apply a magnitude
acceptance threshold. Set `MAG_TOL_DB = 0.001` to require the magnitude
gate.

### EEL2 scripts

No build step. Load `.eel` files directly in RootlessJamesDSP. EEL2 is
interpreted at runtime by the James34602 VM.

## SHA-256 manifest

```
edx_pro/EDX_HA_Warm.vdc
    a144b7b54d3c15e91372abb1302556200e0124d4c486d990532d845544fcab4f

edx_pro/EDX_HA_Warm_48k.irs
    ee242fdc83194064382668cc7575121b3275a952f60045cafb411d074d73070b
```

Verify against downloaded files with `sha256sum`.

## Known limitations

- **EDX Pro IRS has not been device-tested.** The numerical match to the
  VDC is exceptionally tight, but convolver implementation, FFT partitioning,
  resampling, gain handling, and latency on device are unverified.
- **EDX Pro IRS is 48 kHz only.** At any other host rate the filter is
  wrong (stretched or shortened).
- **EDX Pro EEL bypass is delayed by 1 ms** (48 samples at 48 kHz). Both
  paths share the same delay so the crossfade is comb-free, but null tests
  must delay-compensate.
- **The "fast decay" question is unresolved.** The VDC impulse response
  decays faster than a naive pole-radius calculation predicts (0.0002%
  residual energy at tap 256 vs. ~0.04% predicted). The FIR matches the
  VDC's actual behavior regardless, but the discrepancy has not been
  explained.

## License

Split licensing:

- **Code** (`.py`, `.eel`) — [MIT](LICENSE-MIT)
- **Audio artifacts** (`.irs`, `.vdc`, reports) — [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0)

In short: use the scripts however you want, keep the derived correction
files open if you redistribute them.

## Credits

See [ATTRIBUTION.md](ATTRIBUTION.md) for required third-party notices.
Designs are derived from AutoEq-format presets (jaakkopasanen/AutoEq, MIT)
sourced from RikudouGoku's measurement database, with corroboration from
Speaker Ranking's aggregate presets. EEL2 scripts target the VM in
RootlessJamesDSP (ThePBone/RootlessJamesDSP, Apache 2.0). No third-party
code or raw measurements are redistributed here.
