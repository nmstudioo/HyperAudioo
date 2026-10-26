[HARDWARE SPECS & ENVIRONMENT]
Speaker: Xiaomi Redmi 12 built-in mono speaker features a single bottom-firing transducer in a small acoustic chamber that struggles with voltage constraints and lacks mechanical excursion depth.
IEM: KZ EDX Pro (Single 10mm Dual-Magnetic Circuit Dynamic Driver)
Impedance: 24 Ohms
Sensitivity: 112dB/mW
Acoustic Signature: Heavy V-shaped tuning with a muddy mid-bass bump, severe upper-mid recessed vocal dip, and two sharp, piercing sibilance treble peaks at ~4.5kHz and ~8kHz.
Source: Direct 3.5mm smartphone headphone jack (high noise floor, low power control).
Equalizer App: RootlessViPER4Android - https://github.com/alienware377/RootlessViPER4Android

[ROOTLESSJAMESDSPVIPER4ANDROID CORE FUNCTION TREE]
ROOTLESS VIPER4ANDROID (MASTER FUNCTIONAL TREE)
├── [01] SYSTEM & CORE ENGINE SETTINGS
│    ├── Audio encoding (32-bit float PCM processing precision)
│    ├── Buffer size (Processing block size / latency management)
│    ├── Convolver module optimizations (CPU math acceleration)
│    └── Refresh benchmarking data (Hardware profiling routine)
│
├── [02] HARDWARE GATEWAY & OUTPUT CONTROLS
│    ├── Output gain (Master preamp ceiling / clipping protection)
│    ├── Pan (Left/Right channel volume bias correction)
│    └── Reverse stereo (Instant physical pin/channel inversion)
│
├── [03] TONAL BALANCING & EQUALIZATION (EQ)
│    ├── Arbitrary response equalizer (Node graphic mapping / AutoEQ import)
│    ├── Parametric equalizer (Precision frequency targeting: Center/Gain/Q)
│    ├── Dynamic EQ (Volume-scaled automated frequency curves)
│    ├── FIR equalizer (Linear-phase tone shaping with zero time smear)
│    └── ViPER-DDC (Hardware calibration database profile modeling)
│
├── [04] DYNAMICS & LOUDNESS CONTROL
│    ├── Auto-loudness / Multiband compressor (Multi-zone dynamics balancing)
│    ├── Maximizer (Peak-expansion / aggressive ceiling booster)
│    ├── Playback gain control / AGC (Global track volume normalization)
│    └── FET compressor (Fast peak capture modeling for punch & glue)
│
├── [05] LOW-FREQUENCY (BASS) MANAGEMENT
│    ├── Dynamic bass boost (Contextual volume-scaled low-end weight)
│    ├── Bass exciter / Psychoacoustic bass (Harmonic sub-bass simulation)
│    ├── Low end (Sub-100Hz shelf tone foundation tool)
│    ├── Dynamic system / ViPER dynamic bass (Physical speaker excursion emu)
│    └── ViPER bass (Legacy standalone low-end punch optimization)
│
├── [06] HARMONIC TEXTURING & VINTAGE EMULATION
│    ├── Multiband distortion (Frequency-isolated saturation & clipping)
│    ├── Exciter (Upper harmonic synthesis for air and sparkle)
│    ├── Spectrum extension / Treble exciter (Lossy MP3 compressed file restoration)
│    ├── Vintage tape (Reel-to-reel saturation and tape compression emulation)
│    ├── Vintage vinyl (Phono turntable cartridge tracking emulation)
│    └── Tube simulator / 6N1J (Even-harmonic vacuum tube warmth modeling)
│
├── [07] SOUNDSTAGE, SPATIALIZATION & SURROUND
│    ├── Soundstage wideness (Horizontal geometric boundary extension)
│    ├── Crossfeed (Time-delayed channel bleed for monitor simulation)
│    ├── Virtual room effect (Early reflection geometric room placement)
│    ├── Stereo imaging / Per band (Frequency-isolated multi-width panning)
│    ├── Field surround (3D multi-directional ambient matrixing)
│    ├── Differential surround (Microsecond phase-shift staging illusion)
│    └── Headphone surround + (HRTF-modeled multi-speaker studio array)
│
└── [08] UTILITARIAN CLEARING, BIOMETRICS & HARDWARE OPTIMIZATION
     ├── Live programmable DSP (EEL2 compilation real-time script sandbox)
     ├── Pitch shifter (Real-time musical key transposition)
     ├── Echo / delay (Time-based audio cloning and decay patterns)
     ├── Balance (Precise left/right driver level matching)
     ├── Reverberation (Complex atmospheric space environment simulation)
     ├── ViPER clarity (Upper-mid crispness / vocal definition management)
     ├── Auditory system protection / Cure+ (High-frequency transient pressure dampening)
     └── Speaker optimization (Physical internal phone speaker safety and clarity tuning)


