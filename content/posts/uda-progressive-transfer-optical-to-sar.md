---
title: 'Unsupervised Domain Adaptation Based on Progressive Transfer for Ship Detection: From Optical to SAR Images'
description: 광학 영상과 SAR 영상의 큰 차이를 픽셀, 특징, 예측 세 단계에서 차례로 줄이고, 마지막에는 견고한 자기 학습으로 SAR 표현을 직접 배운다.
pubDate: 2024-02-19 19:07:03 +0900
category: paper-review
tags: [sar, domain-adaptation, object-detection, remote-sensing]
takeaways:
  - SAR 라벨링은 광학 영상보다 비싸고 오래 걸리므로, 라벨이 있는 광학 영상의 지식을 라벨 없는 SAR로 옮긴다.
  - 두 도메인의 차이가 커서 픽셀(전이 도메인 생성), 특징(적대적 정렬), 예측(의사 라벨 자기 학습) 세 단계로 나눠 점진적으로 옮긴다.
  - 마지막 단계의 견고한 자기 학습(RST)은 잡음 섞인 의사 라벨의 영향을 줄이는 손실 최소화 문제로 정식화했다.
paper:
  title: 'Unsupervised Domain Adaptation Based on Progressive Transfer for Ship Detection: From Optical to SAR Images'
  authors: Yu Shi, Lan Du, Yuchen Guo, Yuang Du
  venue: IEEE TGRS 2022
  year: 2022
  url: https://ieeexplore.ieee.org/document/9803220
origin:
  name: Tistory
  url: https://jms3084.tistory.com/43
---

## 문제

CNN 기반 SAR 선박 검출은 많은 라벨이 필요한데, SAR 영상의 라벨링은 광학 영상보다 비싸고 오래 걸린다. 그래서 라벨이 풍부한 **광학 영상에서 SAR 영상으로** 지식을 옮기는 비지도 도메인 적응(UDA)을 다룬다.

문제는 두 영상의 차이가 매우 크다는 점이다. 색과 질감뿐 아니라 배경 잡음, 산란 패턴, 객체 내부의 밝기 구조까지 다르다. 일반적인 도메인 적응처럼 두 도메인의 특징을 바로 맞추면, 검출에 필요한 구조까지 함께 무너질 수 있다.

## 방법

지식을 **세 단계에 걸쳐 점진적으로** 옮긴다. "progressive"는 학습 스케줄이 아니라, 서로 다른 수준의 간극을 순서대로 줄인다는 뜻이다.

### 픽셀 수준: 전이 도메인 만들기

두 센서의 영상 형성 원리 차이를 고려해, 선박 대상에 특화된 데이터 증강을 설계하고, GAN 기반에 스킵 연결을 넣은 생성기로 광학과 SAR 사이의 **전이 도메인**(transition domain)을 만든다. 전이 영상은 SAR을 완벽하게 흉내 낼 필요는 없고, 두 도메인 사이의 외형 차이를 줄이는 디딤돌이면 된다.

### 특징 수준: 적대적 정렬

검출기가 **도메인 불변 특징**을 배우도록 적대적 정렬(adversarial alignment)로 학습한다. 도메인 판별기가 두 도메인의 특징을 구분하지 못하게 만드는 방식이다. 픽셀 수준에서 먼저 간극을 줄여 두었기 때문에, 특징 정렬이 감당해야 할 거리가 짧아진다.

### 예측 수준: 견고한 자기 학습 (RST)

특징 정렬을 마친 검출기로 SAR 영상의 **의사 라벨**을 만들고, 이를 이용해 SAR 영상의 더 판별적인 특징을 직접 배운다. 초기의 오검출이 학습으로 굳어지지 않도록, 잡음 섞인 의사 라벨의 영향을 줄이는 **견고한 자기 학습**(robust self-training, RST)을 제안했다. RST는 객체 검출을 위한 손실 최소화 문제로 정식화된다.

## 정리

큰 도메인 간극을 **한 번의 정렬로 해결하려 하지 않는다**는 점이 설득력 있다. 픽셀 변환만 쓰면 생성기의 아티팩트에 의존하고, 특징 정렬만 쓰면 큰 간극 때문에 의미 구조가 흔들리며, 자기 학습만 쓰면 초기 의사 라벨이 약하다. 세 단계는 앞 단계가 다음 단계의 난도를 낮추는 관계다.

자기 학습에서는 작은 선박이 낮은 신뢰도 때문에 계속 제외되거나, 해안 구조물이 높은 신뢰도의 오검출로 누적되는 편향을 함께 봐야 한다. 새로운 SAR 센서나 해역에서 생성기와 신뢰도 기준이 얼마나 민감한지도 추가 검증이 필요하다.
