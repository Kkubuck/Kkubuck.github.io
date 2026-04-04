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

초록을 조금 더 풀어보면, OVCOS(Open-Vocabulary Camouflaged Object Segmentation)는 텍스트 설명을 기반으로 모든 카테고리의 위장 개체를 분할하는 것을 목표로 합니다. 기존의 개방형 어휘 방법은 강력한 분할 기능을 나타냄에도 불구하고 위장된 시나리오에서는 여전히 주요 제한 사항을 가지고 있습니다. 의미 혼란으로 인해 불완전한 분할과 모델의 클래스 이동이 발생합니다. 위의 제한을 완화하기 위해 우리는 SuCLIP이라는 OVCOS용 프레임워크를 제안합니다. 구체적으로, 우리는 CLIP 시각적 인코더의 내부 지식을 활용하여 텍스트 프롬프트를 풍부하게 하고 이를 로컬 시각적 기능과 정렬하여 텍스트 프롬프트를 향상시키는 상황 인식 프롬프트 구성표를 설계합니다.

## 서론

OVCOS는 텍스트 설명으로 어떤 범주의 위장 객체든 분할할 수 있어야 한다는 점에서 기존 COD보다 더 어렵다. 단순히 위장 객체를 찾는 것뿐 아니라, 텍스트가 가리키는 대상과 실제 픽셀 영역을 정확히 맞춰야 하기 때문이다. 저자들은 기존 방법이 위장 장면의 semantic confusion을 충분히 다루지 못한다고 본다.

서론에서는 특히, 기존 open-vocabulary segmentation이 일반 장면에서는 강하지만 위장 장면에서는 텍스트 의미와 시각 증거가 쉽게 어긋난다고 설명합니다. 물체와 배경이 비슷하면 모델이 일부 영역만 분할하거나 아예 다른 클래스로 이동하는 class shift가 자주 발생하고, 이 때문에 단순한 텍스트 프롬프트 강화만으로는 충분하지 않습니다. 저자들은 결국 로컬 시각 특징과 텍스트 프롬프트를 함께 재정렬하는 방향이 필요하다고 문제를 정리합니다.

## 본론

논문의 핵심은 텍스트 프롬프트를 더 풍부하게 만들고, 동시에 시각 특징 쪽도 그 프롬프트에 맞게 재정렬해야 한다는 주장이다. 즉 프롬프트 강화와 feature selection, 그리고 loss 설계가 따로 놀면 안 되고 하나의 정렬 문제로 봐야 한다는 관점이다.

## 제안방법

SuCLIP은 세 가지 축으로 구성된다. 첫째, context-aware prompt scheme이 CLIP visual encoder 내부 지식을 활용해 텍스트 프롬프트를 장면 문맥에 맞게 보강한다. 둘째, class-aware feature selection module이 텍스트와 시각 임베딩이 더 잘 맞도록 동적으로 조정한다. 셋째, semantic consistency loss와 text query decoder를 통해 텍스트 의미가 실제 픽셀 단위 분할 결과까지 일관되게 이어지도록 만든다.

방법을 조금 더 자세히 보면, 그 후, CAFS 모듈은 가장 클래스와 관련된 텍스트 및 시각적 기능을 동적으로 선택하는 데 사용됩니다. 이를 위해 우리는 시각적 인코더 분기의 로컬 시각적 특징을 학습 가능한 텍스트 프롬프트에 주입하고 텍스트 프롬프트를 로컬 이미지 컨텍스트에 맞춰 보다 강력한 텍스트 프롬프트를 생성하는 것이 핵심 아이디어인 CAP를 설계합니다. 따라서 우리는 텍스트와 시각적 임베딩을 추가로 조정하고 모델이 완전한 의미 엔터티를 얻을 수 있도록 의미 일관성 손실 Lsc를 도입하기 위해 CAFS 모듈을 설계했습니다. 실제로 CAM의 시각적 집계 기능 Fagg와 텍스트 임베딩 Ft는 동일한 차원에 매핑됩니다. 따라서 우리는 이 문제를 완화하기 위해 손실 Lsc를 추가로 제안합니다.

## 실험

대표 비교는 OVCamo에서 OVCoser와의 정면 비교다. 지표는 논문 표에 맞춰 cSm, cFωβ, cMAE, cFβ, cEm, cIoU를 그대로 적었다.

실험 파트를 조금 더 자세히 보면, 최첨단 정량평가와 비교. 일부 SOTA 방법과 비교하여 우리의 방법은 탁월한 성능을 달성합니다. 구체적으로, 우리의 방법은 최첨단 방법 OVCoser와 비교할 때 cSm, cFΩ β, cMAE, cFβ, cEm, cIoU 메트릭을 각각 8.8%, 10.4%, 9.4%, 11.3%, 10.6% 및 9.7% 초과합니다. 도 4는 CAFS 구성요소의 절제 비교 결과를 나타낸다.

## 결론

SuCLIP은 OVCOS에서 중요한 문제를 backbone 크기 경쟁이 아니라 의미 정렬 문제로 다시 정의한다. 그리고 그 정의가 실험 결과와도 잘 맞는다.

## 논의

이 논문의 장점은 문제 설정이 분명하다는 점이다. 위장 객체가 어려운 이유를 단순히 경계가 흐리기 때문이라고만 보지 않고, 텍스트 조건과 시각 특징이 서로 어긋나는 구조적 문제로 설명한다. 앞으로 open-vocabulary 기반 위장 분할을 본다면, 이 논문은 baseline이라기보다 관점을 정리해 주는 기준점에 가깝다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.pdf
