# edsim.org

High-quality, interactive educational simulations — created by teachers, for teachers.
Free access guaranteed for high-poverty schools.

## Repo Structure

```
edsim.org/
├── index.html                        # Homepage / sim directory
├── shared/
│   ├── css/
│   │   ├── tokens.css                # Design tokens (colors, spacing, type)
│   │   ├── sim-base.css              # Tabs, buttons, print layout
│   │   └── reset.css
│   ├── js/
│   │   ├── sim-core.js               # Tab navigation
│   │   ├── storage.js                # Auto-save to localStorage
│   │   ├── print.js                  # Save as PDF with section select
│   │   └── ai.js                     # Anthropic API wrapper
│   └── assets/icons/
├── simulations/
│   ├── math/
│   │   ├── k2/
│   │   ├── 35/
│   │   ├── 68/
│   │   └── 912/
│   ├── science/        (same structure)
│   ├── ela/            (same structure)
│   ├── social-studies/ (same structure)
│   └── other/          (same structure)
├── docs/
│   ├── BUILD_STANDARDS.md            # Required quality checklist
│   ├── SIM_TEMPLATE.md               # How to create a new sim
│   └── CONTRIBUTING.md
└── scripts/
    ├── new-sim.sh                     # Scaffold a new sim folder
    └── validate.sh                    # Check a sim against build standards
```

## Creating a New Sim

See [docs/SIM_TEMPLATE.md](docs/SIM_TEMPLATE.md).

## Build Standards

See [docs/BUILD_STANDARDS.md](docs/BUILD_STANDARDS.md).

## Tech Stack

Vanilla HTML / CSS / JavaScript. No build step. Files open directly in any browser.
