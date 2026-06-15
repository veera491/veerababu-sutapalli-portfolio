# Project Cover Asset Audit

This audit document logs the status, path, and action taken for each of the portfolio projects. All assets have been standardized to live under the path `/assets/projects/<project-slug>/` using the consistent convention `cover.webp` or `cover.svg`.

| Project Title | Project Slug | Referenced Cover Path | Existing Asset | Asset Type | Status | Action Taken |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Predicting Risk Level in Life Insurance Application** | `life-insurance-risk-prediction` | `/assets/projects/life-insurance-risk-prediction/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG risk analysis visual, mapped in CSV. |
| **Scaling Distributed Inference of BLOOMZ-560M using Petals** | `distributed-llm-inference-bloomz-petals` | `/assets/projects/distributed-llm-inference-bloomz-petals/cover.webp` | Yes | WebP | **Repaired** | Normalized folder to match slug, copied verified 126 KB optimized WebP from staging directory, mapped in CSV. |
| **AI-Generated Review Detection** | `ai-generated-review-detection` | `/assets/projects/ai-generated-review-detection/cover.webp` | Yes | WebP | **Verified** | Verified pre-existing WebP cover image in place and kept metadata mapping. |
| **Decision Support System for Port Efficiency Analysis** | `port-efficiency-decision-support-system` | `/assets/projects/port-efficiency-decision-support-system/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG port-route operational visual, mapped in CSV. |
| **Customer Churn Prediction — KKBox** | `kkbox-customer-churn-prediction` | `/assets/projects/kkbox-customer-churn-prediction/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG user retention curve visual, mapped in CSV. |
| **Android Malware Detection using Machine Learning** | `android-malware-detection-machine-learning` | `/assets/projects/android-malware-detection-machine-learning/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG malware flow graph visual, mapped in CSV. |
| **Cloud-Based Brain Stroke Detection** | `cloud-based-brain-stroke-detection` | `/assets/projects/cloud-based-brain-stroke-detection/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG cloud-infrastructure node visual, mapped in CSV. |
| **Pin Your Spot** | `pin-your-spot-mobile-application` | `/assets/projects/pin-your-spot-mobile-application/cover.svg` | Yes | SVG | **Created** | Created custom cinematic SVG location perspective grid visual, mapped in CSV. |

## Fallback Cover Asset

A premium generic fallback cover was designed and created to handle cases where project cover images might be deleted or missing in the future.

- **Fallback path**: `/assets/projects/fallback-cover.svg`
- **Fallback type**: SVG
- **Status**: **Created**
- **Action**: Created cinematic dark tech background grid and gradient. Mapped as fallback in `src/lib/assets/constants.ts` for both `project` and `publication` types.
