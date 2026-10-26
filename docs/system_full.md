# HyperAudio system reference

> **Purpose:** A consolidated, repository-grounded description of the current dual-profile DSP architecture, shipped assets, operating assumptions, validation evidence, and unresolved work.
>
> **Authority:** This document describes the project as it exists in the repository. Historical planning prompts and requested deliverables are not proof that a feature was implemented, tested, or certified.

## 1. Project scope

HyperAudio maintains two device-specific RootlessJamesDSP profile chains:

- **Redmi 12 internal speaker — V6 Speaker profile**
- **KZ EDX Pro wired IEM — v3 IRS with v5 EEL script**

The profiles are independent configurations. Their filter assets, controls, acoustic assumptions, and evidence status must not be mixed.

HyperAudio is not a universal headphone correction, a certified hearing-safety system, or a validated loudspeaker excursion-protection system.

## 2. Current processing architecture

```text
Audio source
    │
    ▼
DDC / VDC  — identity filterbank
    │
    ▼
Convolver / IRS — static tonal correction
    │
    ▼
Liveprog / EEL2 — operational processing
    │
    ▼
Android audio output
```

| Stage | Current responsibility | Explicit boundary |
|---|---|---|
| VDC / DDC | Identity filterbank in both shipped profiles | Does not carry the static tonal EQ |
| IRS convolver | Sole static tonal-correction stage | Both shipped IRS assets are 48 kHz |
| EEL2 Liveprog | Operational processing such as gain, limiting, bypass, and optional effects | Do not duplicate the IRS tonal curve in EEL |

The two VDC files are byte-identical identity payloads with 44.1 kHz and 48 kHz identity banks. The IRS assets are 48 kHz only. See [VDC reference](vdc_functions.md) and [IRS reference](irs_functions.md).

## 3. Device profiles

### 3.1 Redmi 12 internal speaker

| Item | Repository state |
|---|---|
| Profile | Speaker V6, frozen |
| VDC | `Redmi_12/HA_Speaker_Master.vdc` |
| IRS | `Redmi_12/HA_Speaker_Master.irs` |
| EEL | `Redmi_12/HA_Speaker_Master.eel` |
| IRS format | 8192 frames, 48 kHz, float32 stereo, L = R |
| EEL role | Operational core and linked look-ahead sample-peak limiter |

The Speaker IRS numerical report records peak tap 0.950, L1 norm 1.2317, second-half tail energy −82.9 dB for n ≥ 4096, and maximum in-band magnitude −0.07 dB. These are file-level/offline results, not acoustic validation of the phone speaker.

The corrected-source non-finite-input rerun for the Speaker EEL remains **NOT RUN**.

### 3.2 KZ EDX Pro wired IEM

| Item | Repository state |
|---|---|
| Profile | IEM v3 IRS / v5 EEL |
| VDC | `edx_pro/HA_IEM_v3.vdc` |
| IRS | `edx_pro/HA_IEM_v3.irs` |
| EEL | `edx_pro/HA_IEM_v3.eel` |
| Stated nominal impedance | 24 Ω |
| Stated sensitivity | 112 dB/mW |
| IRS format | 2048 frames, 48 kHz, float32 stereo, L = R |
| EEL role | Effects or Limiter-only selection and look-ahead sample-peak limiting |

The IEM IRS numerical report records peak tap 0.4575, L1 norm 1.249987, tail amplitude 1.7e−9 for n ≥ 1024, and maximum in-band magnitude −0.84 dB. Its L1 result is only 0.000013 below the stated 1.25 limit.

The v5 Effects / Limiter-only selector is source-reviewed but its VM regression remains **NOT RUN**. Do not describe the selector as runtime-verified.

The IEM voicing layer is explicitly a design choice; no coupler or in-ear measurement validates it.

## 4. Asset format and integrity

### IRS assets

Both IRS files are RIFF/WAVE, IEEE float32, stereo, 48 kHz, with identical left/right impulse data. The expected interleaved stereo frame layout is L0, R0, L1, R1, and so on. Readers must parse RIFF chunks rather than assume a fixed 44-byte header.

### VDC assets

Each profile VDC contains `SR_44100` and `SR_48000` records. Each bank contains 50 values arranged as ten identity groups of five values: `1.0,0.0,0.0,0.0,0.0`.

### Hashes

The README maintains the current SHA-256 values for the shipped profile assets. Recalculate and update those values only when an asset actually changes and its new content has been verified.

## 5. EEL2 authoring and runtime constraints

The project EEL2 reference is [EEL2 authoring reference](eel_functions.md). Its key constraints include:

- Exact `.eel` extension and a `desc:` first line.
- UI declarations before the first section marker.
- Integer UI steps; use scaled integer values for decimal precision.
- Reassign declared parameters in `@init`.
- Use only observed `@init` and `@sample` section markers for this project.
- Avoid unsafe label characters and accidental section markers in comments.
- Guard sample rate and input values; clamp output according to the script's intended sample-peak ceiling.
- Keep per-sample work bounded and profile CPU on the actual target device.