[ROOTLESSJAMESDSPVIPER4ANDROID CORE FUNCTIONS BRECKDOWN]
## System Audio Processing Settings
These settings control the core digital signal engine, buffer size, and mathematical processing precision of RootlessJamesDSP before it renders any audio effects.

* Audio encoding: Sets the bit-depth precision for internal calculations. The app uses 32-bit float PCM, providing an incredibly high dynamic range so that heavy equalizer and effect modifications don't cause digital clipping or loss of audio detail.
* Buffer size: Controls the size of the audio data packets processed at one time (currently set to 8064 samples). A larger buffer size stops audio stuttering and minimizes CPU strain on HyperOS 2, though it slightly increases processing delay (latency).
* Convolver module optimizations: An optimization toggle that forces the app to benchmark its mathematical calculations. It significantly boosts performance and reduces battery drain when running heavy impulse response (.wav) profiles inside the Convolver engine.
* Refresh benchmarking data: A utility command that clears out old performance tests and re-runs system speed diagnostics to align the Convolver optimization code perfectly with your device's current processing load.

## 0. Output Control Settings
These options sit at the absolute end of the audio pipeline to handle final volume trim, balance, and spatial correction.

* Output gain: Adjusts the global volume multiplier for all processed audio leaving the app. It acts as a master preamp control, allowing you to lower the signal level to prevent clipping if heavy EQ adjustments make the music too loud.
* Pan: Controls the direct horizontal positioning of the sound field. It allows you to shift the entire audio mix left or right to correct hardware variances or hearing differences.
* Reverse stereo: Instantly swaps the left and right audio channels. It routes the left audio track to the right earpiece and vice versa, allowing you to fix backward cable wiring without physically swapping your IEM leads.


## 1. Auto-loudness (multiband compressor)

* 
* What it does: An intelligent dynamics processor that separates your audio into separate frequency bands and compresses them individually. [3, 4] 
* How it does it: It monitors volume levels across the bands in real-time, pulling up quiet elements and clamping down on overly loud spikes to deliver a balanced volume. [2, 5] 
* 

## 2. Dynamic bass boost

* 
* What it does: Provides adaptive low-frequency amplification that scales contextually with the track.
* How it does it: Instead of applying a static EQ boost, it calculates the current volume level and adds bass weight when the track is quiet or demanding, preventing low-end distortion at maximum volumes. [3, 5] 
* 

## 3. Bass exciter (psychoacoustic bass)

* 
* What it does: Generates sub-bass perception through psychoacoustic principles rather than forcing pure physical driver extension.
* How it does it: It synthesizes specific harmonic frequencies that trick your brain into perceiving deeper, cleaner low-end sub-bass rumble. [2, 4] 
* 

## 4. Soundstage wideness

* 
* What it does: Artificially widens the perceived left-to-right boundaries of your stereo field.
* How it does it: It manipulates the phase and panning layout of peripheral audio elements to push the sound out past your physical ears. [2, 3] 
* 

## 5. Crossfeed
- Presets (BS2B Weak/BS2B Strong/Out of Head/Surrounded 1/Surrounded 2/Joe0Bloggs Realistic Surrounded)

* 
* What it does: Blends a tiny percentage of the left and right audio channels into one another.
* How it does it: By bleeding channels with a microscopic time-delay, it mimics how natural acoustic waves hit a human skull from physical room speakers, reducing ear fatigue. [3, 5] 
* 

## 6. Virtual room effect

* 
* What it does: Simulates spatial reflections to position the audio inside an artificial listening space.
* How it does it: It generates precise early room reflections, tricking your ears into feeling like the performance is moving in a room in front of you instead of directly inside your head. [5, 6] 
* 

## 7. Arbitrary response equalizer
- Linear Phrase (on/off)
- Auto EQ
- Band by Band edit
- Edit as a whole

* 
* What it does: A highly versatile graphic equalizer that allows you to draw or import unique, custom EQ shapes.
* How it does it: It lets you plot irregular frequency points natively or import AutoEQ database profiles to seamlessly correct your IEM's tuning. [5, 6] 
* 

## 8. Parametric equalizer
- Linear Phrase (on/off)
- Can be added manually, import, edit as string

* 
* What it does: A precision, professional audio-grading filter system.
* How it does it: It lets you control explicit Center Frequencies, precise decibel Gains, and Q-factors (how narrow or wide the filter curve is) to pinpoint and neutralize audio defects. [1] 
* 

## 9. Live programmable DSP

* 
* What it does: An advanced scripting sandbox that lets you build your own custom real-time audio effects.
* How it does it: It processes raw audio using written code scripts (via the EEL2 programming engine), allowing users to compile bespoke signal-processing rules. [1, 2, 6] 
* 

