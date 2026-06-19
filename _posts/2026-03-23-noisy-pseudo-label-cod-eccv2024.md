---
layout: "post"
title: "Learning Camouflaged Object Detection from Noisy Pseudo Label"
subtitle: "이 논문은 COD의 큰 비용인 pixel annotation 문제를 정면으로 다룹니다. 소량의 fully labeled data와 box prompt만으로도 괜찮은 pseudo label을 만들고, noisy pixels를 교정해 실용적인 반지도 COD를 밀어붙입니다."
summary: "이 논문은 COD의 큰 비용인 pixel annotation 문제를 정면으로 다룹니다. 소량의 fully labeled data와 box prompt만으로도 괜찮은 pseudo label을 만들고, noisy pixels를 교정해 실용적인 반지도 COD를 밀어붙입니다."
description: "이 논문은 COD의 큰 비용인 pixel annotation 문제를 정면으로 다룹니다. 소량의 fully labeled data와 box prompt만으로도 괜찮은 pseudo label을 만들고, noisy pixels를 교정해 실용적인 반지도 COD를 밀어붙입니다."
date: "2026-03-23 09:00:00 +0900"
slug: "noisy-pseudo-label-cod-eccv2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "semi-supervised"
  - "eccv2024"
venue: "ECCV 2024"
source_url: "https://eccv.ecva.net/virtual/2024/poster/2275"
pdf_url: "https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/00051.pdf"
---
## 오버뷰

이 논문은 COD의 큰 비용인 pixel annotation 문제를 정면으로 다룹니다. 소량의 fully labeled data와 box prompt만으로도 괜찮은 pseudo label을 만들고, noisy pixels를 교정해 실용적인 반지도 COD를 밀어붙입니다.

## 핵심 주장

- COD는 full mask supervision 의존도가 너무 높아 실제 확장성이 떨어진다.
- box prompt 기반 weakly semi-supervised setting에서도 noise correction loss로 pseudo label 오류를 줄일 수 있다.
- 20% fully labeled data만 써도 기존 방법보다 좋은 성능을 낸다.

## 초록

기존 COD는 대규모 pixel annotation에 크게 의존합니다. 저자들은 box prompt를 활용한 최초의 weakly semi-supervised COD 설정을 제안하고, noisy pseudo label이 학습 초반과 후반에 다른 방식으로 문제를 만든다는 점을 이용해 noise correction loss를 설계합니다.

초록을 조금 더 풀어보면, 기존의 위장 개체 탐지(COD) 방법은 시간이 많이 걸리고 노동 집약적인 대규모 픽셀 주석이 달린 훈련 세트에 크게 의존합니다. 약하게 지도되는 방법은 더 높은 주석 효율성을 제공하지만 위장된 이미지의 전경과 배경 사이의 시각적 경계가 불분명하기 때문에 성능이 훨씬 뒤떨어집니다. 본 논문에서는 위장된 장면에서 상자를 프롬프트로 사용할 수 있는 가능성을 탐구하고 완전히 레이블이 지정된 극히 제한된 수의 이미지를 사용하여 예산 효율적이고 고정밀 위장 개체 분할을 목표로 하는 최초의 약한 반감독 COD 방법을 소개합니다. 비판적으로, 이러한 제한된 세트에서 학습하면 필연적으로 심각한 노이즈 픽셀이 포함된 의사 레이블이 생성됩니다.

## 서론

이 논문이 중요한 이유는 supervision budget을 줄이는 문제를 COD 문맥에 맞게 풀었다는 점입니다. 위장 장면은 annotation 자체도 어렵기 때문에, 약한 supervision이 잘 먹히는지가 실제 활용성과 직결됩니다.

서론에서는 특히, 위장 물체 감지(COD)는 환경에 완벽하게 조화를 이루는 물체를 감지하고 분할하는 것을 목표로 하며, 정교한 위장 전술에 대응하고 물체와 주변 환경 간의 미묘한 차이를 구별해야 하기 때문에 중요한 과제를 제시합니다. 최근 COD의 발전은 풍부한 분할 라벨의 가용성에 힘입어 이루어졌습니다. 이러한 노력에도 불구하고 위장된 이미지의 전경과 배경 사이의 높은 유사성은 이러한 방법이 FSCOD(Fully Supervised COD) 방법의 성능보다 여전히 훨씬 뒤떨어져 있음을 의미합니다. 높은 본질적 유사성 및 불분명한 시각적 경계와 같은 위장된 이미지에서 COD 작업에 대한 고전적인 과제를 보여줍니다. 매우 적은 양의 데이터를 사용하는 노이즈 보정 손실 훈련 ANet은 전체 데이터 세트의 분포를 정확하게 캡처하는 데 어려움을 겪으며 생성된 의사 레이블에 심각한 위음성 및 양성 노이즈 픽셀이 발생합니다.

