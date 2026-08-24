# ItsPast Research Engine Architecture

ItsPast research follows a traceable pipeline:

DISCOVER → IDENTIFY → COLLECT → NORMALIZE → MATCH → EXTRACT → CROSS-CHECK → CONFIDENCE SCORE → BUILD TIMELINE → STORE SOURCES → GENERATE RECONSTRUCTION → QUALITY REVIEW → PUBLISH.

## Non-negotiable rule

No historical claim is published without claim text, source, source type, source identifier or URL, date or `UNKNOWN`, location or `UNKNOWN`, evidence, confidence, and provenance.

If evidence is missing, store `UNKNOWN`. Do not infer missing history from probability or model vibes.

## Modules

- `SourceProvider`: provider contract for search/fetch/normalize.
- `SourceSearch`: deterministic query generation from entity, address, coordinates, dates, aliases, landmarks, and parcel IDs.
- `SourceNormalizer`: provider output to internal source records without assuming copyright status.
- `SourceMatcher`: entity identity resolution with match confidence; low confidence never auto-merges.
- `ClaimBuilder`: candidate claim construction from source snippets.
- `EvidenceExtractor`: evidence rows linked to claims and sources.
- `ConfidenceEngine`: transparent score + explanation.
- `TimelineBuilder`: supported/conflicting claims become timeline drafts.
- `ReconstructionEvidenceBuilder`: reconstruction eligibility gate.
- `ResearchJobQueue`: budgeted job primitives with deduplication and rate-limit state.

## AI role

AI runs only after source collection. Its tasks are summarization, extraction assistance, conflict detection, missing-search suggestions, and structured candidate timelines. AI output must separate facts, inferences, conflicts, unknowns, and recommended research.
