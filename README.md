# Lucas Pereira Walter - Portfolio

A responsive portfolio showcasing my software development projects and technical skills.

## Overview

This project centralizes, presents, and organizes my main development projects in one place.

The system is a static personal portfolio featuring a professional introduction, skills section, project list, technology filters, GitHub repositories, and supporting pages with instructions for running each project locally.

## Features

- Responsive project showcase
- Technology-based project filters
- Links to source repositories
- Project-specific local setup guides
- Professional profile and skills sections

## Tech Stack

- Front end
  - HTML5
  - CSS3
  - Vanilla JavaScript

## Getting Started

No build step or dependency installation is required. Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/lucaspwalter/portfolio.git
cd portfolio
```

## Project Structure

```text
.
├── README.md                  # Portfolio documentation
├── index.html                 # Main portfolio page
├── setup-ferroviaria.html     # Local setup guide for Ferroviaria LLGR
├── setup-pricewatch.html      # Local setup guide for PriceWatch
├── setup-turnover.html        # Local setup guide for Turnover Dashboard
├── public/                    # Public files used by the website
│   └── assets/
│       └── images/
│           ├── pfp.png        # Profile picture displayed at the top
│           └── projects/
│               ├── ferroviaria.png  # Ferroviaria LLGR project image
│               ├── pricewatch.png   # PriceWatch project image
│               └── turnover.png     # Turnover Dashboard project image
└── src/                       # Front-end source code
    ├── css/
    │   └── estilo.css         # Visual styles, responsiveness, and components
    └── js/
        └── principal.js       # Mobile menu, animations, and project filters
```
