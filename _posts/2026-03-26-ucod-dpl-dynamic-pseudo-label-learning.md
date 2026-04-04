---
layout: "post"
title: "UCOD-DPL: Unsupervised Camouflaged Object Detection via Dynamic Pseudo-label Learning"
subtitle: "UCOD-DPL은 고정 pseudo-label 대신 teacher-student 동적 결합과 DBA decoder로 비지도 COD의 노이즈 문제를 줄인다."
summary: "UCOD-DPL은 고정 pseudo-label 대신 teacher-student 동적 결합과 DBA decoder로 비지도 COD의 노이즈 문제를 줄인다."
date: "2026-03-26 09:00:00 +0900"
slug: "ucod-dpl-dynamic-pseudo-label-learning"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "unsupervised"
  - "cvpr2025"
venue: "CVPR 2025"
source_url: "https://openaccess.thecvf.com/content/CVPR2025/html/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2025/papers/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.pdf"
---

## 오버뷰

UCOD-DPL은 기존 비지도 COD의 고정 pseudo-label 전략이 노이즈를 너무 많이 안고 간다고 본다. 그래서 teacher-student 구조 안에서 pseudo-label을 동적으로 섞고, 작은 객체와 foreground/background confusion을 더 잘 다루는 decoder를 붙인다.

## 핵심 주장

- 고정 pseudo-label은 잘못된 지식을 계속 강화하기 쉬워 비지도 COD의 큰 병목이 된다.
- Adaptive Pseudo-label Module, Dual-Branch Adversarial decoder, Look-Twice refinement가 이 문제를 줄인다.
- UCOS-DA23-DINOv2 baseline 대비 네 데이터셋 모두에서 Sm을 크게 높이고 M을 현저히 낮췄다.

## 초록

논문은 기존 UCOD가 고정 pseudo-label과 1×1 convolution decoder에 의존해 fully-supervised보다 성능이 크게 낮다고 본다. 이에 APM으로 pseudo-label을 동적으로 결합하고, DBA decoder로 서로 다른 segmentation objective를 adversarial하게 학습시키며, Look-Twice로 작은 객체를 두 번 살피는 구조를 제안한다.

## 서론

비지도 COD에서 가장 어려운 문제는 결국 noisy supervision이다. pseudo-label이 틀리면 모델은 그 오류를 반복해서 학습한다. UCOD-DPL은 pseudo-label 생성과 decoder 설계 둘 다 바꾸지 않으면 개선이 어렵다고 본다.

## 본론

이 논문은 pseudo-label을 단순한 사전 생성 결과물이 아니라, 학습 중 계속 갱신되고 혼합되는 supervision으로 취급한다. 여기에 adversarial decoder를 결합해 foreground/background confusion을 더 직접적으로 완화한다.

## 제안방법

APM은 고정 전략에서 나온 pseudo-label과 teacher prediction을 adaptive하게 결합한다. DBA decoder는 서로 다른 segmentation objective를 adversarial하게 학습해 위장 객체의 semantic feature를 더 강하게 끌어낸다. Look-Twice는 작은 객체를 확대해서 다시 보는 식으로 secondary refinement를 수행한다.

## 실험

대표 비교는 *UCOS-DA23-DINOv2와 OursDINOv2를 Sm, M 기준으로 보는 것이 가장 간단하다.

| 데이터셋 | UCOS-DA23-DINOv2 Sm↑ | OursDINOv2 Sm↑ | UCOS-DA23-DINOv2 M↓ | OursDINOv2 M↓ |
| --- | ---: | ---: | ---: | ---: |
| CHAMELEON | 0.750 | **0.864** | 0.091 | **0.031** |
| CAMO | 0.702 | **0.793** | 0.148 | **0.077** |
| COD10K | 0.655 | **0.834** | 0.120 | **0.031** |
| NC4K | 0.731 | **0.850** | 0.103 | **0.043** |

COD10K와 NC4K에서 개선 폭이 특히 크다. pseudo-label 노이즈를 dynamic mixing으로 다루는 전략이 실제로 매우 강하게 작동한 셈이다.

## 결론

UCOD-DPL은 비지도 COD에서 pseudo-label을 더 정교하게 다루는 것이 얼마나 중요한지를 잘 보여준다. fully-supervised 일부 방법을 넘는다는 초록의 주장도 어느 정도 납득할 만한 수치가 나온다.

## 논의

비지도 COD 논문을 빠르게 훑을 때 이 논문은 기준점으로 잡기 좋다. retrieval 계열인 RISE, EASE와는 조금 다른 방향이지만, noisy supervision을 다루는 방식이 분명하고 결과도 강하다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2025/html/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2025/papers/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.pdf