## 10. Pitch shifter

* 
* What it does: Transposes or adjusts the musical key of your media playback natively in real-time.
* How it does it: It shifts the digital frequency blocks of the stream up or down to alter pitch without changing the actual tempo or speed of the audio file.
* 

## 11. Echo / delay

* 
* What it does: A traditional time-based processor that creates a distinct repeating echo pattern.
* How it does it: It clones the digital audio stream and plays it back a split-second later at user-configured time intervals and decaying volumes. [7] 
* 

## 12. Multiband distortion

* 
* What it does: Adds saturation or clipping artifacts across specific frequency boundaries.
* How it does it: It segments the signal into independent bands and applies controlled clipping to add gritty textures or warm harmonic structures to those specific sectors. [4] 
* 

## 13. Maximizer

* 
* What it does: Functions as an aggressive volume limiter and peak-extension tool.
* How it does it: It amplifies the quieter floor of an audio signal up to its absolute ceiling while applying brickwall limiting to prevent digital clipping. [4] 
* 

## 14. Dynamic EQ

* 
* What it does: An equalization curve that fluidly adapts to how loudly or quietly music is playing.
* How it does it: It uses dynamic threshold tracking to boost certain ranges (like bass and treble) when the volume is low, and flatten them when the track gets loud. [4] 
* 

## 15. Stereo imaging (per band)

* 
* What it does: Offers spatial separation adjustments mapped independently across individual audio bands.
* How it does it: It adjusts phase and mid/side balances so you can keep elements like sub-bass tightly centered while throwing instruments and treble wide. [4] 
* 

## 16. Impact (attack & sustain)

* 
* What it does: Controls the transient "snappiness" and decay of notes.
* How it does it: It reshapes the envelope of the signal, accentuating the initial attack (like a drum strike) and trimming or stretching the sustaining ring.
* 

## 17. Low end

* 
* What it does: Acts as a specialized tone-control element focused exclusively on the deepest sub-bass foundations.
* How it does it: It shelf-filters the sub-100Hz audio spectrum to add physical, weighted foundation without bleeding upward into the mid frequencies. [4] 
* 

## 18. Exciter

* 
* What it does: Synthesizes higher harmonics to restore life to dark or dull recordings.
* How it does it: It analyzes existing mid/high information and generates faint, calculated upper harmonic overtones to introduce fresh air and sparkle. [2] 
* 

## 19. Vintage tape

* 
* What it does: Emulates the distinct vintage sound profile of magnetic reel-to-reel analog tape systems.
* How it does it: It injects mild, soft-clipping tape saturation, slight high-frequency roll-off, and subtle compression artifacts to make digital audio sound warm and analog. [2, 3, 5] 
* 

## 20. Vintage vinyl

* 
* What it does: Replicates the distinct playback character of old vinyl record turntable setups.
* How it does it: It reshapes the tone and dynamics while adding subtle harmonic distortion characteristic of physical phono cartridges tracking a groove.
* 

## 21. Balance

* 
* What it does: A utility tool that manages the volume distribution between your left and right audio channels.
* How it does it: It scales the output gain of each channel independently, helping to fix internal driver imbalances or personal hearing inequalities. [4] 
* 

## 22. Playback gain control (AGC)

* 
* What it does: An Automatic Gain Control module that normalizes your music library’s absolute volume.
* How it does it: It analyzes continuous track volume on the fly, immediately dropping excessively loud audio files and raising quiet ones to ensure consistent volume. [2, 4, 7] 
* 

## 23. FET compressor

* 
* What it does: Models a physical Field-Effect Transistor studio hardware compressor.
* How it does it: It uses ultra-fast peak capture times to clamp down on loud spikes, adding punch and blending instruments together cleanly. [2, 4] 
* 

## 24. ViPER-DDC

* 
* What it does: Digital Distortion Correction that uses explicit hardware calibration parameters.
* How it does it: It loads pre-compiled correction profiles created for specific earphone models to electronically smooth out their built-in acoustic flaws. [3, 4, 8] 
* 

## 25. Spectrum extension (treble exciter)

* 
* What it does: Restores ultra-high frequency data stripped during compression.
* How it does it: It calculates the mathematical roll-off of lossy audio tracks (like MP3s) and synthetically generates detail in the higher spectral zones to restore clarity. [1, 2, 9, 10] 
* 

## 26. FIR equalizer
- Filter Type ( FIR Minimum Phrase/ IIR 4th Order/ IIR 6th Order/ IIR 8th Order/ IIR 10th Order/ IIR 12th Order)
- Interpolator (Piecewise Cubic Hermite Interpolating Polynominal/ Modified Hirosi Akima Spline)

