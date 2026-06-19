---
layout: "post"
title: "Simultaneously Localize, Segment and Rank the Camouflaged Objects"
subtitle: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
summary: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
description: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
date: "2026-03-06 09:00:00 +0900"
slug: "rank-camouflaged-objects-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "ranking"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf"
---
## 오버뷰

이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다.

## 핵심 주장

- camouflaged object는 보이는 정도가 다르므로 ranking까지 포함해야 해석력이 좋아진다.
- 특정 part가 object를 더 눈에 띄게 만든다는 관찰이 localization 모델 설계로 이어진다.
- 대형 COD testing set을 함께 제공해 generalization 평가를 강화한다.

## 초록

저자들은 camouflage conspicuousness를 명시적으로 모델링하면 COD를 더 잘 이해할 수 있다고 주장합니다. 그래서 localization model, segmentation model, ranking model을 함께 둬서 객체 위치, 전체 mask, detectability를 동시에 추론합니다.

초록을 조금 더 풀어보면, 위장은 생존에 중요한 종 전체의 주요 방어 메커니즘입니다. 위장의 일반적인 전략에는 배경 일치, 환경의 색상과 패턴 모방, 파괴적인 색상, 신체 윤곽 위장 등이 포함됩니다. 위장 객체 감지(COD)는 주변에 숨어 있는 위장 객체를 분할하는 것을 목표로 합니다. 기존 COD 모델은 위장 수준을 표시하지 않고 위장된 개체를 분할하기 위해 이진 지상 진실을 기반으로 구축되었습니다.

## 서론

많은 COD 논문이 segmentation score에만 집중하지만, 실제로는 어떤 객체는 조금만 봐도 드러나고 어떤 객체는 거의 보이지 않습니다. 이 논문은 그 차이를 모델에 넣습니다.

서론에서는 특히, 위장은 먹이가 포식자에게 인식되는 것을 방지하는 가장 중요한 포식자 방지 방어 수단 중 하나입니다. 위장하기 위해 먹이 사이에서 두 가지 주요 전략, 즉 배경 일치와 파괴적인 착색이 널리 사용되었습니다. 기존 이진 실측 기반 모델과 달리 인스턴스 수준 순위 기반 위장 객체 예측을 생성할 수 있으며 이는 인간이 위장 객체를 관찰하기가 전체적으로 어렵다는 것을 나타냅니다. 3) 위장된 객체의 위치 파악, 분할 및 순위 지정을 동시에 수행하는 삼중 작업 학습 모델을 제안합니다.

## 본론

ranking이라는 축이 들어가면서, COD는 단순 pixel classification이 아니라 camouflage strength estimation 문제로도 읽히게 됩니다. 이 관점이 이후 dataset discussion에도 영향을 줍니다.

## 제안방법

localization branch가 discriminative region을 찾고, segmentation branch가 full object mask를 예측하며, ranking branch가 detectability를 추정합니다. 세 branch가 함께 camouflage understanding을 구성합니다.

방법을 조금 더 자세히 보면, 새로운 데이터 세트를 사용한 모델 설계: 새로운 데이터 세트를 기반으로 위장된 개체의 위치 파악, 분할 및 순위 지정을 동시에 제안합니다. 제안된 "Fixation Decoder" 모듈을 사용하여 판별 영역을 얻습니다. 이 영역은 제공된 Ground Truth 고정 맵과 비교되어 고정 분기에 대한 손실 함수를 생성합니다. 목적 함수: 공동 학습 프레임워크에는 식별 영역 위치 파악 손실과 위장된 개체 감지 손실이라는 두 가지 손실 함수가 있습니다. FPN에서 생성된 기능을 사용하면 ROIAlign 모듈을 사용하여 ROI의 기능 맵을 추출합니다.

## 실험

실험에서는 새로운 large COD testing set과 함께, 단순 segmentation score뿐 아니라 interpretability 측면의 이점을 강조합니다.

실험 파트를 조금 더 자세히 보면, 또한 성능을 벤치마크 모델과 비교하기 위해 COD10K의 3,040개 이미지와 CAMO의 1,000개 이미지가 포함된 기존 교육 데이터 세트를 사용하여 단일 위장 개체 감지 모델(우리의 cod full)을 추가로 교육하고 CAMO, COD10K, CHAMELEMON 및 NC4K 테스트 데이터 세트를 포함한 기존 테스트 데이터 세트에서 테스트합니다. 위의 4가지 평가 지표로는 순위 기반 예측의 성능을 평가할 수 없음을 확인했습니다. SIM ↑CC ↑EMD ↓KLD ↓NSS ↑AUC J ↑AUC B ↑sAUC ↑ 0.622 0.776 3.361 0.995 2.608 0.901 0.844 0.658 MAE rMAE 당사 순위 신규 0.049 0.139 SOLOv2 0.049 0.210 MS-RCNN 0.053 0.142 RSDNet 0.074 0.293 위장된 객체 감지 데이터 세트에 대한 객체 감지 모델을 사용하고 이를 경쟁 방법으로 처리합니다. 5는 순위 데이터 세트를 사용하여 훈련되었습니다.

### 메인 실험 결과

Table 1. Performance of baseline models trained with CAM-FR on benchmark testing sets.

| 모델 | CAMO (Sα↑ Fmeanβ↑ Emeanξ↑ M↓) | CHAMELEON (Sα↑ Fmeanβ↑ Emeanξ↑ M↓) | COD10K (Sα↑ Fmeanβ↑ Emeanξ↑ M↓) | NC4K (Sα↑ Fmeanβ↑ Emeanξ↑ M↓) |
| --- | --- | --- | --- | --- |
| SCRN [55] | 0.702 0.632 0.731 0.106 | 0.822 0.726 0.833 0.060 | 0.756 0.623 0.793 0.052 | 0.793 0.729 0.823 0.068 |
| CSNet[14] | 0.704 0.633 0.753 0.106 | 0.819 0.759 0.859 0.051 | 0.745 0.615 0.808 0.048 | 0.785 0.729 0.834 0.065 |
| UCNet [63] | 0.703 0.640 0.740 0.107 | 0.833 0.781 0.890 0.049 | 0.756 0.650 0.823 0.047 | 0.792 0.751 0.854 0.065 |
| BASNet [38] | 0.644 0.578 0.588 0.143 | 0.761 0.657 0.797 0.080 | 0.640 0.579 0.713 0.072 | 0.724 0.648 0.780 0.089 |
| SINet [10] | 0.697 0.579 0.693 0.130 | 0.820 0.731 0.835 0.069 | 0.733 0.588 0.768 0.069 | 0.779 0.696 0.800 0.086 |
| Ours cod new | 0.708 0.645 0.755 0.105 | 0.842 0.794 0.896 0.046 | 0.760 0.658 0.831 0.045 | 0.797 0.758 0.854 0.061 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

이 논문은 COD를 더 해석 가능하게 만들려는 초창기 중요한 시도입니다.

## 논의

지금 benchmark 글을 읽을 때도 이 논문이 자주 떠오르는 이유는, 단순 점수보다 camouflage 강도 자체를 보려는 관점을 줬기 때문입니다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf
