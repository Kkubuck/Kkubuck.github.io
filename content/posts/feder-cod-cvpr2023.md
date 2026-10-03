---
title: 'FEDER: Camouflaged Object Detection with Feature Decomposition and Edge Reconstruction'
description: 학습 가능한 웨이블릿으로 특징을 주파수 대역별로 나누고, 상미분방정식에서 착안한 경계 복원을 보조 작업으로 함께 학습한다.
pubDate: 2026-03-16 09:00:00 +0900
category: paper-review
tags: [cod, frequency, edge]
takeaways:
  - 전경과 배경이 비슷한 문제는 특징을 주파수 대역으로 분해해 가장 정보가 많은 대역에서 미묘한 단서를 찾아 푼다.
  - 모호한 경계 문제는 경계 복원 보조 작업으로 푼다. 상미분방정식(ODE)에서 착안한 모듈이 정확한 경계를 만든다.
  - 기존 최고 성능 방법보다 좋으면서 계산량과 메모리 사용량은 더 적다고 보고했다.
paper:
  title: Camouflaged Object Detection with Feature Decomposition and Edge Reconstruction
  authors: Chunming He, Kai Li, Yachao Zhang, Longxiang Tang, Yulun Zhang, Zhenhua Guo, Xiu Li
  venue: CVPR 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/CVPR2023/html/He_Camouflaged_Object_Detection_With_Feature_Decomposition_and_Edge_Reconstruction_CVPR_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2023/papers/He_Camouflaged_Object_Detection_With_Feature_Decomposition_and_Edge_Reconstruction_CVPR_2023_paper.pdf
  code: https://github.com/ChunmingHe/FEDER
---

## 문제

COD가 어려운 이유는 두 가지다. 위장 객체가 배경과 **본질적으로 비슷하고**, 경계가 **모호하다**. 기존 방법들은 사람의 시각 시스템을 흉내 내는 다양한 기법을 썼지만, 위장이 시각 시스템을 완전히 속이는 경우에는 여전히 어려움을 겪는다. FEDER는 두 문제를 각각 다른 방법으로 다룬다.

## 방법

### 특징 분해: 비슷함 문제

**학습 가능한 웨이블릿**으로 특징을 여러 주파수 대역으로 분해한다. 그다음 전경과 배경을 가르는 미묘한 단서가 가장 많이 담긴 대역에 집중한다. 이를 위해 두 모듈을 둔다.

- **주파수 어텐션 모듈**(frequency attention module): 대역별 특징 중 유용한 것을 강조한다.
- **안내 기반 특징 집계 모듈**(guidance-based feature aggregation module): 분해된 특징을 다시 모은다.

### 경계 복원: 모호함 문제

COD 작업과 함께 **경계 복원**을 보조 작업으로 학습한다. 경계 복원 모듈은 상미분방정식(ODE)에서 착안해 설계했으며, 정확한 경계를 생성하는 것을 목표로 한다. 보조 작업을 함께 학습한 덕분에 최종 예측 지도의 객체 경계가 정밀해진다.

## 실험

기존 최고 성능 방법들보다 크게 앞서면서도 **계산량과 메모리 비용은 더 적다**고 보고했다.

## 정리

FDCOD가 고정된 DCT로 주파수 정보를 가져왔다면, FEDER는 분해 자체를 **학습 가능한 웨이블릿**으로 만들어 어떤 대역이 유용한지 데이터에서 배우게 했다. 비슷함과 모호한 경계라는 COD의 두 난제를 각각 주파수 분해와 경계 복원으로 분리해 대응한 구조가 깔끔하다.

경계 보조 작업은 경계 정답의 품질에 의존하고, ODE 기반 모듈이 단순한 경계 디코더보다 얼마나 이득인지는 절제 실험으로 따로 확인해 볼 필요가 있다.