## 본론

핵심 관찰은 pseudo label의 noisy pixels가 학습 단계마다 위험한 방식이 다르다는 것입니다. 그래서 단순히 pseudo label을 필터링하는 것이 아니라, gradient 관점에서 noisy influence를 눌러주는 설계를 가져갑니다.

## 제안방법

이 방법은 적은 fully labeled sample과 box prompts로 pseudo labels를 만들고, noise correction loss로 early stage에는 clean pixels를 더 잘 배우고 memorization stage에는 noisy pixels가 지배하는 gradient를 교정합니다.

방법을 조금 더 자세히 보면, 이를 해결하기 위해 우리는 초기 학습 단계에서 모델의 올바른 픽셀 학습을 용이하게 하고, 기억 단계에서 노이즈 픽셀이 지배하는 오류 위험 기울기를 수정하여 궁극적으로 노이즈 라벨에서 위장된 개체를 정확하게 분할하는 노이즈 보정 손실을 제안합니다. 대신 기능은 백본 네트워크에서 ASPP로 직접 공급되고 FT를 통과한 후 디코더로 직접 이동됩니다. 3.2 위장된 객체 탐지를 위한 LNC 손실 MAE 손실이 제공하는 잡음 견고성과 IoU 및 CE 손실과 같은 손실의 최적화 기능을 활용하기 위해 WSSCOD 작업에서 잡음 보정 손실 LNC의 사용을 제안합니다. 모델의 경우: 기존 COD 방법의 선택 사례에 따라 SOTA 백본 네트워크 PVTv2-B4를 PNet용 인코더로 선택하여 방법의 효율성을 입증합니다.

## 실험

대표 포인트는 full annotation을 다 쓰지 않아도 성능 격차가 크게 줄어든다는 점입니다. 논문은 20% fully labeled setting에서도 강한 결과를 강조합니다.

실험 파트를 조금 더 자세히 보면, 5.2 SOTA 정량평가와의 성능 비교. 완전히 감독되는 SOTA 방법인 CamoFormer와 비교할 때 PNetF 20은 4개 데이터 세트에서 1% 미만의 차이로 비슷한 성능을 나타내며 주석 작업은 약 1/5만 필요합니다(단지 800개 이미지에 대한 픽셀 수준 주석). PNetF 20과 비교하여 PNet† F 20은 COD10K 및 NC4K 데이터 세트에서 4가지 지표에서 35%, 2.4%, 5.8%, 3.6%의 개선을 통해 뚜렷한 개선을 보여줍니다. 5.3 절제 실험 시각화 비교 우리와 SOTA 방법.

### 메인 실험 결과

| 모델 | 백본 | 학습 설정 | CAMO | CHAMELEON | COD10K | NC4K |
| --- | --- | --- | --- | --- | --- | --- |
| • PNetF1 | PVTv2-B4 | F 1% + B 99% | 0.051 0.922 0.835 0.852 | 0.038 0.921 0.812 0.847 | 0.031 0.903 0.745 0.828 | 0.037 0.926 0.831 0.864 |
| • PNetF5 | PVTv2-B4 | F 5% + B 95% | 0.050 0.924 0.845 0.857 | 0.032 0.943 0.821 0.865 | 0.027 0.921 0.771 0.845 | 0.034 0.934 0.844 0.874 |
| • PNetF10 | PVTv2-B4 | F 10% + B 90% | 0.048 0.925 0.841 0.861 | 0.028 0.949 0.830 0.878 | 0.024 0.927 0.782 0.855 | 0.032 0.937 0.848 0.880 |
| • PNetF20 | PVTv2-B4 | F 20% + B 80% | 0.043 0.934 0.856 0.872 | 0.024 0.954 0.861 0.892 | 0.023 0.932 0.792 0.860 | 0.031 0.940 0.857 0.885 |
| • PNet† F20 | PVTv2-B4 | F 20% + B 240% | 0.039 0.942 0.870 0.882 | 0.021 0.964 0.886 0.908 | 0.016 0.960 0.857 0.901 | 0.024 0.958 0.888 0.906 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

이 논문은 supervision 효율성이라는 현실적인 축을 COD 안으로 끌고 들어왔습니다. 데이터가 비싸다는 COD의 구조적 한계를 줄이는 방향이라는 점에서 의미가 큽니다.

## 논의

향후 COD가 더 넓은 장면으로 확장되려면 결국 label efficiency가 중요해집니다. 그런 흐름에서 이 논문은 꽤 실용적인 기준점입니다.

## 출처

- 논문 페이지: https://eccv.ecva.net/virtual/2024/poster/2275
- 원문 PDF: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/00051.pdf
