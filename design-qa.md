# Design QA — Canada eTA landing page

final result: passed

## Visual truth and captures

- Selected visual source: `C:\Users\Pelego\.codex\generated_images\019fc3ca-6918-7ff0-a165-5dc94eb52450\exec-97e863c6-a760-4de2-9430-1b826f2164a5.png` (771 × 2039 px).
- Final desktop capture: `C:\Users\Pelego\AppData\Local\Temp\eta-canada-option1-desktop-v2.png` (1440 × 3867 px).
- Final mobile capture: `C:\Users\Pelego\AppData\Local\Temp\eta-canada-option1-mobile.png` (390 × 6035 px).
- Combined full-page comparison: `C:\Users\Pelego\AppData\Local\Temp\eta-canada-design-comparison-v2.png` (1440 × 1982 px).
- Desktop viewport: 1440 × 1000 CSS px, device scale factor 1, full-page capture.
- Mobile viewport: 390 × 844 CSS px, device scale factor 1, full-page capture.
- State: English landing page, default FAQ state. FAQ expanded, language switch, mobile navigation, CTA destinations, and application disclosure were tested separately.

## Comparison history

### Iteration 1

- P2 — Icons: the three process steps did not include the icons visible in the selected source. This weakened scanability and fidelity.
- Fix: added matching Lucide icons (`UploadCloud`, `FileSearch2`, and `Send`) with consistent stroke, size, and alignment.

### Iteration 2

- Re-captured the complete desktop page and placed it beside the source in one comparison image.
- No remaining P0, P1, or P2 visual findings.

## Mandatory review

- Typography: serif display headings and compact sans-serif body hierarchy match the editorial/private-consultancy direction. No truncation or cramped wrapping was found.
- Spacing and layout: hero split, process rhythm, inclusion/exclusion panel, pricing, FAQ, closing CTA, and footer preserve the selected source hierarchy. Desktop and mobile sections do not overlap or clip.
- Colors and surfaces: navy, white, pale gray, red CTA, green inclusion, and restrained warning red are consistent. Borders, shadows, and radii remain subtle and do not turn the page into a generic card grid.
- Image quality: the real mountain/lake hero asset is sharp, correctly cropped, and remains readable beneath the solid overlay. No CSS art, placeholder imagery, or handcrafted SVG substitutes were introduced.
- Icons: all visible icons use the same Lucide family and maintain consistent optical weight.
- Copy: every main section clearly describes a private paid assistance service, separates the US$42 service fee from the official CAN$7 fee, links to Canada.ca, and avoids approval or processing-time guarantees.
- Accessibility: semantic headings, buttons, links, lists, and native `details`/`summary` controls are used. Images have alternative text, controls have visible focus treatment, mobile tap targets are practical, and text contrast is sufficient.
- Responsiveness: verified at 1440 px desktop and 390 px mobile. Header navigation becomes a functional menu; grids stack without collision; CTAs wrap without overflow.
- Interactions: FAQ expansion, EN/ES language switching, mobile menu, assisted-application CTA, official Canada.ca link, and pre-form fee disclosure all passed. No browser console or page errors occurred in the automated interaction pass.

## Intentional source deviations

- The generated concept's invented `CAN$49` was replaced with the site's actual private-service amount, `US$42`.
- Invented contact and company details from the concept were replaced with details already present in the repository.
- Process language was changed from implying direct government submission to accurately describing review, guidance, and status communication.
- These deviations are required for truthful pricing, business identity, and advertising compliance; they do not alter the selected visual direction.
