# HyperAudio VDC Reference

> **Purpose:** Describe the VDC/DDC assets actually shipped by HyperAudio, their verified structure, and the safe boundaries for editing or generating replacements.
>
> **Evidence scope:** The two current profile files were inspected directly from the repository. Their identity content is a file-level fact. It does **not** establish the complete grammar or behaviour of every VDC accepted by every RootlessJamesDSP build.

## 1. Role in the HyperAudio chain

`Source → DDC (VDC) → Convolver (IRS) → Liveprog (EEL2) → Output`

HyperAudio deliberately keeps static tonal correction in the IRS. The shipped VDC files are identity filterbanks: they do not add a second copy of the IRS correction. Do not add the same EQ to both stages.

## 2. Shipped files

| Profile | Repository path | SHA-256 |
|---|---|---|
| Redmi 12 Speaker V6 | `Redmi_12/HA_Speaker_Master.vdc` | `933be0b02daead88450f2042065d0fb5a44e77099f8c29a6e37b9669e6a2d6ef` |
| KZ EDX Pro IEM v3 | `edx_pro/HA_IEM_v3.vdc` | `933be0b02daead88450f2042065d0fb5a44e77099f8c29a6e37b9669e6a2d6ef` |

The files are byte-identical. Both contain two records, `SR_44100` and `SR_48000`. Each record contains 50 comma-separated numeric values: ten consecutive five-value groups. Every group is:

```text
1.0,0.0,0.0,0.0,0.0
```

This is the identity biquad representation used in these shipped files. Both sample-rate banks are identity; the presence of a 44.1 kHz identity bank does not make the IRS profiles multi-rate. The associated IRS assets are 48 kHz.

## 3. What identity means

For each listed section, the repeated identity tuple represents a unity transfer section. Cascading ten identity sections leaves the signal unchanged by the filterbank, apart from any host-level behaviour outside the file itself.

Consequently:
- the VDC is a routing/format-compatible identity stage in the current profiles;
- the IRS is the only static tonal-correction stage;
- EEL2 performs operational processing, not a duplicate static PEQ.

The statement above describes the supplied coefficients mathematically. It does not independently prove how every app version parses, selects, or executes a VDC.

## 4. Safe inspection and validation

For the current HyperAudio assets, a simple text inspection is sufficient to confirm the shipped payload:

1. Confirm the file path and SHA-256 against the table above.
2. Confirm exactly one `SR_44100:` line and one `SR_48000:` line.
3. Split each line at the first colon; verify the key and parse the remaining comma-separated values as finite numbers.
4. Verify exactly 50 values per bank.
5. Verify each consecutive group of five equals `1,0,0,0,0` (allowing only the decimal spelling difference shown in the shipped file).
6. Confirm the two profile VDCs remain byte-identical if the architecture is unchanged.

Do not rewrite a valid identity file merely to reformat its numbers. A textual rewrite changes the hash even if the numeric values remain equivalent.

## 5. Editing boundary

A non-identity VDC is **outside the verified scope of this reference**. The current repository assets do not establish:
- general coefficient ordering for arbitrary non-identity sections;
- whether coefficients are normalised or transformed by the app;
- supported section counts or upper limits;
- accepted numeric syntax, whitespace, line endings, or duplicate-key behaviour;
- sample-rate fallback/selection rules;
- malformed-file recovery or whether partial loading can occur;
- runtime state-transition behaviour when switching banks.

Do not infer these rules from the identity tuple alone. Before authoring a non-identity VDC, obtain a known-good non-identity file accepted by the exact target app build, inspect the app/VM parser implementation for that build, and test the result on the target device.

## 6. Evidence and release status

| Claim | Evidence | Status |
|---|---|---|
| Both shipped profile VDC files are byte-identical | Matching repository SHA-256 | **PASS — file identity** |
| Both files contain 44.1 and 48 kHz identity banks | Direct content inspection; 50 values per bank | **PASS — structure/content** |
| Coefficients describe identity sections | Mathematical interpretation of supplied tuples | **PASS — mathematical** |
| RootlessJamesDSP accepts and loads these files | Author's repository notes | **USER REPORTED** |
| Arbitrary non-identity VDC syntax is fully documented | No non-identity fixture/parser evidence in this repository | **NOT ESTABLISHED** |

A file-level pass is not the same as app acceptance, device runtime verification, or an acoustic measurement.

## 7. Release checklist

- [ ] Keep VDC identity while IRS owns all static tonal correction.
- [ ] Verify both profile hashes after copying or downloading.
- [ ] Check both sample-rate records and all 50 values per bank.
- [ ] Do not claim a non-identity grammar without a verified fixture and target-build test.
- [ ] Re-test app loading after a RootlessJamesDSP update.
- [ ] Update this document and the profile reports if either VDC changes.

## Related documentation

- [Methodology](methodology.md) — chain architecture and evidence labels.
- [IRS reference](irs_functions.md) — correction payload format and validation.
- [EEL2 reference](eel_functions) — Liveprog UI/parser authoring reference.
- [Test report](test_report.md) — current validation state.

**Reference version:** 1.0  
**Last checked against repository assets:** October 2026