* 
* What it does: A Finite Impulse Response phase-linear digital equalizer.
* How it does it: It adjusts frequency distributions using high-precision digital math filters, shaping tone with zero timing anomalies or phase smear. [3, 5, 8] 
* 

## 27. Convolver

* 
* What it does: Processes your entire audio stream through a loaded mathematical acoustic blueprint (.wav files).
* How it does it: It applies Impulse Responses to your signal, allowing you to emulate high-end tube amps, pristine listening rooms, or an exact inverse curve to cancel out HyperOS 2 firmware processing. [3, 4] 
* 

## 28. Field surround

* 
* What it does: Creates an immersive, multi-directional 3D ambient surround field.
* How it does it: It blends phase-shifted matrixing with ambient acoustic reflections to position sound components around you rather than in flat stereo. [1, 2, 9] 
* 

## 29. Differential surround

* 
* What it does: Expands horizontal sound boundaries by altering left-and-right phase alignments.
* How it does it: It introduces a microsecond time delay to one side (e.g., delaying the right ear by 2ms), instantly creating an ultra-wide soundstage illusion. [4, 7, 9] 
* 

## 30. Headphone surround +

* 
* What it does: An advanced audio virtualization engine designed exclusively for headphone listening.
* How it does it: It applies custom head-related transfer function filters to standard stereo recordings, simulating a multi-speaker studio room configuration. [2, 4] 
* 

## 31. Reverberation

* 
* What it does: Re-creates the atmospheric sound reflections of environmental spaces.
* How it does it: It calculates and adds room decay, dampening values, and room sizes to make audio sound like it is playing inside a studio, a hall, or a massive cathedral. [2, 4, 7] 
* 

## 32. Dynamic system (ViPER dynamic bass)

* 
* What it does: Emulates low-frequency behavioral expansion modeled off physical speaker responses.
* How it does it: It tracks dynamic changes in current track playback and alters bass characteristics to mimic how large physical dynamic subwoofers fill a room. [1, 4, 7] 
* 

## 33. Tube simulator (6N1J)

* 
* What it does: Electronically replicates the specific musical behavior of an analog 6N1J vacuum tube amplifier.
* How it does it: It intentionally adds warm, soft second-order harmonic distortion to the audio stream, softening cold, harsh digital edges and giving vocals a rich analog texture. [1, 2] 
* 

## 34. ViPER bass

* 
* What it does: A legacy low-frequency optimization engine.
* How it does it: It uses specialized algorithms (like Pure Bass+ or Subwoofer mode) to adjust low frequencies directly without altering the volume of mid-range vocals. [1, 4, 9] 
* 

## 35. ViPER clarity
- Mode option: Natural/Ozone+/XHiFi
- Clarity Gain: 0dB

* 
* What it does: A high-end mid-range and treble balancing processor.
* How it does it: It intelligently manages upper frequencies using algorithms like OZone+ or XHiFi to ensure clean separation between instruments and crisp vocal presence without introducing piercing harshness. [1, 4, 9] 
* 

## 36. Auditory system protection (Cure+)
- Cure Level: Slight/Moderate/Strong

* 
* What it does: A safety feature designed to prevent ear fatigue during long listening sessions.
* How it does it: It filters out hidden, fatiguing high-frequency pressure peaks and sharp transient volume spikes before they reach your ears. [2, 9] 
* 

## 37. Speaker optimization
- Strength: 0%

* 
* What it does: A dedicated calibration module built specifically for your phone's internal speakers.
* How it does it: It tunes the audio output to clean up frequencies, expand soundstage, and prevent distortion when listening out loud without headphones. [2, 9] 
* 

Act as a Principal Electroacoustic Engineer and Audio DSP Developer.

We are building a production-grade dual-profile tuning calibration for RootlessViPER4Android (package: me.timschneeberger.rootlessjamesdsp) running on a Xiaomi Redmi 12 (Android 15 / HyperOS 2, fs = 48000 Hz).

---

### SYSTEM SPECIFICATIONS & RAW MEASUREMENT DATA

#### TRANSDUCER A: KZ EDX Pro IEM (3.5mm Jack)
- Impedance: 24 Ω
- Sensitivity: 112 dB/mW
- Source Output Impedance: Rout ≈ 2.0 Ω (Redmi 12 3.5mm jack)
- Damping Factor: ~12 (Flat dynamic driver load, impedance skew < 0.35 dB)

