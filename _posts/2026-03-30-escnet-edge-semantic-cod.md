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

## 서론

위장 객체는 색과 질감이 배경과 비슷하기 때문에, 단순한 semantic cue만으로는 객체 경계를 잡기 어렵다. 경계를 잘 잡으려다 보면 texture를 놓치고, texture를 보려다 보면 경계가 뭉개진다. ESCNet은 이 둘을 분리하지 않고 한 루프 안에서 묶어 다룬다.

## 본론

논문이 강조하는 것은 edge와 texture를 별도의 보조 신호로 취급하지 않는다는 점이다. edge perception이 좋아지면 texture prediction도 좋아지고, 반대로 texture modeling이 좋아지면 경계도 더 또렷해진다는 상호작용을 모델 구조에 넣는다.

## 제안방법

AETP는 multi-scale feature와 global semantic context를 함께 활용해 edge prediction을 만든다. DSFA는 local texture complexity와 edge orientation에 따라 kernel sampling position을 조절해 복잡한 경계와 텍스처를 더 정교하게 강화한다. MFMM은 이렇게 얻은 표현을 계층적으로 통합해 예측을 점진적으로 보정한다.

## 실험

대표 비교는 CamoFormer24와 ESCNet을 놓고 Fwβ와 M만 다시 보는 것이 가장 읽기 쉽다.

| 데이터셋 | CamoFormer24 Fwβ↑ | ESCNet Fwβ↑ | CamoFormer24 M↓ | ESCNet M↓ |
| --- | ---: | ---: | ---: | ---: |
| NC4K | 0.847 | **0.859** | 0.030 | **0.028** |
| COD10K | 0.786 | **0.804** | 0.023 | **0.021** |
| CAMO | 0.831 | **0.843** | 0.046 | **0.044** |

수치만 봐도 개선 폭이 과장되지 않으면서도 일관적이다. 경계와 텍스처를 묶어 보는 설계가 실제 benchmark 성능에서도 이득을 낸다.

## 결론

ESCNet은 COD를 '더 깊은 backbone' 경쟁보다 '경계와 텍스처를 같이 보는 구조'의 문제로 다룬다. 그래서 논문의 메시지와 결과가 비교적 잘 맞아떨어진다.

## 논의

이 논문은 boundary-aware COD 계열을 볼 때 참고하기 좋다. 구조가 아주 단순하진 않지만, 왜 이런 모듈이 필요한지 설명이 명확하고, 수치도 그 설명을 크게 벗어나지 않는다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
