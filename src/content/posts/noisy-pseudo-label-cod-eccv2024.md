---
title: Learning Camouflaged Object Detection from Noisy Pseudo Label
description: 제한된 fully labeled data와 box-prompt pseudo labels를 결합하고, noise correction loss가 학습 단계에 따라 올바른 픽셀을 우선
  학습하고 noisy gradient를 수정한다.
summary: 제한된 fully labeled data와 box-prompt pseudo labels를 결합하고, noise correction loss가 학습 단계에 따라 올바른 픽셀을 우선 학습하고
  noisy gradient를 수정한다.
subtitle: 소수의 정밀 마스크와 box prompt로 만든 거친 pseudo label을 함께 쓰되, 학습 초반의 깨끗한 패턴과 후반의 noise memorization을 구분해 gradient를
  교정하는 weakly semi-supervised COD.
pubDate: 2026-03-23 09:00:00 +0900
slug: noisy-pseudo-label-cod-eccv2024
kind: paper
lang: ko
tags:
- paper
- weakly-semi-supervised
- pseudo-label
- label-noise
- eccv-2024
categories:
- papers
sourceUrl: https://eccv.ecva.net/virtual/2024/poster/2275
venue: ECCV 2024
paperYear: 2024
authors: Jin Zhang, Ruiheng Zhang, Yanjiao Shi, Zhe Cao, Nian Liu, Fahad Shahbaz Khan
reviewedOn: '2026-07-10'
pdfUrl: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/02275.pdf
takeaways:
- box prompt와 소수의 full mask를 조합해 annotation 예산과 정밀도를 절충한다.
- pseudo label noise를 고정 가중치로 무시하지 않고 early-learning과 memorization 단계의 gradient 특성으로 교정한다.
- noise pattern이 모델·prompt generator에 따라 바뀌면 동일한 correction 전략이 그대로 작동하지 않을 수 있다.
---

## box prompt는 싸지만 마스크는 거칠다

COD의 정밀 마스크는 비싸고, box는 상대적으로 빠르게 그릴 수 있다. 최근 promptable segmentation model을 사용하면 box에서 pseudo mask를 만들 수 있지만, 위장 장면에서는 객체와 배경 경계가 불분명해 심각한 noisy pixel이 남는다. 단순 self-training은 이 오류를 정답처럼 외운다.

이 논문은 극히 일부의 fully labeled image와 많은 box 기반 pseudo label을 함께 쓰는 **weakly semi-supervised** 설정을 제안한다. 핵심은 pseudo label을 더 멋지게 만드는 것보다, noise가 있는 상태에서 모델의 학습 dynamics를 제어하는 데 있다.

## 모델은 먼저 쉬운 패턴을 배운다

deep network는 보통 학습 초기에 데이터의 공통적이고 비교적 깨끗한 패턴을 먼저 맞추고, 시간이 지나면 label noise까지 memorization하는 경향이 있다. 논문은 이 특성을 COD의 pixel noise 교정에 이용한다.

초반에는 신뢰할 수 있는 픽셀에서 올바른 foreground–background 구분을 배우도록 하고, 후반에는 잘못된 pseudo pixel이 만드는 risk gradient가 전체 업데이트를 지배하지 못하게 수정한다. 같은 loss weight를 처음부터 끝까지 쓰지 않고 학습 단계에 따라 noise의 영향을 다르게 본다.

## noise correction loss

제안 loss는 초기의 clean-pattern learning을 촉진하고, memorization stage에서 noisy gradient의 방향과 크기를 교정한다. 객체 내부에 생긴 false negative, box 안 배경이 포함된 false positive가 서로 다른 오류를 만들기 때문에 픽셀 confidence와 학습 상태를 함께 고려한다.

소수의 full mask는 anchor 역할을 한다. pseudo label만으로는 모델이 자신의 오류를 기준으로 다시 학습할 수 있지만, 깨끗한 supervision이 decision boundary를 고정해 correction이 어디로 향해야 하는지 알려 준다.

## 20% 라벨 결과를 읽는 법

논문은 fully labeled data의 일부만 사용한 조건에서 기존 weakly supervised 및 semi-supervised 방법과 비교하고, 20% full label 설정에서 경쟁력 있는 결과를 보고한다. 여기서 “20%”만 보면 안 된다. 나머지 이미지에 box annotation이 필요한지, box를 누가 만들었는지, pseudo label generator가 어떤 pretrained model인지까지 annotation budget에 포함해야 한다.

절제 실험에서는 일반 BCE, confidence threshold, 기존 noise-robust loss와 비교해 제안 correction이 COD 특유의 ambiguous boundary에서 실제로 나은지 확인해야 한다. 데이터 비율을 5%, 10%, 20%로 바꿨을 때의 안정성도 중요하다.

## 의미 있는 전환

이 연구는 weak supervision을 단순 annotation 형태의 문제가 아니라 **학습 과정에서 noise가 언제 지배하는가**의 문제로 본다. pseudo label이 완벽해질 때까지 기다리지 않고, 불완전한 신호를 견디는 optimizer-level 전략을 설계한다.

SAM 같은 모델이 더 좋아져도 전문 도메인의 pseudo mask는 계속 오류를 낸다. 따라서 label generation과 noise-aware learning을 분리해 개선할 수 있다는 점은 오래 남는 아이디어다.

## 한계

small-loss 또는 confidence가 항상 clean pixel을 의미하지 않는다. 모델이 쉽게 외우는 배경 편향은 초반부터 높은 신뢰를 가질 수 있고, 매우 어려운 진짜 객체 경계는 계속 낮은 confidence로 배제될 수 있다. pseudo label generator나 데이터셋이 바뀌면 noise 분포도 변한다. 다양한 prompt source와 domain shift에서 correction rule이 유지되는지 검증해야 한다.