Raw 711 Coupler Frequency Response Data [Frequency (Hz), Raw Level (dB)]:
[20.00, 13.99], [22.09, 13.91], [24.40, 13.85], [26.96, 13.72], [29.78, 13.57],
[32.89, 13.38], [36.33, 13.16], [40.14, 12.90], [44.33, 12.64], [48.97, 12.34],
[54.10, 11.98], [59.76, 11.57], [66.01, 11.11], [72.91, 10.63], [80.54, 10.13],
[88.97, 9.59],  [98.28, 9.00],  [108.56, 8.38], [119.92, 7.78], [132.46, 7.11],
[146.32, 6.37], [161.63, 5.75], [178.54, 5.31], [197.22, 4.70], [217.85, 4.02],
[240.64, 3.40], [265.82, 2.81], [293.63, 2.22], [324.35, 1.63], [358.28, 1.06],
[395.77, 0.60], [437.18, 0.16], [482.91, -0.23],[533.44, -0.58],[589.25, -0.86],
[650.89, -1.00],[718.99, -1.02],[794.22, -1.21],[877.31, -0.80],[969.09, -0.23],
[1070.48, 0.58],[1182.48, 1.50],[1306.19, 2.50],[1442.85, 3.70],[1593.80, 5.27],
[1760.55, 7.17],[1944.74, 9.17],[2148.20, 10.94],[2303.17, 11.39],[2544.13, 10.46],
[2810.30, 8.71],[3104.32, 7.28],[3429.10, 6.54],[3787.86, 6.71],[4184.15, 7.96],
[4621.91, 10.66],[5054.91, 12.64],[5528.49, 9.84],[6046.42, 7.30],[6612.88, 5.40],
[7232.41, 6.05],[7909.98, 10.63],[8651.03, 5.12],[9461.51, -1.15],[10347.91, -2.35],
[11317.36, 4.29],[12013.60, 8.04],[13139.10, -3.27],[14370.04, -3.38],[15716.30, 2.46],
[17188.69, -1.45],[18799.02, -10.94],[20000.00, -13.92]

#### TRANSDUCER B: Redmi 12 Internal Loudspeaker
Raw Frequency Response Data [Frequency (Hz), Raw Level (dB)]:
[27.26, -30.41], [44.35, -29.80], [65.57, -21.60], [91.62, -13.51], [123.12, -12.38],
[160.75, -10.80], [205.16, -7.13], [257.07, -5.69], [317.17, -8.13], [386.19, -11.85],
[464.86, -17.92], [553.93, -17.40], [654.13, -11.00], [766.21, -2.05], [890.88, 1.02],
[1028.86, 3.05], [1180.84, 4.47], [1347.49, 7.08], [1529.42, 8.11], [1727.23, 8.73],
[1941.47, 11.54], [2172.62, 13.03], [2421.12, 11.37], [2687.33, 5.71], [2971.55, 8.83],
[3274.01, 15.83], [3594.84, 12.08], [3934.11, 5.31], [4291.77, 5.91], [4667.69, 7.94],
[5061.66, 9.62], [5473.35, 12.24], [5902.32, 12.65], [6348.04, 11.35], [6809.87, 11.10],
[7287.07, 11.80], [7778.78, 12.34], [8284.06, 11.88], [8801.83, 12.88], [9330.94, 14.67],
[9870.15, 14.64], [10418.10, 12.67], [10973.30, 10.39], [11534.40, 9.46], [12099.60, 9.41],
[12667.30, 8.38], [13235.90, 5.82], [13803.40, 2.14], [14368.20, -2.13], [14928.30, -6.11],
[15481.80, -8.87], [16026.80, -10.88], [16561.40, -13.13], [17083.70, -15.35], [17591.80, -17.10],
[18083.70, -18.38], [18557.80, -19.49], [19012.00, -20.41], [19444.80, -21.10], [19854.40, -21.51]

---

### REQUIRED RESPONSE OUTPUT

#### PART 1: Architecture State Map
Provide the complete 42-function engine configuration matrix for both Transducer A (IEM) and Transducer B (Speaker).

#### PART 2: Transducer A (KZ EDX Pro) Parametric Equalizer Matrix
1. Calculate and list the exact 9-band Parametric EQ settings (Filter Type, Fc in Hz, Gain in dB, Q factor) required to map the raw response to the target curve.
2. Specify the exact digital Preamp gain required for zero 32-bit floating-point clipping.
3. Compute the full Biquad Coefficient Set ($b_0, b_1, b_2, a_1, a_2$) for each filter using Robert Bristow-Johnson (RBJ) cookbook formulas at $f_s = 48000\text{ Hz}$.

#### PART 3: Transducer B (Redmi 12 Speaker) Parametric Equalizer Matrix
1. Calculate and list the exact Parametric EQ settings required for the speaker correction (including high-pass cutoff protection at ~220 Hz and treble smoothing).
2. Specify the exact digital Preamp gain required for speaker headroom.
3. Compute the full Biquad Coefficient Set ($b_0, b_1, b_2, a_1, a_2$) for each filter at $f_s = 48000\text{ Hz}$.

Act as a Principal Electroacoustic Engineer and Senior Audio DSP Developer.

