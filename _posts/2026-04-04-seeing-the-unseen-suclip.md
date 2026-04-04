---
layout: "post"
title: "Seeing the Unseen: A Semantic Alignment and Context-Aware Prompt Framework"
subtitle: "SuCLIP은 개방어휘 위장 객체 분할에서 텍스트-비전 정렬을 다시 맞춰 OVCoser보다 안정적으로 성능을 끌어올린다."
summary: "SuCLIP은 개방어휘 위장 객체 분할에서 텍스트-비전 정렬을 다시 맞춰 OVCoser보다 안정적으로 성능을 끌어올린다."
description: "SuCLIP은 개방어휘 위장 객체 분할에서 텍스트-비전 정렬을 다시 맞춰 OVCoser보다 안정적으로 성능을 끌어올린다."
date: "2026-04-04 09:00:00 +0900"
slug: "seeing-the-unseen-suclip"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "ovcos"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.pdf"
---

## 오버뷰

이 논문은 일반적인 개방어휘 분할이 위장 장면에서 특히 약해지는 이유를 텍스트-비전 의미 정렬의 붕괴로 설명합니다. 텍스트 설명이 있어도 객체가 배경에 묻혀 있으면 클래스 시프트와 불완전 분할이 쉽게 생기는데, SuCLIP은 이 문제를 정면으로 다룹니다.

## 핵심 주장

- 위장 장면에서는 텍스트 프롬프트만 강화해서는 부족하고, 시각 특징과 텍스트 의미를 함께 재정렬해야 한다.
- SuCLIP은 context-aware prompt, class-aware feature selection, semantic consistency loss를 결합해 OVCamo에서 OVCoser보다 모든 주요 지표를 개선했다.
- 개방어휘 위장 객체 분할의 병목은 단순한 backbone 성능이 아니라 의미 공간 정렬 문제라는 점을 분명히 보여준다.

## 초록

논문은 Open-Vocabulary Camouflaged Object Segmentation(OVCOS)을 대상으로 한다. 기존 open-vocabulary segmentation 기법은 일반 장면에서는 강하지만, 위장 장면에서는 텍스트와 시각 특징이 엇갈리면서 객체 일부만 잘리거나 다른 클래스로 밀리는 문제가 크다. 저자들은 이를 줄이기 위해 SuCLIP이라는 프레임워크를 제안한다.

## 서론

OVCOS는 텍스트 설명으로 어떤 범주의 위장 객체든 분할할 수 있어야 한다는 점에서 기존 COD보다 더 어렵다. 단순히 위장 객체를 찾는 것뿐 아니라, 텍스트가 가리키는 대상과 실제 픽셀 영역을 정확히 맞춰야 하기 때문이다. 저자들은 기존 방법이 위장 장면의 semantic confusion을 충분히 다루지 못한다고 본다.

## 본론

논문의 핵심은 텍스트 프롬프트를 더 풍부하게 만들고, 동시에 시각 특징 쪽도 그 프롬프트에 맞게 재정렬해야 한다는 주장이다. 즉 프롬프트 강화와 feature selection, 그리고 loss 설계가 따로 놀면 안 되고 하나의 정렬 문제로 봐야 한다는 관점이다.

## 제안방법

SuCLIP은 세 가지 축으로 구성된다. 첫째, context-aware prompt scheme이 CLIP visual encoder 내부 지식을 활용해 텍스트 프롬프트를 장면 문맥에 맞게 보강한다. 둘째, class-aware feature selection module이 텍스트와 시각 임베딩이 더 잘 맞도록 동적으로 조정한다. 셋째, semantic consistency loss와 text query decoder를 통해 텍스트 의미가 실제 픽셀 단위 분할 결과까지 일관되게 이어지도록 만든다.

## 실험

대표 비교는 OVCamo에서 OVCoser와의 정면 비교다. 지표는 논문 표에 맞춰 cSm, cFωβ, cMAE, cFβ, cEm, cIoU를 그대로 적었다.

| 모델 | cSm↑ | cFωβ↑ | cMAE↓ | cFβ↑ | cEm↑ | cIoU↑ |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| OVCoser | 0.579 | 0.490 | 0.336 | 0.520 | 0.616 | 0.443 |
| SuCLIP | **0.667** | **0.594** | **0.242** | **0.633** | **0.722** | **0.540** |

표만 봐도 SuCLIP은 정확도 계열 지표를 전반적으로 끌어올리면서 오류에 해당하는 cMAE는 더 낮춘다. 위장 장면에서 텍스트-비전 정렬을 다시 맞추는 전략이 실제 성능 향상으로 이어졌다는 점이 분명하다.

## 결론

SuCLIP은 OVCOS에서 중요한 문제를 backbone 크기 경쟁이 아니라 의미 정렬 문제로 다시 정의한다. 그리고 그 정의가 실험 결과와도 잘 맞는다.

## 논의

이 논문의 장점은 문제 설정이 분명하다는 점이다. 위장 객체가 어려운 이유를 단순히 경계가 흐리기 때문이라고만 보지 않고, 텍스트 조건과 시각 특징이 서로 어긋나는 구조적 문제로 설명한다. 앞으로 open-vocabulary 기반 위장 분할을 본다면, 이 논문은 baseline이라기보다 관점을 정리해 주는 기준점에 가깝다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.pdf
