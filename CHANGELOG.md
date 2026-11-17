# Changelog

All notable changes to the **Jawahar Navodaya Vidyalaya Alumni Association (Gauriganj) Platform** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-17 - Production Soft Launch Release
### Added
- **4th Annual Mega Meet 2026 (13 December 2026):**
  - Dynamic program itinerary with interactive Add/Edit/Delete schedule controls for Event Hosts & Admins.
  - Cultural Acts Registration portal and real-time Host & Admin Stage Command Desk with technical requirements & live notes.
  - Interactive RSVP confirmation matrix and batch attendee directory.
- **Role-Based Access Control (RBAC):**
  - Multi-tier leadership governance (Super Admin, Event Host, Content Moderator, Verified Member, Revered Gurujan).
  - Admin delegation controls (assign Host, Moderator, Member, Teacher).
  - Host delegation controls (promote Member to Moderator, demote Moderator to Member).
  - Clean profile capsule in header; visitor guest view with direct Alumni Login and Register triggers.
- **Revered Gurujan & Faculty Portal:**
  - Dedicated `teacher` role with honored status and greetings (*"सादर प्रणाम, आदरणीय..."*).
  - Memory Wall postings with distinctive golden aura and `🪔 Revered Gurujan` blessing badges.
  - Pre-seeded faculty accounts for Vidyalaya Principal (Mr. P. K. Singh), Vice Principal (Mr. N. N. Tripathi), and Alumni Coordinator (Mr. S. K. Singh).
- **Alumni Directory & Privacy Protection:**
  - Comprehensive searchable alumni directory with batch, house, location, and professional domain filters.
  - Private contact protection with direct peer-to-peer messaging.
- **Sahayata & Emergency Escalation Matrix:**
  - 3-tier helpdesk workflow (Batch Level -> Regional Chapter -> Central Executive Committee & Welfare Corpus).
- **Financial Transparency & Audited Ledger:**
  - Online contribution workflow with automated receipt generation and unique receipt number.
  - Audited ledger access restricted strictly to Host and Super Admin.
- **Native Mobile App Distribution (Capacitor):**
  - Package identifier `org.jnvalumni.gauriganj`.
  - Android Manifest configured for Google Play Store.
  - iOS Info.plist configured for Apple App Store.
  - Packaged distribution bundle `JNV_Alumni_Mobile_App_Bundle.zip`.
- **Automated CI/CD & Testing:**
  - 36/36 assertion unit and integration test suite (`scratch/comprehensive_test_suite.js`).
  - GitHub Actions CI/CD pipeline for automated test execution, GitHub Pages deployment, and mobile archive release.
