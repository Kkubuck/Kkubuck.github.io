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

초록을 조금 더 풀어보면, 위장 개체 감지(COD)에서는 모델이 환경에 원활하게 숨어 있는 개체를 신속하고 정확하게 구별할 수 있어야 합니다. 미묘한 차이와 모호한 경계로 인해 COD는 모델뿐만 아니라 인간 주석자에게도 매우 어려운 작업이므로 픽셀 단위 주석을 제공하기 위해 엄청난 노력이 필요합니다. 무거운 주석 부담을 완화하기 위해 우리는 원포인트 감독의 도움으로 이 작업을 수행할 것을 제안합니다. 구체적으로, 각 객체를 신속하게 클릭함으로써 먼저 원래의 포인트 기반 주석을 적절한 힌트 영역으로 적응적으로 확장합니다.

## 서론

annotation cost를 낮추는 방법 중 point supervision은 가장 가벼운 축에 가깝습니다. 그래서 이 작업이 성립한다는 것 자체가 COD의 실용 범위를 넓혀 줍니다.

서론에서는 특히, 위장 개체 탐지(COD)는 환경에 조심스럽게 숨어 있는 위장 개체를 구별하는 것을 목표로 합니다[8-10, 29]. 최근에는 컴퓨터 비전 커뮤니티에서 점점 더 많은 연구 관심을 끌고 있으며 수색 및 구조, 종 발견, 의료 이미지 분석과 같은 귀중한 실제 응용 프로그램을 용이하게 합니다. 그러나 위장된 물체를 발견하는 것도 어렵기 때문에 H. 불행하게도 SOD에서 제안 영역을 생성하기 위해 앞서 언급한 모든 솔루션은 위장된 물체와 배경 사이의 낮은 대비와 모호한 가장자리로 인해 점 감독 COD에 적용할 수 없습니다(S.M.에 표시됨).

## 본론

저자들은 point label이 중심 부분만 강조하면서 객체 전체로 attention이 퍼지지 않는 문제를 중요하게 봅니다. 그래서 labeled region 일부를 가리는 방식으로 attention을 더 넓게 흩어지게 만들고, augmentation 기반 contrastive learning으로 feature stability를 보강합니다.

## 제안방법

핵심 구성은 adaptive hint area, attention regulator, unsupervised contrastive learning 세 가지입니다. supervision은 최소화하되 representation collapse는 막는 쪽에 설계가 맞춰져 있습니다.

방법을 조금 더 자세히 보면, 이 논문은 HaS 계열 아이디어처럼 강한 반응 영역 일부를 의도적으로 가려 attention이 객체 전체로 퍼지도록 유도합니다. 여기에 contrastive learning을 붙여 서로 다른 augmentation을 거친 샘플에서도 foreground representation이 크게 흔들리지 않도록 만들고, point-supervised setting에서 생기기 쉬운 중심점 편향을 줄입니다. 즉 supervision은 작게 유지하면서도 feature space 자체는 더 견고하게 만드는 방향으로 설계가 짜여 있습니다.

## 실험

논문은 point-supervised setting에서도 weakly-supervised baselines보다 크게 앞서는 결과를 보여주며, annotation efficiency 대비 성능을 강하게 밀어줍니다.

실험 파트를 조금 더 자세히 보면, 1에서 볼 수 있듯이, 우리의 방법은 최첨단 약 감독 COD 방법 CRNet과 비교하여 MAE의 경우 17.6%, Sm의 경우 7.2%, Em의 경우 4.7%, Fw β의 경우 11.7%의 평균 향상으로 상당한 개선을 달성합니다. 우리의 접근 방식은 여러 데이터 세트의 여러 지표에서 완전 감독 방법보다 성능이 뛰어납니다. 매개변수 복잡성이 낮고 계산 비용이 최소화된 우리 모델(25.44M 매개변수 및 10.22G MAC)은 까다로운 CAMO 데이터세트에서 완전 감독 SINet(48.95M 매개변수 및 19.42G MAC)보다 지속적으로 MAE의 경우 4.3%, Sm의 경우 2.1%, Em의 경우 4.0% 성능이 뛰어납니다. 10(보충 자료에 대한 더 많은 결과)은 낙서 라벨링을 활용하는 우리 모델이 최첨단 완전 감독 방법 ZoomNet에 비해 경쟁력 있는 결과를 달성한다는 것을 보여줍니다.

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
