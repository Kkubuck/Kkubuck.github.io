---
layout: "post"
title: "UCOD-DPL: Unsupervised Camouflaged Object Detection via Dynamic Pseudo-label Learning"
subtitle: "UCOD-DPL은 고정 pseudo-label 대신 teacher-student 동적 결합과 DBA decoder로 비지도 COD의 노이즈 문제를 줄인다."
summary: "UCOD-DPL은 고정 pseudo-label 대신 teacher-student 동적 결합과 DBA decoder로 비지도 COD의 노이즈 문제를 줄인다."
description: "UCOD-DPL은 고정 pseudo-label 대신 teacher-student 동적 결합과 DBA decoder로 비지도 COD의 노이즈 문제를 줄인다."
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

초록을 조금 더 풀어보면, UCOD(Unsupervised Camoflaged ObjectDetection)는 광범위한 픽셀 수준 레이블에 의존할 필요가 없기 때문에 주목을 받았습니다. 기존 UCOD 방법은 일반적으로 고정 전략을 사용하여 의사 레이블을 생성하고 1×1 컨벌루션 레이어를 간단한 디코더로 학습하므로 완전 감독 방법에 비해 성능이 낮습니다. 우리는 이러한 접근법의 두 가지 단점을 강조합니다: 1). 모델은 상당한 노이즈가 포함된 의사 라벨로 인해 잘못된 지식을 적합하기 쉽습니다.

## 서론

비지도 COD에서 가장 어려운 문제는 결국 noisy supervision이다. pseudo-label이 틀리면 모델은 그 오류를 반복해서 학습한다. UCOD-DPL은 pseudo-label 생성과 decoder 설계 둘 다 바꾸지 않으면 개선이 어렵다고 본다.

서론에서는 특히, "위장"은 "포식자"를 피하기 위해 비슷한 질감과 색상을 사용하여 주변 환경에 섞이는 물체의 자연스러운 행동에서 비롯됩니다. 위장된 객체 감지(COD)는 배경에 시각적으로 숨겨진 객체를 분할하는 방법을 학습하는 것을 목표로 하는 도전적인 의미론적 분할 작업으로, 여러 중요한 분야에 중요한 응용 프로그램이 있습니다. 그러나 복잡한 시각적 속성으로 인해 위장된 개체에 대한 픽셀 수준의 인간 라벨을 얻는 것은 어렵습니다. 결과는 우리의 방법이 DINOv2를 백본으로 사용할 때 완전히 감독된 일부 COD 방법과 비교할 수 있는 뛰어난 성능을 달성한다는 것을 보여줍니다.

## 본론

이 논문은 pseudo-label을 단순한 사전 생성 결과물이 아니라, 학습 중 계속 갱신되고 혼합되는 supervision으로 취급한다. 여기에 adversarial decoder를 결합해 foreground/background confusion을 더 직접적으로 완화한다.

## 제안방법

APM은 고정 전략에서 나온 pseudo-label과 teacher prediction을 adaptive하게 결합한다. DBA decoder는 서로 다른 segmentation objective를 adversarial하게 학습해 위장 객체의 semantic feature를 더 강하게 끌어낸다. Look-Twice는 작은 객체를 확대해서 다시 보는 식으로 secondary refinement를 수행한다.

방법을 조금 더 자세히 보면, 3에는 APM(Adaptive Pseudo-label Mixing) 모듈, DBA(Dual-Branch Adversarial) 디코더 및 Look-Twice 전략을 갖춘 교사-학생 프레임워크가 포함되어 있습니다. 적응형 의사 라벨 병합 모듈 기존의 비지도 의미론적 분할 방법은 일반적으로 고정 전략(예: 유사성 비교)을 채택하거나 분할 마스크를 생성하기 위해 자가 지도 학습을 위한 이중 분기 모델(예: 고정 전략 또는 학습 가능한 분기) 구조를 활용합니다. Dual-Branch Adversarial Decoder 이전 방법에서는 일반적으로 간단한 1×1 컨볼루션으로 예측이 생성되므로 위장 기능을 철저하게 캡처하는 기능이 제한됩니다. 우리는 이 작업의 정확성과 견고성을 향상시키기 위해 Dual-Branch Adversarial 디코더를 제안합니다.

## 실험

대표 비교는 *UCOS-DA23-DINOv2와 OursDINOv2를 Sm, M 기준으로 보는 것이 가장 간단하다.

실험 파트를 조금 더 자세히 보면, 결과는 우리 모델이 모든 측정항목과 데이터 세트에서 기존의 모든 USS 및 UCOD 방법보다 성능이 뛰어나 SOTA(최첨단 기술) 성능을 달성했음을 보여줍니다. 절제 연구 방법의 효율성을 검증하기 위해 DINOv2를 백본으로 사용하고 2,026개의 이미지가 포함된 COD10K-Test 데이터 세트에 대한 포괄적인 절제 연구를 수행합니다. 우리는 교체된 고정 전략으로 모델을 재교육하고 COD10K-Test 데이터 세트에서 벤치마킹했습니다. 혼합 전략에 관한 연구. 우리는 테스트 세트를 2% 간격으로 테스트 세트 전망의 비율로 나눈 다음, 우리 방법과 일부 이전 SOTA 방법 간의 성능을 벤치마킹했습니다.

## 결론

UCOD-DPL은 비지도 COD에서 pseudo-label을 더 정교하게 다루는 것이 얼마나 중요한지를 잘 보여준다. fully-supervised 일부 방법을 넘는다는 초록의 주장도 어느 정도 납득할 만한 수치가 나온다.

## 논의

비지도 COD 논문을 빠르게 훑을 때 이 논문은 기준점으로 잡기 좋다. retrieval 계열인 RISE, EASE와는 조금 다른 방향이지만, noisy supervision을 다루는 방식이 분명하고 결과도 강하다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2025/html/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2025/papers/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.pdf