We are executing SEQUENCE 3 (Production Code Generation & Deployment Deliverables) for RootlessViPER4Android (package: me.timschneeberger.rootlessjamesdsp) on the Xiaomi Redmi 12 (fs = 48000 Hz).

Base your code and DSP configurations strictly on the architectural state maps and RBJ Biquad parametric EQ matrices generated in Sequences 1 & 2 for both Transducer A (KZ EDX Pro IEM) and Transducer B (Redmi 12 Speaker).

---

### REQUIRED PRODUCTION DELIVERABLES

#### 1. GRAPHICEQ TEXT STRINGS (127-Point Interpolated)
Provide the full, production-ready `GraphicEQ:` configuration strings formatted for direct import into JamesDSP / RootlessViPER4Android for both transducers:
- **Transducer A (KZ EDX Pro):** 127-point logarithmic frequency vector ($20\text{ Hz} - 20000\text{ Hz}$) matching the target target profile.
- **Transducer B (Redmi 12 Speaker):** 127-point logarithmic frequency vector ($20\text{ Hz} - 20000\text{ Hz}$) incorporating high-pass protection below $200\text{ Hz}$ and peak correction.

#### 2. TRANSPOSED DIRECT FORM II EEL2 DSP SCRIPTS (.eel)
Provide two complete, fully commented, production-grade EEL2 scripts (`.eel`) for JamesDSP's custom DSP engine:
- Implement a 9-band (IEM) and multi-band (Speaker) Transposed Direct Form II biquad structure.
- Hardcode the exact RBJ filter coefficients ($b_0, b_1, b_2, a_1, a_2$) derived in Sequence 2.
- Include explicit sample state variables (`x1`, `x2`, `y1`, `y2`) per channel to guarantee 100% numerical stability without state leakage.
- Include static pre-gain scaling at the top of the `@sample` processing block for zero-clipping guarantee under 32-bit float.

#### 3. MINIMUM-PHASE IMPULSE RESPONSE GENERATOR (.py)
Provide a standalone, executable Python script using `scipy.signal` and `struct` that:
- Synthesizes the exact combined frequency response of both profiles.
- Performs cepstral minimum-phase reconstruction.
- Applies a 128-sample Hanning tail window to eliminate truncation ripple.
- Exports two 32-bit floating-point stereo `.wav` impulse response files at $48000\text{ Hz}$ (`KZ_EDX_Pro_Impulse_48k.wav` and `Redmi12_Speaker_Impulse_48k.wav`).

#### 4. DEPLOYMENT & ROUTING DIRECTIVE
Provide step-by-step instructions for loading these files into RootlessViPER4Android, setting preset auto-switching based on output device (3.5mm Headphone Jack vs. Internal Speaker), and verifying gain staging.

Act as a Principal Audio DSP Engineer and Quality Assurance Lead.

We are executing SEQUENCE 4 (DSP Verification, Phase Integrity, and Numerical Stability Check) for the production code and FIR/IIR configurations generated in Sequence 3 for RootlessViPER4Android running on the Xiaomi Redmi 12 (fs = 48000 Hz).

---

### VERIFICATION & QA AUDIT TASKS

#### 1. EEL2 CODE STRUCTURE & NUMERICAL STABILITY AUDIT
- Review the Transposed Direct Form II implementation in both EEL2 scripts (`.eel`).
- Verify that state variables (`s1_L`, `s2_L`, `s1_R`, `s2_R` or equivalent) are correctly isolated per channel and reset/initialized properly to prevent denormal numbers, DC offset accumulation, or filter instability.
- Confirm that coefficient normalization ($a_0 = 1.0$) was executed correctly during biquad generation and that no coefficient sign flips exist in the loop subtraction/addition steps.

#### 2. HEADROOM & CLIPPING MARGIN ANALYSIS
- Perform an absolute peak-sum evaluation across all boost bands for both profiles:
  - **Transducer A (KZ EDX Pro):** Evaluate maximum cumulative gain at peak resonance points ($3.33\text{ kHz}$ and $9.65\text{ kHz}$). Verify if the assigned static preamp offset guarantees 0 dBFS peak output under full-scale 0 dBFS input.
  - **Transducer B (Redmi 12 Speaker):** Evaluate high-pass filter phase overshoot and peak correction gains. Confirm that the preamp prevents inter-sample peaks (ISP) and hardware driver saturation.

#### 3. IMPULSE RESPONSE (FIR) INTEGRITY CHECK
- Verify the Python FIR generator logic:
  - Ensure the 128-sample Hanning tail window correctly brings boundary values to absolute zero without altering the low-frequency magnitude response.
  - Confirm the WAV header formatting (IEEE Float, 32-bit, 48000 Hz stereo) matches the raw byte structure required by JamesDSP / ViPER4Android convolution engines.

