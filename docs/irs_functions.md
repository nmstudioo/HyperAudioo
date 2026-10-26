# HyperAudio IRS Reference

> Documents the two shipped impulse-response assets and the project's file-level and numerical QA. Offline numerical checks are not native-app, ARM, or device-convolver tests.

## 1. Signal-chain role

`Source → DDC (VDC) → Convolver (IRS) → Liveprog (EEL2) → Output`

The IRS carries all static tonal correction. Both shipped VDCs are identity filterbanks. EEL2 handles operational processing; do not duplicate static EQ in VDC or EEL.

## 2. Shipped assets

| Profile | Repository file | Frames | Rate | Format |
|---|---|---:|---:|---|
| Redmi 12 Speaker V6 | `Redmi_12/HA_Speaker_Master.irs` | 8192 | 48000 Hz | IEEE float32 stereo |
| KZ EDX Pro IEM v3 | `edx_pro/HA_IEM_v3.irs` | 2048 | 48000 Hz | IEEE float32 stereo |

The profile reports record RIFF/WAVE format code 3, two channels, 32 bits/sample, 48 kHz, finite samples, and identical left/right impulse data. Current SHA-256 values are maintained in the README.

For conventional interleaved stereo float32 data, the sample-data payload is 8192 × 2 × 4 = 65,536 bytes for the Speaker and 2048 × 2 × 4 = 16,384 bytes for the IEM. These are data payload sizes, not total file sizes. RIFF permits additional chunks; do not assume a fixed 44-byte header.

## 3. WAV fields

| Field | Expected value |
|---|---:|
| Container | RIFF/WAVE |
| WAVE format code | 3 (IEEE float) |
| Channels | 2 |
| Sample rate | 48000 |
| Bits per sample | 32 |
| Block alignment | 8 bytes/frame |
| Byte rate | 384000 bytes/s |

Stereo samples are interleaved by frame: L0, R0, L1, R1, etc. A robust reader walks RIFF chunks, respects chunk sizes and padding, and locates `fmt ` and `data`; it must not assume sample data begins at byte 44.

## 4. FIR operation and design

For one channel, the FIR operation is:

`y[n] = Σ(k=0…N−1) h[k] x[n−k]`

This defines the mathematical filter, not the native convolver's partition size, FFT strategy, latency, buffering, or implementation limits.

The documented design pipeline is:
1. PCHIP interpolation on a logarithmic frequency axis.
2. Frequency-dependent fractional-octave smoothing.
3. Reference-level selection and correction calculation.
4. Explicit boost/cut caps.
5. Causal minimum-phase reconstruction using a real-cepstrum method.
6. Tail fade and normalisation.
7. Response recalculation from the written/exported samples.

The IEM voicing layer is a design choice, not a coupler-verified correction. The Speaker report says microphone/setup provenance is incomplete.

## 5. Project acceptance gates

| Metric | Limit |
|---|---:|
| Peak absolute tap | ≤ 0.95 |
| L1 norm | ≤ 1.25 |
| Tail metric | ≤ −80 dB, using the profile's stated definition |
| Maximum magnitude, 20 Hz–20 kHz | ≤ 0 dB |
| Realised response | Recalculate from the written file |
| Format | RIFF float32 stereo, 48 kHz, finite samples |

### Reported results

| Metric | Speaker V6 | IEM v3 |
|---|---:|---:|
| Frames | 8192 | 2048 |
| Peak tap | 0.950 | 0.4575 |
| L1 norm | 1.2317 | 1.249987 |
| Maximum magnitude, 20 Hz–20 kHz | −0.07 dB | −0.84 dB |
| Tail result | −82.9 dB energy, n ≥ 4096 | 1.7e−9 amplitude, n ≥ 1024 |
| Realised vs design | Gate reported passed | 0.003 dB max difference |

**Tail metrics are not directly comparable.** The Speaker report gives energy in the second half; the IEM report gives tail amplitude after sample 1024. Do not present them as the same measurement.

The IEM L1 norm is only 0.000013 below the 1.25 limit. It passes the recorded gate but has almost no margin. Any regenerated or edited IEM IRS must be measured again.

## 6. Reproducibility and evidence boundaries

The repository notes that the generation scripts and complete source inputs are absent. The published files can be inspected and tested, but cannot be exactly regenerated from this repository alone.

Offline FIR and chain simulations use a source-built JamesDSP VM on x86_64 plus a NumPy FIR model. This is not equivalent to the native RootlessJamesDSP convolver on Android, ARM execution on the Redmi 12, end-to-end latency measurement, acoustic re-measurement, or level-matched listening. Do not infer universal native convolver tap limits, partition sizes, or latency from these assets.

## 7. Validation workflow for any changed IRS

1. Parse RIFF chunks and verify WAVE, format code 3, stereo, 48 kHz, float32, block alignment 8, and valid data-chunk size.
2. Decode every sample; reject NaN/Inf; verify channel lengths and expected L/R relationship.
3. Calculate SHA-256 and update the README only after approval.
4. Calculate peak tap, L1 norm, and the exact tail metric defined in the report.
5. Calculate frequency response from exported samples; check maximum in-band gain and realised-versus-design error.
6. Test impulse, sine, sweep, and noise with an independent FIR implementation.
7. Load on the target app/device; check routing, latency, CPU, dropouts, and channel integrity.
8. Keep acoustic measurements and listening evidence separate from offline numerical results.

## 8. Common failure modes

- Float samples with an integer-PCM format tag, or the reverse.
- Fixed 44-byte header assumptions.
- Incorrect stereo interleaving or channel lengths.
- NaN/Inf, excessive peak/L1 values, or positive in-band magnitude.
- Tail-window changes that introduce truncation ripple or alter low-frequency response.
- Comparing unlike tail metrics.
- Reporting the design response instead of the response measured from the written file.
- Updating an IRS without updating its hash, profile report, and test report.

## Related documentation

- [Methodology](methodology.md)
- [VDC reference](vdc_functions.md)
- [EEL2 reference](eel_functions)
- [Test report](test_report.md)

**Reference version:** 1.0  
**Last checked against repository assets:** October 2026
