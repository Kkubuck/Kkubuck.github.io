---
title: 'Unsupervised Domain Adaptation for SAR Target Classification Based on Domain- and Class-level Alignment: From Simulated to Real Data'
description: 시뮬레이션 SAR 영상에서 실측 영상으로 분류기를 옮길 때, 전역 분포 정렬에 클래스 프로토타입 정렬과 물리 단서 기반 의사 라벨 검증을 더한다.
pubDate: 2024-02-22 17:34:52 +0900
category: paper-review
tags: [sar, domain-adaptation, classification, remote-sensing]
takeaways:
  - 전역 도메인 정렬만으로는 서로 다른 클래스가 같은 곳으로 끌려가는 잘못된 정렬을 막기 어렵다.
  - 도메인 수준에서는 적대적 학습으로 전역 분포를 맞추고, 클래스 수준에서는 프로토타입 간·프로토타입-샘플 간 대조 학습으로 클래스 구조를 지킨다.
  - SAR 표적의 물리적 산란 구조(ASC)를 이용해 신경망 신뢰도만으로는 걸러지지 않는 의사 라벨 오류를 검증한다.
paper:
  title: 'Unsupervised domain adaptation for SAR target classification based on domain- and class-level alignment: From simulated to real data'
  authors: Yu Shi, Lan Du, Chen Li, Yuchen Guo, Yuang Du
  venue: ISPRS JPRS 2024
  year: 2024
  url: https://www.sciencedirect.com/science/article/pii/S0924271623003155
  code: https://github.com/YuShi1213/Sim2Real-Unsupervised-SAR-Target-Classification
origin:
  name: Tistory
  url: https://jms3084.tistory.com/44
---

## 문제

SAR 표적 분류는 실측 데이터를 대량으로 라벨링하기 어렵다. 시뮬레이터로 클래스가 붙은 영상을 만들면 데이터는 충분히 얻을 수 있지만, 시뮬레이션과 실제 센서 사이에는 산란 모델, 잡음, 관측 조건의 차이가 남는다. 시뮬레이션 데이터에서 정확도가 높은 분류기가 실측 데이터에서 무너지는 이유다.

많은 비지도 도메인 적응(UDA) 방법은 두 도메인의 **전체 특징 분포**를 맞춘다. 이 논문은 그것만으로는 부족하다고 본다. 전역 분포가 비슷해져도 클래스별 군집이 서로 겹치거나, 원본 도메인의 한 클래스가 목표 도메인의 다른 클래스와 정렬되는 **잘못된 전이**(negative transfer)가 생길 수 있다.

## 방법

### 도메인 수준 정렬

도메인 판별기를 속이도록 특징 추출기를 학습하는 적대적 정렬로 두 도메인의 전역 특징 분포를 맞춘다. 큰 통계 차이는 줄일 수 있지만, 이것만으로는 클래스의 의미까지 보장하지 못한다.

### 클래스 수준 정렬

클래스마다 임베딩 공간의 **프로토타입**을 만들고, 두 도메인 사이에서 같은 클래스는 가깝게, 다른 클래스는 멀어지도록 대조 학습(contrastive learning)을 한다.

- **프로토타입-프로토타입**: 두 도메인의 클래스 중심을 맞춘다.
- **프로토타입-샘플**: 목표 도메인의 개별 샘플이 알맞은 클래스 중심에 모이게 한다.

목표 도메인의 프로토타입은 의사 라벨에 의존하므로, 초기 라벨이 틀리면 클래스 정렬이 오히려 오류를 강화한다.

### ASC 기반 의사 라벨 검증

**속성 산란 중심**(attributed scattering center, ASC)은 SAR 표적의 물리적 산란 구조를 나타내는 단서다. 희소 표현으로 ASC를 추출하고 헝가리안 알고리즘으로 매칭해 표적을 분류한 뒤, 이 결과를 신경망 분류기의 예측과 합쳐 신뢰하기 어려운 의사 라벨을 거른다. 신경망의 확신도 하나에 기대지 않고, **다른 원리로 얻은 물리 기반 판단**으로 교차 확인하는 셈이다.

## 정리

"도메인을 맞추는 것"과 "클래스를 보존하는 것"을 분리해서 생각했다는 점이 핵심이다. 전역 적대적 정렬, 프로토타입 기반 클래스 정렬, ASC 기반 검증이 각각 다른 실패 유형을 맡는다. 일반 이미지에 그대로 옮길 수는 없지만, SAR처럼 물리적인 영상 형성이 중요한 분야에서는 범용 표현 학습과 **물리 지식을 함께 쓰는** 편이 낫다는 것을 보여 준다.

결과를 해석할 때는 시뮬레이터와 실측 데이터의 관측 각도·클래스 구성이 얼마나 겹치는지, 의사 라벨 필터가 목표 데이터를 얼마나 남기는지, ASC 계산에 드는 전처리 비용을 함께 봐야 한다.
