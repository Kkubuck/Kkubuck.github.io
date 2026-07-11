---
title: Unsupervised Domain Adaptation for SAR Target Classification Based on Domain- and Class-level Alignment
description: 시뮬레이션→실측 SAR 전이에서 전역 분포뿐 아니라 클래스 원형과 물리 단서까지 이용해 잘못된 정렬을 줄인다.
summary: 시뮬레이션→실측 SAR 전이에서 전역 분포뿐 아니라 클래스 원형과 물리 단서까지 이용해 잘못된 정렬을 줄인다.
subtitle: 시뮬레이션→실측 SAR 전이에서 전역 분포뿐 아니라 클래스 원형과 물리 단서까지 이용해 잘못된 정렬을 줄인다.
pubDate: 2024-02-22 17:34:52 +0900
slug: tistory-44
kind: paper
lang: ko
tags:
- paper
- domain-adaptation
- sar
- classification
- contrastive-learning
categories:
- papers
sourceUrl: https://www.sciencedirect.com/science/article/pii/S0924271623003155
sourceBlog: tistory
legacyUrl: https://jms3084.tistory.com/44
venue: ISPRS JPRS 2024
paperYear: 2024
authors: Yu Shi, Lan Du, Chen Li, Yuchen Guo, Yuang Du
reviewedOn: '2026-07-10'
codeUrl: https://github.com/YuShi1213/Sim2Real-Unsupervised-SAR-Target-Classification
doi: 10.1016/j.isprsjprs.2023.11.010
takeaways:
- 전역 domain alignment만으로는 서로 다른 클래스가 같은 위치로 끌려가는 negative transfer를 막기 어렵다.
- prototype–prototype과 prototype–instance 관계를 contrastive learning으로 정렬해 클래스 구조를 보존한다.
- ASC 기반 필터는 신경망 confidence 외의 물리 단서를 이용해 pseudo-label을 검증한다.
---

## 시뮬레이션 데이터가 충분해도 남는 문제

SAR 표적 분류는 실측 데이터를 대량으로 라벨링하기 어렵다. 시뮬레이터로 클래스가 붙은 영상을 만드는 방법은 매력적이지만, 시뮬레이션과 실제 센서 사이에는 산란 모델, 잡음, 관측 조건의 차이가 남는다. source에서 높은 정확도를 얻은 분류기가 target에서 무너지는 이유다.

많은 UDA 방법은 두 도메인의 전체 feature 분포를 맞춘다. 이 논문은 그 방식만으로는 충분하지 않다고 본다. 전역 분포가 비슷해져도 개별 클래스의 군집이 서로 겹치거나, source의 한 클래스가 target의 다른 클래스와 정렬될 수 있기 때문이다.

## Domain-level Alignment

전역 수준에서는 gradient-weighted adversarial alignment를 사용한다. 일반적인 도메인 판별 학습에 샘플의 혼동 정도를 반영해, 정렬이 더 필요한 사례의 gradient를 강조하고 이미 쉬운 사례의 영향을 낮춘다. 목적은 모든 샘플을 균일하게 밀어붙이는 대신 현재 결정 경계에서 어려운 부분에 더 많은 적응 신호를 주는 것이다.

이 단계는 두 도메인의 큰 통계 차이를 줄이지만 클래스 의미를 직접 보장하지 않는다. 그래서 다음의 class-level alignment가 함께 필요하다.

## Class-level Alignment

각 클래스를 embedding 공간의 prototype으로 표현하고, source와 target 사이에서 같은 클래스는 가깝게, 다른 클래스는 멀어지도록 학습한다. 논문은 cross-domain prototype–prototype 관계와 prototype–instance 관계를 각각 contrastive objective로 모델링한다. 전자는 두 도메인의 클래스 중심을 맞추고, 후자는 개별 target 샘플이 적절한 클래스 중심에 모이도록 돕는다.

여기서 target prototype은 pseudo-label에 의존한다. 초기 라벨이 틀리면 클래스 단위 정렬이 오히려 오류를 강화한다. 이 문제를 줄이는 장치가 pseudo-label filtering이다.

## ASC를 이용한 pseudo-label 검증

Attribute Scattering Center는 SAR 표적의 물리적 산란 구조를 표현하는 단서다. 저자들은 deep classifier의 예측과 ASC 기반 분류 결과를 결합해 신뢰하기 어려운 pseudo-label을 거른다. 이미지 분류 confidence 하나만 사용하는 대신, 다른 원리로 얻은 물리 기반 판단을 교차 확인에 쓰는 셈이다.

이 부분은 논문의 가장 도메인 특화된 기여다. 일반 이미지에서 그대로 복사할 수는 없지만, 전문 센서 문제에서는 범용 표현 학습과 물리 지식을 경쟁 관계로 둘 필요가 없다는 점을 보여 준다.

## 실험을 볼 때 확인할 것

논문은 simulation-to-real 데이터셋에서 일반 UDA 방법보다 나은 결과를 보고한다. 숫자를 해석할 때는 시뮬레이터와 실측 데이터의 관측 각도·클래스 구성이 얼마나 겹치는지, pseudo-label 필터가 target 분포의 어느 비율을 유지하는지, ASC 계산에 필요한 전처리와 추가 비용이 무엇인지 함께 봐야 한다.

## 읽고 남은 판단

이 연구의 핵심은 “도메인을 맞추는 것”과 “클래스를 보존하는 것”을 분리해 생각한 데 있다. 전역 adversarial alignment, prototype 기반 class alignment, ASC 기반 검증이 각각 다른 실패 모드를 담당한다. 구성은 복잡하지만 SAR처럼 물리적 영상 형성이 중요한 분야에서 범용 UDA만으로 부족한 이유를 분명히 보여 준다.