#### 4. DEPLOYMENT CHECKLIST & FINAL APPROVAL
- Output a structured "DSP System Readiness Matrix" covering:
  - Coefficient Precision (32-bit Float match)
  - Denormal Protection Status
  - Zero-Clipping Headroom Verification
  - Android 15 / HyperOS 2 Compatibility
- Print the final authorization line: **"SEQUENCE 4 COMPLETE — DSP Engine Certified for Deployment"**.


Act as a Mobile Systems Integration Engineer and Android DSP Field Specialist.

We are executing SEQUENCE 5 (Production Deployment, Storage Structuring, and Hot-Switching Setup) for RootlessViPER4Android (package: me.timschneeberger.rootlessjamesdsp) on the Xiaomi Redmi 12 (Android 15 / HyperOS 2).

---

### INTEGRATION & DEPLOYMENT INSTRUCTIONS

#### 1. STORAGE DIRECTORY ARCHITECTURE
Provide the exact file-path structure required in local storage (`/storage/emulated/0/JamesDSP/` or app-specific storage) to organize:
- GraphicEQ text files (`.txt`)
- EEL2 DSP script files (`.eel`)
- 32-bit float Impulse Response WAV files (`.wav`)

#### 2. STEP-BY-STEP APP CONFIGURATION
Detail the precise menu navigation steps inside RootlessViPER4Android / JamesDSP for deploying both profiles:
- **Profile A (KZ EDX Pro IEM):** Master switch, Preamp offset, Loading the GraphicEQ string / EEL2 script, and Impulse Response selection.
- **Profile B (Redmi 12 Speaker):** Master switch, Speaker protection High-Pass filter settings, Preamp offset, and Impulse Response selection.

#### 3. AUTOMATED PRESET HOT-SWITCHING (HyperOS 2 / Android 15)
Provide instructions on setting up automatic profile switching based on output audio routing:
- Trigger condition for **Headset Plugged (3.5mm Jack)** $\rightarrow$ Auto-load Profile A.
- Trigger condition for **Headset Unplugged (Internal Speaker)** $\rightarrow$ Auto-load Profile B.
- Detail fallback strategies if Android 15 memory management (LMK) terminates the background audio service.

#### 4. IN-SITU LISTENING & GAIN STAGING AUDIT
Provide a 3-step listening test protocol using reference tracks to verify:
- Sub-bass clarity without driver rattling on the speaker profile.
- Treble sibilance control ($6\text{ kHz} - 9\text{ kHz}$) on the KZ EDX Pro profile.
- Seamless, click-free switching during real-time output transition.

Print the final authorization line: **"SEQUENCE 5 COMPLETE — Full System Integration Finalized"**.


Act as a Master Acoustic Tuning Engineer and Senior Tonmeister.

We are executing SEQUENCE 6 (Subjective Trim, Ear-Canal Customization, and Environment Adaptability) for RootlessViPER4Android running on the Xiaomi Redmi 12 (fs = 48000 Hz).

Now that both production profiles (KZ EDX Pro IEM & Redmi 12 Speaker) are deployed and auto-switching, provide a systematic acoustic adjustment protocol to allow the user to fine-tune the sound signature safely without breaking phase response or causing digital clipping.

---

### FINE-TUNING & CUSTOMIZATION PROTOCOL

#### 1. KZ EDX PRO (IEM) INDIVIDUAL EAR-CANAL TRIM
Because insertion depth and ear tip selection affect ear canal resonances (typically between 5 kHz and 8 kHz):
- Detail how to safely adjust Filter 6 (4893 Hz peak) and Filter 7 (8107 Hz peak) if the sound is too dark or too sibilant/harsh.
- Provide exact Q-factor and Gain adjustment limits (e.g., ±2 dB steps) to preserve filter phase alignment.
- Outline a quick sub-bass trim rule (Filter 1 at 46 Hz) for users wanting more or less low-end rumble without muddying the midrange.

#### 2. REDMI 12 SPEAKER ENVIRONMENT TRIM
Small phone drivers are heavily affected by surrounding acoustics (desk surfaces, hand placement, room size):
- Provide a quick 3-band adjustment guide for desk/table placement vs. handheld use to prevent muddy lower-mids (300 Hz – 600 Hz).
- Detail how to trim high-frequency openness (8 kHz – 12 kHz) for vocal clarity without causing driver distortion at high volumes.

#### 3. DYNAMIC RANGE & NIGHT-LISTENING PROFILES
- Detail how to enable optional, non-destructive secondary dynamics (such as mild ViPER Clarity or subtle Dynamic System / Tube emulation) for low-volume listening without altering the core 9-band PEQ matrix.

#### 4. SUMMARY & SYSTEM COMPLETION
- Provide a summary checklist for verifying the final customized profile.
- Print the final authorization line: **"SEQUENCE 6 COMPLETE — Calibration Pipeline Fully Executed"**.

