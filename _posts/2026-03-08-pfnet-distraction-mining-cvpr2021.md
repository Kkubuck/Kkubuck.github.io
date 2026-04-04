---
layout: "post"
title: "Camouflaged Object Segmentation With Distraction Mining"
subtitle: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
summary: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
description: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
date: "2026-03-08 09:00:00 +0900"
slug: "pfnet-distraction-mining-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "pfnet"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf"
---

## 오버뷰

PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다.

## 핵심 주장

- COD는 global positioning과 local focus를 분리해 다루는 편이 효과적이다.
- distraction mining이 background noise를 줄여 estimation 성능을 높인다.
- 72 FPS 실시간 속도와 함께 18개 cutting-edge model을 앞서는 성능을 보고한다.

## 초록

저자들은 COD를 predation process에 비유해, positioning module과 focus module을 갖춘 PFNet을 제안합니다. focus module 내부의 distraction mining이 방해 영역을 발견하고 제거해 segmentation 품질을 높입니다.

## 서론

지금의 복잡한 foundation model 이전 시점에서, PFNet은 COD의 기본 설계 감각을 만든 작업 중 하나입니다. global-local 분해가 특히 중요합니다.

## 본론

PFNet의 강점은 구조가 비교적 단순하지만 문제 정의가 분명하다는 점입니다. 먼저 찾고, 그다음 ambiguous region에 집중한다는 흐름이 명확합니다.

## 제안방법

positioning module이 잠재 영역을 잡고, focus module이 progressive refinement를 수행합니다. 이 안에서 distraction mining이 방해 영역을 제거하는 역할을 맡습니다.

## 실험

논문은 세 개의 challenging benchmark와 네 가지 standard metrics에서 strong baseline 성능을 보이고, 동시에 real-time 속도도 강조합니다.

### 메인 실험 결과

| 모델 | 연도/학회 | CHAMELEON (Sα↑ M↓) | CAMO (Sα↑ M↓) | COD10K (Sα↑ M↓) |
| --- | --- | --- | --- | --- |
| FPN◦[30] | CVPR’17 | 0.794 0.835 0.590 0.075 | 0.684 0.791 0.483 0.131 | 0.697 0.711 0.411 0.075 |
| PSPNet• [66] | CVPR’17 | 0.773 0.814 0.555 0.085 | 0.663 0.778 0.455 0.139 | 0.678 0.688 0.377 0.080 |
| Mask RCNN⋆[17] | ICCV’17 | 0.643 0.780 0.518 0.099 | 0.574 0.716 0.430 0.151 | 0.613 0.750 0.402 0.080 |
| UNet++§ [71] | DLMIA’17 | 0.695 0.808 0.501 0.094 | 0.599 0.740 0.392 0.149 | 0.623 0.718 0.350 0.086 |
| DSC△[20] | CVPR’18 | 0.850 0.888 0.714 0.050 | 0.736 0.830 0.592 0.105 | 0.758 0.788 0.542 0.052 |
| PiCANet† [33] | CVPR’18 | 0.769 0.836 0.536 0.085 | 0.609 0.753 0.356 0.156 | 0.649 0.678 0.322 0.090 |
| BDRAR△[72] | ECCV’18 | 0.779 0.881 0.663 0.064 | 0.759 0.825 0.664 0.093 | 0.753 0.836 0.591 0.051 |
| HTC⋆[2] | CVPR’19 | 0.517 0.490 0.204 0.129 | 0.476 0.442 0.174 0.172 | 0.548 0.521 0.221 0.088 |
| MSRCNN⋆[22] | CVPR’19 | 0.637 0.688 0.443 0.091 | 0.617 0.670 0.454 0.133 | 0.641 0.708 0.419 0.073 |
| BASNet† [44] | CVPR’19 | 0.687 0.742 0.474 0.118 | 0.618 0.719 0.413 0.159 | 0.634 0.676 0.365 0.105 |
| CPD† [55] | CVPR’19 | 0.853 0.878 0.706 0.052 | 0.726 0.802 0.550 0.115 | 0.747 0.763 0.508 0.059 |
| PFANet† [69] | CVPR’19 | 0.679 0.732 0.378 0.144 | 0.659 0.735 0.391 0.172 | 0.636 0.619 0.286 0.128 |
| EGNet† [67] | ICCV’19 | 0.848 0.879 0.702 0.050 | 0.732 0.827 0.583 0.104 | 0.737 0.777 0.509 0.056 |
| F3Net† [53] | AAAI’20 | 0.854 0.899 0.749 0.045 | 0.779 0.840 0.666 0.091 | 0.786 0.832 0.617 0.046 |
| GCPANet† [5] | AAAI’20 | 0.876 0.891 0.748 0.041 | 0.778 0.842 0.646 0.092 | 0.791 0.799 0.592 0.045 |
| PraNet§ [13] | MICCAI’20 | 0.860 0.898 0.763 0.044 | 0.769 0.833 0.663 0.094 | 0.789 0.839 0.629 0.045 |
| MINet-R† [40] | CVPR’20 | 0.844 0.919 0.746 0.040 | 0.749 0.835 0.635 0.090 | 0.759 0.832 0.580 0.045 |
| SINet* [12] | CVPR’20 | 0.869 0.899 0.740 0.044 | 0.751 0.834 0.606 0.100 | 0.771 0.797 0.551 0.051 |
| PFNet* | Ours | 0.882 0.942 0.810 0.033 | 0.782 0.852 0.695 0.085 | 0.800 0.868 0.660 0.040 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

PFNet은 COD 초창기 대표 기준선으로, 지금 봐도 문제를 어떻게 나누어 볼지 감을 주는 논문입니다.

## 논의

초기 COD 논문들을 다시 읽을 때 PFNet을 함께 보면, 이후 모델들이 무엇을 더 세밀하게 고치려 했는지가 잘 보입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf
