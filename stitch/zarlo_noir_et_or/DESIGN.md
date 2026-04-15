# Design System Strategy: The Brutalist Gallery

### 1. Overview & Creative North Star
**Creative North Star: "The Brutalist Gallery"**
This design system rejects the "friendly" and "rounded" trends of generic SaaS. For a brand like this, we are building a digital flagship store that feels like a high-end streetwear gallery: aggressive, architectural, and unapologetically premium. 

We achieve a "High-End Editorial" experience by leveraging a rigid grid as our foundation, then intentionally breaking it through asymmetric imagery and extreme typography scales. The goal is to move away from "software" and toward "publication." We use the contrast between deep blacks and neon accents to create a sense of nocturnal energy and exclusive "drop" culture.

---

### 2. Colors & Tonal Depth
The palette is rooted in absolute dark-mode luxury. We avoid middle-greys to maintain a high-contrast, prestigious atmosphere.

*   **Primary (#C6C6C7):** Used for high-level metadata and secondary text.
*   **Secondary (#EAC169 - Gold):** Reserved for prestige moments—loyalty status, limited edition markers, and "Buy" actions.
*   **Tertiary (#FFB4AB / Neon Red):** Used sparingly for "Sold Out" states, high-priority alerts, or "New Drop" indicators.

**The "No-Line" Rule**
Standard UI relies on borders to separate content. In this system, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background shifts. For example, a product description section using `surface-container-low` should sit against a `surface` background. The shift in tone provides the boundary, creating a cleaner, more editorial aesthetic.

**Surface Hierarchy & Nesting**
Treat the UI as a series of stacked, monolithic slabs:
*   **Surface-Container-Lowest (#0E0E0E):** The deepest "void" for background content.
*   **Surface (#131313):** The standard canvas for the experience.
*   **Surface-Container-High (#2A2A2A):** Used for interactive elements or cards that need to "step forward" from the background.

**Signature Textures**
To prevent the design from feeling "flat," use a subtle gradient transition on primary CTAs—moving from `primary` to `primary-container`. This adds a "metallic" weight to the buttons that flat color cannot replicate.

---

### 3. Typography
The typography is the architecture of this system. We mix the structural weight of **Epilogue** with the utilitarian precision of **Space Grotesk**.

*   **Display & Headline (Epilogue):** These are your "billboard" moments. Use `display-lg` for hero sections. Always apply `text-transform: uppercase` and a letter-spacing of `0.05em` to `0.1em`. This creates an authoritative, cinematic presence.
*   **Title & Body (Manrope):** Manrope provides a sophisticated, readable counter-balance. Use `body-lg` for product descriptions to maintain a luxury editorial feel.
*   **Labels (Space Grotesk):** For technical specs, sizing, and pricing. This adds a "tech-wear" or "manifesto" vibe to the streetwear aesthetic, implying precision and utility.

---

### 4. Elevation & Depth
In this system, we do not use "elevation" in the traditional sense of light and shadow. We use **Tonal Layering** and **Hard Edges**.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A `surface-container-highest` card should sit atop a `surface-container-low` section. This creates a soft, natural lift without the need for dated drop shadows.
*   **The Hard Edge Policy:** With a **0px border-radius** across all components, the "depth" comes from the intersection of these sharp geometric planes.
*   **Ambient Shadows:** If a floating element (like a modal or dropdown) requires a shadow for legibility, it must be an "Ambient Shadow": a large 64px blur with 4% opacity using a tint of the `on-surface` color.
*   **Glassmorphism:** For navigation bars or floating "Quick Add" menus, use a `surface` color at 80% opacity with a `backdrop-blur: 20px`. This allows the high-contrast product photography to bleed through the UI, making the interface feel integrated with the content.

---

### 5. Components

**Buttons (Monolithic Style)**
*   **Primary:** Solid `secondary` (Gold) or `primary` (White/Silver) with `on-primary` text. No rounded corners. Large padding (16px 32px).
*   **Secondary:** Ghost style. No border. Use `surface-container-high` as the background with a subtle "Glass" hover effect (increasing opacity).
*   **Hover State:** On hover, the button should "invert"—background becomes text color, text becomes background color—creating a sharp, high-contrast flicker effect.

**Product Cards**
*   **Style:** No borders, no shadows. The image fills the container to the edge. 
*   **Layout:** Information (Name/Price) is placed below the image using `Space Grotesk` for the price to emphasize the "technical luxury" aspect.
*   **Hover:** On hover, the image scales slightly (1.05x) within its frame, and a "Quick Add" glass bar appears at the bottom.

**Input Fields & Forms**
*   **Structure:** No boxed inputs. Use a single bottom-weighted line (`outline-variant` at 20% opacity). 
*   **Focus:** On focus, the line transitions to `secondary` (Gold) and the label (using `label-md`) shifts upward with a subtle tracking increase.

**Lists & Navigation**
*   **Dividers:** Forbidden. Use 48px or 64px of vertical white space to separate list items. 
*   **Active State:** Mark active navigation items with a `tertiary` (Neon Red) 2px dot or a small block, rather than a line.

---

### 6. Do's and Don'ts

**Do:**
*   **Embrace the Grid:** Use a 12-column grid but allow images to span 7 columns while text spans 4, creating intentional "breathing room" or white space.
*   **Use Massive Type:** Don't be afraid to let a `display-lg` headline overlap a product image slightly.
*   **Stick to 0px:** Every corner must be sharp. Rounding a single corner breaks the entire brand's "bold/modern" promise.

**Don't:**
*   **No "Software" Shadows:** Never use high-opacity, small-blur shadows. They make the brand look like a generic app rather than a fashion house.
*   **No 1px Dividers:** If the UI feels cluttered, add more `surface` space rather than adding lines.
*   **Avoid Pure Grey:** When using neutrals, ensure they are either the deep `surface` blacks or the crisp `on-surface` whites. Avoid "middle-of-the-road" greys that dilute the high-contrast impact.