The conditional-assignment non-finite guard documented in the EEL reference was observed to catch NaN in the tested JamesDSP VM. This is a VM-specific finding, not a universal EEL2 guarantee. Profile-specific retests remain outstanding as noted above.

## 6. Operating guidance

The profile-specific installation and control instructions are authoritative for their respective scripts:

- [Redmi 12 Speaker setup guide](../Redmi_12/Setting_Guide_S.md)
- [KZ EDX Pro IEM setup guide](../edx_pro/Setting_Guide_IEM.md)

**Important configuration distinction:** the Redmi 12 setup guide describes a standalone Liveprog PEQ audition/use configuration. It explicitly replaces the VDC → IRS → limiter chain and must not be combined with that chain. The repository's frozen V6 chain and the standalone PEQ guide are separate operating configurations. Follow the guide that matches the exact script/configuration being used; do not load both correction paths together.

For the IEM, load the identity VDC, the 48 kHz IRS with convolver preamp at 0 dB, and the matching EEL script. Disable duplicate system/player EQ and overlapping sound effects.

Start at low listening volume, particularly with the sensitive IEM. A sample-peak limiter is not a hearing-safety control.

## 7. Validation and evidence

| Evidence state | What it establishes | What it does not establish |
|---|---|---|
| File inspection | Container, payload, hash, and coefficient facts | App acceptance or acoustic result |
| Offline numerical check | The stated calculation passed on the inspected data | Native app or device behaviour |
| Source-built VM | The tested script behaved as observed in that VM | Native ARM or every app version |
| Static parser/regex port | Conditional compatibility with the modelled parser | Live UI parser acceptance |
| User reported | The author reported use on a device | Independent reproduction |
| Listening / acoustic measurement | Only the specific documented listening or measurement setup | General performance beyond that setup |

### Current high-level status

| Area | Status |
|---|---|
| Speaker VDC identity payload | **PASS — file structure/content** |
| IEM VDC identity payload | **PASS — file structure/content** |
| Speaker IRS recorded numerical gates | **PASS — offline/file-level** |
| IEM IRS recorded numerical gates | **PASS — offline/file-level** |
| Speaker EEL corrected-source non-finite rerun | **NOT RUN** |
| IEM EEL v5 mode-selector VM regression | **NOT RUN** |
| Native app parser and convolver qualification | **NOT RUN / CONDITIONAL where noted** |
| Native ARM performance and thermal testing | **NOT RUN** |
| Independent acoustic re-measurement and controlled listening | **NOT RUN** |

The detailed result matrix is maintained in the [test report](test_report.md). Profile-specific results are in the [Speaker report](../Redmi_12/report_Redmi_12.md) and [IEM report](../edx_pro/report_EDX_HA.md).

## 8. Safety and engineering limitations

- **No zero-clipping guarantee:** float32 processing does not prevent clipping at later fixed-point conversion, DAC, amplifier, or transducer stages. Headroom must be measured and managed across the actual chain.
- **No true-peak guarantee:** sample-peak limiting does not guarantee inter-sample peak suppression.
- **No excursion certification:** a high-pass filter or limiter does not certify protection of the Redmi 12 micro-speaker without a validated driver model, excursion limits, amplifier voltage/current data, and target-device measurements.
- **No hearing-safety certification:** listening level, fit, duration, and individual sensitivity remain user-dependent.
- **No HRTF claim:** the IEM Surround 3D feature is crossfeed plus width, not measured or proprietary HRTF virtualisation.
- **No universal compatibility claim:** EEL2 and VDC behaviour may vary by host version and device.
- **No reproducible build claim:** complete IRS generation scripts and source inputs are not included, so the published IRS files cannot be regenerated exactly from this repository alone.

## 9. Open engineering work

1. Re-run Speaker NaN, infinity, large-finite-input, and recovery tests against the corrected shipped EEL source.
2. Run the IEM v5 mode-selector regression in the source-built VM.
3. Verify both scripts in the exact RootlessJamesDSP app build and target Android device.
4. Measure CPU load, thermal behaviour, latency, dropouts, and routing during sustained playback.
5. Perform independent acoustic re-measurement and controlled, level-matched listening.
6. Record Speaker measurement microphone/setup provenance and obtain coupler evidence for the IEM voicing.
7. Reconcile and clearly label the standalone Speaker PEQ guide versus the frozen V6 VDC → IRS → EEL chain.

## 10. Related documentation

- [README](../README.md) — project entry point, profile assets, and checksums.
- [Methodology](methodology.md) — correction design and evidence model.
- [VDC reference](vdc_functions.md) — shipped identity filterbank payloads.
- [IRS reference](irs_functions.md) — impulse-response format and numerical gates.
- [EEL2 reference](eel_functions.md) — Liveprog parser and authoring constraints.
- [Test report](test_report.md) — recorded results and outstanding tests.
- [Attribution](../ATTRIBUTION.md) — third-party sources and licence qualifications.
