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

## 서론

이 논문이 중요한 이유는 supervision budget을 줄이는 문제를 COD 문맥에 맞게 풀었다는 점입니다. 위장 장면은 annotation 자체도 어렵기 때문에, 약한 supervision이 잘 먹히는지가 실제 활용성과 직결됩니다.

## 본론

핵심 관찰은 pseudo label의 noisy pixels가 학습 단계마다 위험한 방식이 다르다는 것입니다. 그래서 단순히 pseudo label을 필터링하는 것이 아니라, gradient 관점에서 noisy influence를 눌러주는 설계를 가져갑니다.

## 제안방법

이 방법은 적은 fully labeled sample과 box prompts로 pseudo labels를 만들고, noise correction loss로 early stage에는 clean pixels를 더 잘 배우고 memorization stage에는 noisy pixels가 지배하는 gradient를 교정합니다.

## 실험

대표 포인트는 full annotation을 다 쓰지 않아도 성능 격차가 크게 줄어든다는 점입니다. 논문은 20% fully labeled setting에서도 강한 결과를 강조합니다.

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
