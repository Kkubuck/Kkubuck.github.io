---
layout: "post"
title: "Just a Hint: Point-Supervised Camouflaged Object Detection"
subtitle: "point 하나만으로 COD를 풀겠다는 건 꽤 공격적인 설정입니다. 이 논문은 point annotation을 hint area로 확장하고 attention regulator와 contrastive learning을 붙여, 최소 supervision으로도 전체 객체를 보게 만드는 방향을 제안합니다."
summary: "point 하나만으로 COD를 풀겠다는 건 꽤 공격적인 설정입니다. 이 논문은 point annotation을 hint area로 확장하고 attention regulator와 contrastive learning을 붙여, 최소 supervision으로도 전체 객체를 보게 만드는 방향을 제안합니다."
description: "point 하나만으로 COD를 풀겠다는 건 꽤 공격적인 설정입니다. 이 논문은 point annotation을 hint area로 확장하고 attention regulator와 contrastive learning을 붙여, 최소 supervision으로도 전체 객체를 보게 만드는 방향을 제안합니다."
date: "2026-03-22 09:00:00 +0900"
slug: "just-a-hint-point-supervised-cod-eccv2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "weak-supervision"
  - "eccv2024"
venue: "ECCV 2024"
source_url: "https://eccv.ecva.net/virtual/2024/poster/2276"
pdf_url: "https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/05190.pdf"
---

## 오버뷰

point 하나만으로 COD를 풀겠다는 건 꽤 공격적인 설정입니다. 이 논문은 point annotation을 hint area로 확장하고 attention regulator와 contrastive learning을 붙여, 최소 supervision으로도 전체 객체를 보게 만드는 방향을 제안합니다.

## 핵심 주장

- pixel-wise annotation 부담을 point supervision까지 줄일 수 있다.
- hint area expansion과 attention regulator가 discriminative part만 보는 문제를 줄인다.
- 세 개의 mainstream COD benchmarks에서 기존 weakly-supervised 방법을 큰 폭으로 앞선다.

## 초록

COD는 subtle differences와 ambiguous boundaries 때문에 모델뿐 아니라 annotator에게도 어렵습니다. 이 논문은 객체마다 한 점만 찍는 point supervision으로 COD를 수행하고, point를 reasonable hint area로 확장한 뒤 partial masking과 contrastive learning으로 객체 전역 표현을 안정화합니다.

## 서론

annotation cost를 낮추는 방법 중 point supervision은 가장 가벼운 축에 가깝습니다. 그래서 이 작업이 성립한다는 것 자체가 COD의 실용 범위를 넓혀 줍니다.

## 본론

저자들은 point label이 중심 부분만 강조하면서 객체 전체로 attention이 퍼지지 않는 문제를 중요하게 봅니다. 그래서 labeled region 일부를 가리는 방식으로 attention을 더 넓게 흩어지게 만들고, augmentation 기반 contrastive learning으로 feature stability를 보강합니다.

## 제안방법

핵심 구성은 adaptive hint area, attention regulator, unsupervised contrastive learning 세 가지입니다. supervision은 최소화하되 representation collapse는 막는 쪽에 설계가 맞춰져 있습니다.

## 실험

논문은 point-supervised setting에서도 weakly-supervised baselines보다 크게 앞서는 결과를 보여주며, annotation efficiency 대비 성능을 강하게 밀어줍니다.

### 메인 실험 결과

| 모델 | 감독 방식 | CAMO | COD10K | NC4K |
| --- | --- | --- | --- | --- |
| F3Net [38] | F | 0.109 0.711 0.741 0.564 | 0.051 0.739 0.795 0.544 | 0.069 0.782 0.825 0.706 |
| CSNet [15] | F | 0.092 0.771 0.795 0.641 | 0.047 0.778 0.809 0.569 | 0.061 0.819 0.845 0.748 |
| ITSD [45] | F | 0.102 0.750 0.779 0.610 | 0.051 0.767 0.808 0.557 | 0.064 0.811 0.845 0.729 |
| MINet [30] | F | 0.090 0.748 0.791 0.637 | 0.042 0.77 0.832 0.608 | - - - - |
| PraNet [11] | F | 0.094 0.769 0.825 0.663 | 0.045 0.789 0.861 0.629 | - - - - |
| UCNet [42] | F | 0.094 0.739 0.787 0.640 | 0.042 0.776 0.857 0.633 | 0.055 0.813 0.872 0.777 |
| SINet [9] | F | 0.092 0.745 0.804 0.644 | 0.043 0.776 0.864 0.631 | 0.058 0.808 0.871 0.723 |
| MGL-R [41] | F | 0.088 0.775 0.812 0.673 | 0.035 0.814 0.851 0.666 | 0.052 0.833 0.867 0.740 |
| PFNet [27] | F | 0.085 0.782 0.841 0.695 | 0.040 0.800 0.877 0.660 | 0.053 0.829 0.887 0.745 |
| UJSC [23] | F | 0.073 0.800 0.859 0.728 | 0.035 0.809 0.884 0.684 | 0.047 0.842 0.898 0.771 |
| UGTR [39] | F | 0.086 0.784 0.822 0.684 | 0.036 0.817 0.852 0.666 | 0.052 0.839 0.874 0.747 |
| ZoomNet [29] | F | 0.066 0.820 0.892 0.752 | 0.029 0.838 0.911 0.729 | 0.043 0.853 0.896 0.784 |
| DUSD [44] | U | 0.166 0.551 0.594 0.308 | 0.107 0.580 0.646 0.276 | - - - - |
| USPS [28] | U | 0.207 0.568 0.641 0.399 | 0.196 0.519 0.536 0.265 | - - - - |
| SAM [20] | U | 0.132 0.684 0.687 0.606 | 0.050 0.783 0.798 0.701 | 0.078 0.767 0.776 0.696 |
| SS [43] | S | 0.118 0.696 0.786 0.562 | 0.071 0.684 0.770 0.461 | - - - - |
| SCSOD [40] | S | 0.102 0.713 0.795 0.618 | 0.055 0.710 0.805 0.546 | - - - - |
| CRNet [19] | S | 0.092 0.735 0.815 0.641 | 0.049 0.733 0.832 0.576 | 0.063 0.775 0.855 0.688 |
| Ours | P | 0.074 0.798 0.872 0.727 | 0.042 0.784 0.859 0.650 | 0.051 0.822 0.889 0.748 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

이 논문은 COD에서 얼마나 적은 annotation으로 어디까지 갈 수 있는지를 보여주는 작업입니다. 실제 데이터 구축 비용을 생각하면 꽤 의미 있는 방향입니다.

## 논의

정밀한 경계가 중요한 COD에서 point supervision이 먹힌다는 점은 생각보다 큽니다. 이후 semi-supervised나 active labeling과도 자연스럽게 이어질 수 있어 보입니다.

## 출처
- 논문 페이지: https://eccv.ecva.net/virtual/2024/poster/2276
- 원문 PDF: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/05190.pdf
