---
layout: "post"
title: "ESCNet: Edge-Semantic Collaborative Network for Camouflaged Object Detection"
subtitle: "ESCNet은 위장 객체 탐지의 병목을 경계와 텍스처의 공동 추론 문제로 보고, edge-semantic feedback loop를 설계한다."
summary: "ESCNet은 위장 객체 탐지의 병목을 경계와 텍스처의 공동 추론 문제로 보고, edge-semantic feedback loop를 설계한다."
description: "ESCNet은 위장 객체 탐지의 병목을 경계와 텍스처의 공동 추론 문제로 보고, edge-semantic feedback loop를 설계한다."
date: "2026-03-30 09:00:00 +0900"
slug: "escnet-edge-semantic-cod"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "boundary"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf"
---
## 오버뷰

ESCNet은 위장 객체의 경계가 애초에 배경 텍스처와 너무 비슷해서 흐려진다는 점을 출발점으로 삼는다. 그래서 단일 모달 특징만 보는 대신, edge와 texture를 서로 강화하는 collaborative design을 제안한다.

## 핵심 주장

- COD의 핵심 병목은 객체 경계가 배경 텍스처와 섞이는 데 있다.
- ESCNet은 AETP, DSFA, MFMM을 통해 edge perception과 texture modeling이 서로 피드백을 주도록 설계한다.
- CamoFormer24와 비교해 NC4K, COD10K, CAMO에서 Fwβ를 높이고 M을 낮췄다.

## 초록

논문은 기존 COD가 single-modality feature에 의존해 경계가 잘린 예측을 자주 만든다고 본다. 이를 해결하기 위해 Adaptive Edge-Texture Perceptor, Dual-Stream Feature Augmentor, Multi-Feature Modulation Module을 제안해 edge와 texture 정보가 서로 강화되는 구조를 만든다.

초록을 조금 더 풀어보면, 위장 물체 탐지(COD)는 배경과의 질감 유사성으로 인해 대상 경계가 본질적으로 모호한 독특한 문제에 직면해 있습니다. 단일 양식 기능에 의존하는 기존 방법은 경계 제약 조건이 충분하지 않아 조각난 예측을 생성하는 경우가 많습니다. 이를 해결하기 위해 동적으로 결합된 가장자리 텍스처 인식 기능을 갖춘 ESCNet을 제안합니다. 우리의 ESCNet은 세 가지 권위 있는 데이터 세트 모두에서 상당한 성능 이점을 보여줍니다.

## 서론

위장 객체는 색과 질감이 배경과 비슷하기 때문에, 단순한 semantic cue만으로는 객체 경계를 잡기 어렵다. 경계를 잘 잡으려다 보면 texture를 놓치고, texture를 보려다 보면 경계가 뭉개진다. ESCNet은 이 둘을 분리하지 않고 한 루프 안에서 묶어 다룬다.

서론에서는 특히, 위장은 자연의 중요한 방어 메커니즘을 나타내며 특정 유기체가 주변 환경에 원활하게 혼합되어 잠재적인 포식자를 피할 수 있게 해줍니다. 일반적으로 이러한 개체는 경계가 흐릿하고 대비가 낮으며 기만적인 질감을 나타냅니다. 메인. 이러한 과제를 해결하기 위해 우리는 세 가지 시너지 혁신을 통해 동적으로 결합된 EdgeTexture Perception을 특징으로 하는 새로운 프레임워크인 ESCNet을 제안합니다. 1. 이는 텍스처 일관성 단서를 사용하여 프랙탈 경계의 모호성을 점진적으로 해결하는 교차 규모 주의 게이트를 통해 달성됩니다.

## 본론

논문이 강조하는 것은 edge와 texture를 별도의 보조 신호로 취급하지 않는다는 점이다. edge perception이 좋아지면 texture prediction도 좋아지고, 반대로 texture modeling이 좋아지면 경계도 더 또렷해진다는 상호작용을 모델 구조에 넣는다.

## 제안방법

AETP는 multi-scale feature와 global semantic context를 함께 활용해 edge prediction을 만든다. DSFA는 local texture complexity와 edge orientation에 따라 kernel sampling position을 조절해 복잡한 경계와 텍스처를 더 정교하게 강화한다. MFMM은 이렇게 얻은 표현을 계층적으로 통합해 예측을 점진적으로 보정한다.

방법을 조금 더 자세히 보면, 전체 아키텍처 대부분의 관련 연구와 마찬가지로 위장된 개체의 점진적인 디코딩을 위해 설계된 효과적인 구성 요소를 제안했습니다. 이를 해결하기 위해 우리는 가장자리 인식 기하학적 특징과 다중 규모 상황 정보를 활용하는 Dual-Stream Feature Augmentor를 제안합니다. 에서 영감을 받아 원본 이미지를 적응적으로 자르고 추출된 특징과 융합하여 정확한 참조 정보를 제공하는 PatchRef를 제안합니다. 손실 함수 다음, 우리 프레임워크는 가장자리 구조 보존과 다중 규모 마스크 개선을 공동으로 최적화하는 하이브리드 손실 구성을 사용합니다.

## 실험

대표 비교는 CamoFormer24와 ESCNet을 놓고 Fwβ와 M만 다시 보는 것이 가장 읽기 쉽다.

실험 파트를 조금 더 자세히 보면, 최첨단 정량 평가와의 비교: 탭. 그림 1은 3개의 벤치마크 COD 데이터 세트에 걸쳐 15개의 경쟁 모델과 비교하여 제안된 방법의 정량적 결과를 나타냅니다. 결과는 우리의 방법이 MAE 및 E 의 관점에서 기존 접근 방식보다 일관되게 우수하다는 것을 나타냅니다. 우리 모델은 이러한 까다로운 조건에서 가장자리 세부 사항 보존 측면에서 다른 SOTA 모델보다 훨씬 뛰어난 성능을 발휘한다는 것이 분명합니다.

## 결론

ESCNet은 COD를 '더 깊은 backbone' 경쟁보다 '경계와 텍스처를 같이 보는 구조'의 문제로 다룬다. 그래서 논문의 메시지와 결과가 비교적 잘 맞아떨어진다.

## 논의

이 논문은 boundary-aware COD 계열을 볼 때 참고하기 좋다. 구조가 아주 단순하진 않지만, 왜 이런 모듈이 필요한지 설명이 명확하고, 수치도 그 설명을 크게 벗어나지 않는다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