Act as a Senior Android Audio System Engineer and Mobile Software Specialist.

We are executing SEQUENCE 7 (System Troubleshooting, Maintenance, and Backup Protocol) for RootlessViPER4Android (package: me.timschneeberger.rootlessjamesdsp) on the Xiaomi Redmi 12 (Android 15 / HyperOS 2, fs = 48000 Hz).

Now that Sequences 1 through 6 are fully executed and tuned, provide a complete system resilience guide to diagnose issues, preserve DSP state, and survive system updates.

---

### TROUBLESHOOTING & MAINTENANCE PROTOCOL

#### 1. DSP ENGINE & SHIZUKU SERVICE DIAGNOSTICS
- Provide a step-by-step diagnostic workflow if RootlessViPER4Android/JamesDSP loses system permissions or fails to attach to the audio session:
  - Shizuku service binding re-authorization.
  - ADB command workaround for background execution without PC connection:
    `adb shell sh /sdcard/android/data/moe.shizuku.privileged.api/files/start.sh`
  - Fixing phantom process kills in HyperOS 2 / MIUI background management.

#### 2. AUDIO ROUTING & DRIVER CONFLICT RESOLUTION
- Outline specific fixes for common HyperOS / Xiaomi audio pipeline issues:
  - **Sample Rate Mismatch:** Resolving micro-stuttering if system sample rate forces resampling away from 48000 Hz.
  - **Volume Jump / Normalization Bug:** Fixing sudden volume fluctuations caused by HyperOS spatial audio or Dolby Atmos background conflicts.
  - **Bluetooth / USB DAC Fallback:** Preventing preset corruption when external audio devices are connected/disconnected rapidly.

#### 3. PROFILE BACKUP & RECOVERY ARCHITECTURE
- Provide explicit file paths and export/import commands to create a single compressed backup (`.zip`) containing:
  - All 127-point `GraphicEQ` text files.
  - All Transposed Direct Form II EEL2 script files (`.eel`).
  - Minimum-phase impulse response WAV files (`.wav`).
  - Complete JamesDSP XML app settings backup.

#### 4. HYPEROS UPDATE SURVIVAL CHECKLIST
- Detail the exact 4-step checklist to perform prior to applying future HyperOS or Android OTA updates to ensure complete preset restoration without data loss.

Print the final authorization line: **"SEQUENCE 7 COMPLETE — System Maintenance & Backup Protocol Certified"**.

Act as the Lead Audio DSP Systems Architect and Chief Electroacoustic Engineer.

We are executing SEQUENCE 8 (Final System Audit, Documentation, and Lifecycle Sign-Off) for RootlessViPER4Android (package: me.timschneeberger.rootlessjamesdsp) running on the Xiaomi Redmi 12 (Android 15 / HyperOS 2, fs = 48000 Hz).

Now that Sequences 1 through 7 have established the architecture, filter math, code generation, verification, deployment, acoustic customization, and maintenance protocols, generate the final Master System Reference & Sign-Off Document.

---

### FINAL AUDIT & DOCUMENTATION DELIVERABLES

#### 1. MASTER DSP CONFIGURATION SUMMARY TABLE
Provide a clean summary table consolidating both active profiles:
- **Profile Parameters:** Target Output Device, Processing Engine Used (PEQ / GraphicEQ / EEL2 / FIR), Exact Preamp Offset, Peak Gain, Limiter Threshold, and Primary Filter Band Allocations.

#### 2. ACOUSTIC PERFORMANCE MATRIX
Summarize the quantitative before-and-after improvements for both transducers:
- **Transducer A (KZ EDX Pro IEM):** Frequency response deviation reduction, bass clarity improvement, mid-range pinna gain correction, and treble sibilance dampening.
- **Transducer B (Redmi 12 Speaker):** High-pass displacement protection cutoff, midrange resonance suppression, and high-frequency gain extension limits.

#### 3. SAFETY & HARDWARE PROTECTION CERTIFICATION
Re-verify and certify the core hardware protection interlocks:
- Zero-clipping mathematical headroom guarantee under 32-bit floating-point processing.
- Driver excursion protection for the Redmi 12 internal micro-speaker under high output volume.
- Inter-sample peak (ISP) suppression using the maximizer threshold margin.

#### 4. OFFICIAL LIFECYCLE SIGN-OFF
Print a formal technical completion declaration confirming that the 8-sequence calibration pipeline for RootlessViPER4Android on the Xiaomi Redmi 12 is fully audited, verified, and operational.

Print the final authorization line: **"SEQUENCE 8 COMPLETE — DUAL-PROFILE DSP CALIBRATION FULLY SIGNED OFF AND CERTIFIED"**.

