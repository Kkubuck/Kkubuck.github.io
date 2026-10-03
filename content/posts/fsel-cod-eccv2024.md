---
title: 'FSEL: Frequency-Spatial Entanglement Learning for Camouflaged Object Detection'
description: 공간 영역만으로는 구분되지 않는 위장 객체를, 주파수 영역과 공간 영역의 표현을 서로 얽어 함께 학습해 찾는다.
pubDate: 2026-03-21 09:00:00 +0900
category: paper-review
tags: [cod, frequency, transformer]
takeaways:
  - 기존 방법은 복잡한 설계로 공간 특징의 판별력만 높이려 했고, 공간 특징의 민감성과 지역성 문제는 놓쳤다.
  - Entanglement Transformer Block이 주파수 셀프 어텐션으로 대역 사이의 관계를 보고, 얽힘 FFN으로 두 영역의 정보를 교환한다.
  - 세 데이터셋에서 21개 최신 방법보다 좋은 성능을 보였다.
paper:
  title: Frequency-Spatial Entanglement Learning for Camouflaged Object Detection
  authors: Yanguang Sun, Chunyan Xu, Jian Yang, Hanyu Xuan, Lei Luo
  venue: ECCV 2024
  year: 2024
  url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/1001_ECCV_2024_paper.php
  pdf: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/01001.pdf
  code: https://github.com/CSYSI/FSEL
---

## 문제

위장 객체는 공간 영역에서 주변과 너무 비슷해 찾기 어렵다. 기존 방법들은 복잡한 설계로 공간 특징의 판별력을 최대한 끌어올려 픽셀 유사도의 영향을 줄이려 했다. 하지만 공간 특징이 작은 변화에 **민감**하고 **지역적**이라는 점은 간과해, 결과가 최적에 미치지 못했다. FSEL은 주파수 영역과 공간 영역의 표현을 **함께** 탐색하는 방식으로 이 문제를 푼다.

## 방법

FSEL(Frequency-Spatial Entanglement Learning)은 세 가지 구성 요소로 이루어진다.

### Entanglement Transformer Block (ETB)

표현 학습을 맡는 블록으로, 여러 개를 쌓아 쓴다.

- **주파수 셀프 어텐션**: 서로 다른 주파수 대역 사이의 관계를 효과적으로 표현한다.
- **얽힘 피드포워드 네트워크**(entanglement FFN): 얽힘 학습으로 주파수 영역과 공간 영역 특징 사이의 정보 교환을 돕는다.

### Joint Domain Perception Module (JDPM)

두 영역의 특징으로 의미 정보를 강화한다.

### Dual-domain Reverse Parser (DRP)

주파수 영역과 공간 영역의 특징을 통합해 최종 예측을 만든다.

## 실험

널리 쓰이는 세 데이터셋에서 21개의 최신 방법과 정량·정성적으로 비교해 더 좋은 성능을 보였다.

## 정리

FDCOD가 주파수 정보를 추가 입력으로, FEDER가 웨이블릿 분해로 다뤘다면, FSEL은 트랜스포머 블록 안에서 **두 영역을 계속 섞으며** 학습한다는 점이 다르다. 주파수 기반 COD 연구의 흐름을 이 세 논문 순서로 읽으면 설계가 어떻게 바뀌어 왔는지 보인다.

주파수 변환을 블록마다 수행하는 만큼 계산 비용이 늘 수 있고, 어떤 대역이 실제로 위장 객체를 가르는 데 쓰였는지는 추가 분석이 있어야 알 수 있다.
