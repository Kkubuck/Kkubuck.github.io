---
title: 'UGTR: Uncertainty-Guided Transformer Reasoning for Camouflaged Object Detection'
description: 확률 모델로 초기 예측과 불확실성을 함께 추정한 뒤, 트랜스포머가 불확실한 영역을 집중적으로 추론해 위장 객체를 찾는다.
pubDate: 2026-03-09 09:00:00 +0900
category: paper-review
tags: [cod, uncertainty, transformer]
takeaways:
  - 일반 객체·현저 객체 탐지 모델은 쉽고 뚜렷한 객체만 찾고, 질감이 구분되지 않아 불확실한 위장 객체는 놓친다.
  - 백본 출력의 조건부 분포를 학습해 초기 예측과 불확실성을 얻고, 어텐션으로 불확실한 영역을 다시 추론한다.
  - 베이지안 학습의 확률 정보와 트랜스포머 추론의 결정적 정보를 결합한 구조다.
paper:
  title: Uncertainty-Guided Transformer Reasoning for Camouflaged Object Detection
  authors: Fan Yang, Qiang Zhai, Xin Li, Rui Huang, Ao Luo, Hong Cheng, Deng-Ping Fan
  venue: ICCV 2021
  year: 2021
  url: https://openaccess.thecvf.com/content/ICCV2021/html/Yang_Uncertainty-Guided_Transformer_Reasoning_for_Camouflaged_Object_Detection_ICCV_2021_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2021/papers/Yang_Uncertainty-Guided_Transformer_Reasoning_for_Camouflaged_Object_Detection_ICCV_2021_paper.pdf
  code: https://github.com/fanyang587/UGTR
---

## 문제

일반 객체 탐지나 현저 객체 탐지 기법은 위장 객체에 잘 맞지 않는다. 쉽고 뚜렷한 객체만 찾는 경향이 있어서, 배경과 질감이 구분되지 않는 객체처럼 **본질적으로 불확실한** 대상을 놓친다. 위장 객체 탐지에서는 모델이 어디를 확신하고 어디를 헷갈리는지부터 알아야 한다는 것이 이 논문의 출발점이다.

## 방법

UGTR은 확률적 표현 모델(probabilistic representational model)과 트랜스포머를 결합해, 불확실성 아래에서 명시적으로 추론한다.

### 1단계: 초기 예측과 불확실성

백본의 출력 위에서 하나의 값이 아니라 **조건부 분포**를 학습한다. 분포에서 초기 예측을 얻고, 분포가 퍼져 있는 정도를 불확실성으로 쓴다. 객체 내부처럼 확실한 곳은 불확실성이 낮고, 경계나 배경과 비슷한 부분은 높게 나온다.

### 2단계: 불확실한 영역에 대한 트랜스포머 추론

불확실성 지도를 안내 삼아, 트랜스포머의 어텐션으로 **불확실한 영역을 집중적으로** 다시 추론해 최종 예측을 만든다. 이미 확실한 영역에 계산을 다시 쓰기보다, 모델이 헷갈리는 곳에 장거리 문맥을 끌어와 판단을 보강하는 방식이다.

결과적으로 베이지안 학습의 확률적 정보와 트랜스포머 기반 추론의 결정적 정보를 함께 쓰는 구조가 된다.

## 실험

CHAMELEON, CAMO, COD10K에서 당시 최고 성능 모델들보다 높은 정확도를 보고했다.

## 정리

불확실성을 "학습이 끝난 뒤 그려 보는 진단 도구"가 아니라 **추론 과정의 안내 신호**로 썼다는 점이 이 논문의 의미다. 이후 ZoomNet의 uncertainty-aware loss나, 불확실한 영역을 골라 다시 보는 여러 refinement 구조와 같은 맥락에서 읽을 수 있다.

다만 학습으로 얻은 분산이 실제 오분할 확률과 얼마나 잘 맞는지(캘리브레이션)는 따로 확인해야 한다. 불확실성 지도가 그럴듯해 보여도, 모델이 확신하며 틀리는 영역은 이 방식으로 잡히지 않는다.
