---
title: Camouflaged Object Detection with Feature Decomposition and Edge Reconstruction
description: FEDER는 foreground–background 유사성은 frequency decomposition으로, ambiguous boundary는 auxiliary edge reconstruction으로
  분리해 해결한다.
summary: FEDER는 foreground–background 유사성은 frequency decomposition으로, ambiguous boundary는 auxiliary edge reconstruction으로
  분리해 해결한다.
subtitle: learnable wavelet로 특징을 주파수 대역별로 분해해 유효한 차이를 고르고, ODE에서 영감을 얻은 보조 edge reconstruction으로 모호한 윤곽을 복원한 FEDER.
pubDate: 2026-03-16 09:00:00 +0900
slug: feder-cod-cvpr2023
kind: paper
lang: ko
tags:
- paper
- cod
- wavelet
- edge-reconstruction
- cvpr-2023
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2023/html/He_Camouflaged_Object_Detection_With_Feature_Decomposition_and_Edge_Reconstruction_CVPR_2023_paper.html
venue: CVPR 2023
paperYear: 2023
authors: Chunming He, Kai Li, Yachao Zhang, Longxiang Tang, Yulun Zhang, Zhenhua Guo, Xiu Li
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2023/papers/He_Camouflaged_Object_Detection_With_Feature_Decomposition_and_Edge_Reconstruction_CVPR_2023_paper.pdf
takeaways:
- 객체와 배경의 닮음, 경계의 모호함을 하나의 모듈에 맡기지 않고 두 문제로 분해한다.
- learnable wavelet와 frequency attention이 유용한 대역을 고르고, 별도 edge task가 윤곽을 복원한다.
- edge supervision은 정확한 주석 품질에 민감하며 frequency band의 의미가 데이터셋마다 달라질 수 있다.
---

## 두 종류의 어려움을 따로 풀기

COD의 실패는 흔히 두 모습으로 나타난다. 객체 내부가 배경과 너무 비슷해 아예 찾지 못하거나, 대략 찾았지만 경계가 번지고 구멍이 생긴다. FEDER는 이를 **feature similarity 문제**와 **boundary ambiguity 문제**로 분리한다. 전자는 주파수 분해로, 후자는 edge reconstruction으로 맡긴다.

이 분해가 좋은 이유는 서로 필요한 표현이 다르기 때문이다. 내부를 구분하려면 넓은 질감 통계가 필요하고, 경계를 정확히 그리려면 높은 공간 해상도와 국소 변화가 필요하다.

## learnable wavelet decomposition

고정 DCT를 쓰는 이전 방식과 달리 FEDER는 **learnable wavelet**로 특징을 여러 주파수 대역으로 나눈다. wavelet은 공간 위치를 어느 정도 유지하면서 저주파와 고주파 성분을 분리할 수 있어, 어디에서 어떤 변화가 발생했는지 추적하기 좋다.

모든 대역이 똑같이 유용하지는 않다. frequency attention module이 장면과 계층에 따라 정보량이 큰 대역을 강조하고, guidance-based feature aggregation이 선택된 성분을 spatial semantic과 다시 결합한다. 객체의 저주파 형태와 경계의 고주파 변화가 상황에 따라 다른 비중으로 사용된다.

## edge를 보조 출력이 아니라 복원 문제로

경계 지도를 하나 더 예측하는 모델은 많다. FEDER의 차이는 ODE(ordinary differential equation)에서 영감을 받은 **edge reconstruction module**로 특징 변화의 흐름을 모델링한다는 점이다. 목표는 거친 mask의 테두리를 단순 추출하는 것이 아니라, 여러 계층의 단서에서 일관된 정확한 윤곽을 재구성하는 것이다.

edge task는 COD mask와 함께 학습된다. 경계 supervision은 segmentation decoder가 객체 내부만 채우고 끝나지 않게 하고, segmentation 문맥은 배경의 무작위 texture edge를 억제한다. 두 출력이 상호 규제하는 구조다.

## 실험을 어떻게 읽을까

논문은 여러 COD benchmark에서 정확도뿐 아니라 계산량과 메모리 비용도 비교한다. frequency decomposition과 edge branch가 추가되었는데도 상대적으로 효율적이라는 주장을 한다. 이때는 backbone, 입력 크기, 측정 장비가 같은지 확인해야 공정한 효율 비교가 된다.

절제 실험의 핵심은 learnable wavelet이 고정 변환이나 일반 convolution보다 나은지, frequency attention이 실제로 필요한지, edge reconstruction이 단순 edge loss보다 추가 이득을 주는지다. 정성 결과에서는 평균 마스크뿐 아니라 얇은 구조와 접촉 경계가 살아나는지를 봐야 한다.

## FDCOD와의 차이

두 논문 모두 frequency를 사용하지만 관점이 다르다. FDCOD은 DCT로 얻은 외부 frequency clue를 RGB branch에 정렬해 결합한다. FEDER는 네트워크 특징 자체를 learnable wavelet로 분해하고, 가장 유용한 band를 선택한다. 여기에 별도의 edge dynamics를 결합해 유사성과 경계를 동시에 다룬다.

이 비교는 같은 ‘주파수 기반’이라는 라벨 안에서도 변환 위치, 기저의 학습 가능성, spatial localization 유지 여부가 중요하다는 점을 보여 준다.

## 한계

learnable transform은 데이터에 맞게 적응하지만, 그만큼 특정 카메라·압축·해상도의 통계를 외울 위험도 있다. edge ground truth는 mask에서 파생되므로 annotation이 거칠면 잘못된 경계를 강하게 학습할 수 있다. 실제 응용에서는 센서가 바뀌었을 때 어떤 band가 선택되는지, edge branch가 작은 객체를 보존하는지, 추가 모듈의 지연 시간이 허용 가능한지를 함께 확인해야 한다.
