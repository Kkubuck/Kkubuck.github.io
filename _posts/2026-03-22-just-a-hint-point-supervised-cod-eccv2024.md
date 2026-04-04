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

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| 세 개의 mainstream COD benchmarks | point supervision만으로도 여러 weakly-supervised baselines를 큰 폭으로 앞선다고 보고한다. |
| annotation efficiency | pixel-wise mask 대신 point만 사용해 supervision 비용을 크게 줄이면서도 usable performance를 유지한다. |

## 결론

이 논문은 COD에서 얼마나 적은 annotation으로 어디까지 갈 수 있는지를 보여주는 작업입니다. 실제 데이터 구축 비용을 생각하면 꽤 의미 있는 방향입니다.

## 논의

정밀한 경계가 중요한 COD에서 point supervision이 먹힌다는 점은 생각보다 큽니다. 이후 semi-supervised나 active labeling과도 자연스럽게 이어질 수 있어 보입니다.

## 출처
- 논문 페이지: https://eccv.ecva.net/virtual/2024/poster/2276
- 원문 PDF: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/05190.pdf
