# Design QA

- Source visual truth: `conversation://attachment/footer-mobile-reference` (the two mobile footer screenshots supplied by the user)
- Implementation screenshot: `C:\Users\rcalmeida\Desktop\eTA-Canada\screenshots\page-mobile-tall.png`
- Focused footer crop: `C:\Users\rcalmeida\Desktop\eTA-Canada\screenshots\footer-mobile-crop.png`
- Viewport: 393 px wide mobile capture; 6000 px tall inspection canvas
- Pixel dimensions: source references 349 × 288 and 405 × 750; implementation 393 × 6000; focused crop 393 × 1500
- CSS viewport width: 393 px
- Device scale factor: 1
- Density normalization: source screenshots were used for hierarchy and emphasis rather than pixel-for-pixel brand reproduction; the implementation was captured at 1×
- State: landing page, footer visible, no menus or disclosures expanded

## Full-view comparison evidence

The page now moves directly from the final red call-to-action into the footer. The former full-width white company/trust section is absent. The company identity, registration number, address, and email appear near the bottom of the navy footer after the primary service and legal navigation, matching the reference's information hierarchy.

## Focused region comparison evidence

The focused footer crop confirms a dark navy background, a small secondary company label, muted blue-gray company copy, compact icons, and thin dividers. This is intentionally quieter than the reference's white “Company” heading because the user's explicit request was to reduce emphasis.

## Findings

- P0: none.
- P1: none.
- P2: none. Company information is no longer a prominent content section and remains readable at mobile width.
- P3: the legal links remain more visually prominent than the company metadata; this is intentional and supports the requested hierarchy.

## Required fidelity surfaces

- Fonts and typography: existing site typefaces are preserved; company metadata uses 10–11 px text with compact line height and clear hierarchy.
- Spacing and layout rhythm: company metadata sits after the main footer grid with a 36 px mobile separation and its own subtle divider; rows use a compact 7 px gap.
- Colors and visual tokens: existing navy footer is preserved; company text uses the existing muted blue-gray family at accessible visual weight.
- Image quality and asset fidelity: no new raster assets or replacements were required; the existing Lucide mail and location icons remain sharp.
- Copy and content: company name, CNPJ, Brazilian address, and support email are preserved without duplication in the main page.

## Comparison history

- Initial finding: company/legal identity was duplicated in a prominent standalone section above the CTA and in an equal-weight footer column.
- Fix: removed the standalone section and moved the footer company details into a low-emphasis metadata band below the main footer grid.
- Post-fix evidence: `screenshots/footer-mobile-crop.png` shows the requested subdued, bottom-of-footer placement.

## Primary interaction and technical checks

- Production Next.js build passed, including lint and TypeScript validation.
- Mail link and legal navigation remain present in the footer.
- The footer retains `id="contact"` as a stable contact destination.
- No new console errors were observed during the headless Chrome capture.

final result: passed
