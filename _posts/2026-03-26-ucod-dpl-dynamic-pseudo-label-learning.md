---
layout: post
title: 'UCOD-DPL: Unsupervised Camouflaged Object Detection via Dynamic Pseudo-label Learning'
subtitle: 고정 pseudo label을 그대로 외우지 않도록 teacher 예측과 동적으로 섞고, foreground–background 혼동과 작은 객체를 각각 adversarial decoder와 재관찰 단계로
  보완한 UCOD 프레임워크.
summary: UCOD-DPL은 teacher–student 구조 안에서 Adaptive Pseudo-label Module, Dual-Branch Adversarial decoder, Look-Twice refinement를
  결합한다.
description: UCOD-DPL은 teacher–student 구조 안에서 Adaptive Pseudo-label Module, Dual-Branch Adversarial decoder, Look-Twice refinement를
  결합한다.
date: 2026-03-26 09:00:00 +0900
slug: ucod-dpl-dynamic-pseudo-label-learning
lang: ko
paper: true
categories:
- papers
tags:
- paper
- unsupervised-cod
- pseudo-label
- teacher-student
- cvpr-2025
venue: CVPR 2025
paper_year: 2025
paper_authors: Weiqi Yan, Lvhai Chen, Huaijia Kou, Shengchuan Zhang, Yan Zhang, Liujuan Cao
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2025/html/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2025/papers/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.pdf
code_url: https://github.com/Heartfirey/UCOD-DPL
takeaways:
- 고정 규칙의 pseudo label과 teacher prediction을 학습 상태에 따라 섞어 self-correction 여지를 남긴다.
- DBA decoder는 서로 다른 segmentation objective를 adversarial하게 학습하고 Look-Twice는 작은 객체를 한 번 더 정제한다.
- 무감독이라는 이름과 별개로 pretrained model·초기 pseudo-label strategy가 제공하는 외부 지식과 편향을 명시해야 한다.
---

## UCOD의 병목은 pseudo label 이후에 시작된다

pixel annotation 없이 COD를 학습하려면 먼저 어떤 방식으로든 foreground 후보를 만들어야 한다. 기존 UCOD는 handcrafted cue나 pretrained model에서 만든 pseudo label을 고정한 뒤, 얕은 1×1 convolution decoder를 학습하는 경우가 많았다. 문제는 위장 장면의 pseudo mask에 경계 누락과 배경 혼입이 매우 많다는 점이다.

UCOD-DPL은 두 약점을 함께 다룬다. pseudo label을 학습 내내 갱신해 잘못된 지식을 외우는 것을 줄이고, 단순 decoder 대신 위장 객체의 semantic과 작은 구조를 복원할 수 있는 경로를 만든다.

## Adaptive Pseudo-label Module

**APM**은 고정 전략으로 만든 초기 pseudo label과 teacher model의 현재 예측을 adaptive하게 결합한다. 초기에는 teacher가 불안정하므로 외부 규칙의 신호가 기준점이 되고, 학습이 진행되면 teacher가 데이터에서 배운 정보를 더 반영해 잘못된 초기 mask를 고칠 수 있다.

한쪽만 신뢰하지 않는 것이 중요하다. 고정 label만 쓰면 오류가 영구히 남고, teacher prediction만 쓰면 student와 같은 편향이 순환 강화된다. 두 source의 동적 균형은 안정성과 self-correction 사이의 절충이다.

## Dual-Branch Adversarial decoder

위장 객체의 전경·배경 특징은 매우 비슷해 하나의 segmentation objective만으로는 결정 경계가 쉽게 흐려진다. **DBA decoder**는 서로 다른 목표를 가진 두 branch를 adversarial하게 학습해, 한 branch가 놓치는 구분 단서를 다른 branch가 드러내도록 한다.

여기서 adversarial은 이미지 생성이 아니라 segmentation representation 사이의 긴장을 만드는 장치다. 두 예측이 무조건 같아지게 하는 consistency보다, 서로 다른 관점으로 어려운 픽셀을 밀어내면서 최종 마스크에서 합의하게 한다.

## Look-Twice

저해상도 pseudo label은 작은 객체를 통째로 놓치기 쉽다. Look-Twice는 첫 예측에서 관심 영역을 찾고 작은 객체를 확대해 두 번째 refinement를 수행한다. 전체 이미지를 고해상도로 처리하지 않으면서 어려운 영역에 계산을 더 배분한다는 점에서 SegMaR의 재관찰 아이디어와 닿아 있다.

다만 첫 번째 관찰에서 객체 후보가 완전히 사라지면 두 번째 단계도 복구할 수 없다. small-object recall을 얼마나 유지하는지가 구조의 실제 성패를 좌우한다.

## 결과를 읽는 기준

논문은 표준 네 COD test set에서 unsupervised 방법을 비교하고 일부 fully supervised 모델보다 높은 결과를 보고한다. 이 비교는 흥미롭지만 supervision budget을 동일하게 봐야 한다. 초기 pseudo label에 사용한 pretrained network, foundation model, 외부 데이터가 무엇인지가 결과에 큰 영향을 준다.

절제 실험에서는 고정 label, teacher-only, adaptive mixing을 나눠 APM의 효과를 확인하고, DBA와 Look-Twice가 각각 boundary confusion과 작은 객체에서 실제로 기여하는지 봐야 한다. 평균 지표만으로는 두 모듈의 역할이 분리되지 않는다.

## 남는 질문

teacher–student는 confirmation bias를 완전히 없애지 못한다. 두 label source가 같은 배경 편향을 공유하면 adaptive mixing도 틀린 합의를 만들 수 있다. pseudo label 품질을 GT 없이 어떻게 추정하는지, 다른 초기화 전략에서도 성능이 유지되는지, 반복 refinement의 비용이 fully supervised baseline보다 합리적인지가 후속 평가 포인트다.
