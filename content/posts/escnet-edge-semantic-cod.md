---
title: 'ESCNet: Edge-Semantic Collaborative Network for Camouflaged Object Detection'
description: 경계와 질감 정보가 서로를 강화하는 순환 구조로, 위장 객체의 모호한 경계에서 예측이 조각나는 문제를 줄인다.
pubDate: 2026-03-30 09:00:00 +0900
category: paper-review
tags: [cod, edge, transformer]
takeaways:
  - 위장 객체는 질감이 배경과 비슷해 경계가 본질적으로 모호하고, 단일 특징만 쓰는 방법은 경계 제약이 부족해 예측이 조각난다.
  - AETP가 다중 스케일 특징과 트랜스포머의 전역 문맥으로 경계와 질감이 서로를 강화하게 하고, DSFA가 질감 복잡도와 경계 방향에 따라 샘플링 위치를 바꾼다.
  - MFMM이 경계 인식과 여러 질감을 계층적으로 통합해 예측을 단계적으로 다듬으며, 세 데이터셋 모두에서 좋은 성능을 냈다.
paper:
  title: 'ESCNet: Edge-Semantic Collaborative Network for Camouflaged Object Detection'
  authors: Sheng Ye, Xin Chen, Yan Zhang, Xianming Lin, Liujuan Cao
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
  code: https://github.com/suy9/ESCNet
---

## 문제

위장 객체는 질감이 배경과 비슷해서 **경계가 본질적으로 모호하다.** 하나의 특징만 쓰는 기존 방법은 경계를 충분히 제약하지 못해, 예측이 여러 조각으로 끊기는 경우가 많다. ESCNet은 경계와 질감 인식을 **동적으로 결합**해 이 문제를 푼다.

## 방법

세 가지 핵심 모듈이 함께 동작한다.

### Adaptive Edge-Texture Perceptor (AETP)

이미지의 다중 스케일 특징과 트랜스포머의 전역 의미 문맥을 합쳐, **경계와 질감 정보가 서로를 강화하는** 방식으로 경계를 예측한다.

### Dual-Stream Feature Augmentor (DSFA)

지역 질감의 복잡도와 경계의 방향에 따라 커널의 **샘플링 위치를 동적으로** 바꾼다. 프랙탈처럼 복잡한 경계나 형태가 일정하지 않은 질감 위치의 특징을 정확하게 강화하기 위해서다.

### Multi-Feature Modulation Module (MFMM)

경계 인식의 표현을 강화하고 여러 질감을 계층적으로 통합해, 특징 보정과 모델 예측을 단계적으로 세밀하게 개선한다.

세 모듈은 **피드백 고리**를 이룬다. 강화된 경계 표현이 질감 예측을 돕고, 질감 예측이 다시 경계 표현을 돕는다.

## 실험

널리 쓰이는 세 데이터셋 모두에서 뚜렷한 성능 우위를 보였다.

## 정리

[MGL](/posts/mutual-graph-learning-cod-cvpr2021/)(CVPR 2021)이 위치와 경계를 그래프 위에서 서로 보완하게 했다면, ESCNet은 같은 아이디어를 **경계와 질감**의 상호 강화로 다시 풀었다. 경계 방향에 맞춰 샘플링 위치를 바꾸는 DSFA는 변형 가능한 합성곱(deformable convolution)과 비슷한 발상으로, 불규칙한 위장 객체의 윤곽에 잘 맞는 선택이다.

모듈 사이의 상호 의존이 강한 구조라서, 경계 예측이 크게 틀리는 장면에서는 그 오류가 질감 쪽으로도 전파될 수 있다.
