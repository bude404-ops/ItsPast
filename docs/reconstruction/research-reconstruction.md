# Research-Gated Reconstruction

Reconstructions are allowed only after evidence collection.

Eligible evidence may include:

- at least one historical photograph, or
- multiple strong architectural/documentary sources, or
- a strong historical map plus written description and known structure evidence.

If insufficient, return `INSUFFICIENT_EVIDENCE` and show: "Insufficient evidence for reliable reconstruction."

Every generated output must include metadata:

- AI RECONSTRUCTION
- year depicted
- evidence used
- confidence
- known elements
- estimated elements
- unknown elements

Prompt builders must explicitly instruct image models: "Do not invent unsupported architectural details." Generated images must never be presented as historical photographs.
