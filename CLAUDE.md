# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
maUI is a native Web Components UI library built with TypeScript, SCSS, and Webpack. It provides framework-agnostic components that can be used in any web project.

## Development Commands

### Core Development
- `npm run dev` - Start development server on http://localhost:3000/demo.html
- `npm run build` - Production build with optimization and hashing
- `npm run build:dev` - Development build without optimization
- `npm run clean` - Remove dist directory

### Code Quality
- `npm run type-check` - TypeScript type checking without emit
- `npm run lint` - ESLint check on src directory 
- `npm run lint:fix` - ESLint with auto-fix
- `npm test` - Run Jest tests
- `npm test:watch` - Run Jest in watch mode

## Project Architecture

### Component Structure
Components follow a consistent pattern:
- Each component has its own directory under `src/components/`
- TypeScript class extends HTMLElement with Shadow DOM
- SCSS styles imported as CSS modules
- Custom events for interaction (ma-click, ma-focus, ma-blur)
- Observed attributes for reactive updates
- Public getter/setter properties for programmatic access

### Key Files
- `src/index.ts` - Main export file for the library
- `src/types/index.ts` - Global TypeScript definitions
- `src/utils/index.ts` - Shared utility functions
- `src/styles/index.scss` - Global styles
- `src/demo/` - Demo page for development testing

### Web Components Architecture
- Uses Shadow DOM for encapsulation
- Custom elements registration with `customElements.define()`
- Reactive attributes via `observedAttributes` and `attributeChangedCallback`
- Event handling through custom events with `composed: true` for cross-shadow-boundary
- Style encapsulation through CSS modules in production

### Build System
- Webpack with TypeScript and SCSS loaders
- Two entry points: library (`index.ts`) and demo (`demo/index.ts`)
- UMD library format for universal consumption
- CSS modules with different naming in dev vs production
- Alias support: `@/` maps to `src/`

### Code Style
- 2-space indentation
- Single quotes
- Semicolons required
- TypeScript strict mode enabled
- ESLint with TypeScript plugin
- Unused parameters prefixed with underscore

### Testing
- Jest with ts-jest preset
- jsdom environment for DOM testing
- CSS/SCSS files mocked with identity-obj-proxy
- Setup file at `src/setupTests.ts`

### Component Development Pattern
1. Create component directory under `src/components/`
2. Implement TypeScript class extending HTMLElement
3. Define observedAttributes for reactive props
4. Create SCSS file with component styles
5. Export from `src/index.ts`
6. Add to demo page for testing
7. Register with `customElements.define()` if not already registered