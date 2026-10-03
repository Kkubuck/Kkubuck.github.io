---
title: 'FeNet: Feature Enhancement Network for Lightweight Remote-Sensing Image Super-Resolution'
description: 메모리와 연산이 제한된 원격 탐사 환경을 위해, 채널을 반씩 나눠 계산하면서도 정보를 교환하는 경량 초해상도 네트워크.
pubDate: 2023-11-16 22:31:11 +0900
category: paper-review
tags: [super-resolution, remote-sensing, lightweight]
takeaways:
  - 원격 탐사에서는 메모리와 연산 부담 때문에 CNN 기반 초해상도를 쓰기 어렵다. 약 158K 파라미터의 FeNet-baseline까지 함께 제안한다.
  - Lightweight Lattice Block(LLB)은 채널을 반씩 나눠 계산하고, 어텐션으로 구한 가중치로 두 분기가 정보를 주고받는다.
  - LLB를 중첩한 Feature Enhancement Block(FEB)이 깊이별로 다른 질감 정보를 담당하고, 깊은 층에서 얕은 층 순서로 합친다.
paper:
  title: 'FeNet: Feature Enhancement Network for Lightweight Remote-Sensing Image Super-Resolution'
  authors: Zheyuan Wang, Liangliang Li, Yuan Xue, Chenchen Jiang, Jiawen Wang, Kaipeng Sun, Hongbing Ma
  venue: IEEE TGRS 2022
  year: 2022
  url: https://ieeexplore.ieee.org/document/9759417
  code: https://github.com/wangzheyuan-666/FeNet
origin:
  name: Tistory
  url: https://jms3084.tistory.com/38
---

## 문제

원격 탐사 분야에서 딥러닝 CNN 기반 단일 영상 초해상도(SISR)는 **메모리 사용량과 연산 부담** 때문에 실제로 쓰기 어렵다. 위성·항공 영상은 한 장이 크고, 넓은 지역을 타일로 잘라 반복 추론하는 경우가 많아 조금만 무거워도 전체 비용이 빠르게 커진다. 반대로 채널 수만 줄이면 도로, 지붕, 농경지처럼 반복되는 고주파 패턴이 뭉개진다.

FeNet은 정확도를 유지하는 경량 네트워크를 목표로 하고, 하드웨어가 아주 열악한 장비를 위해 약 158K 파라미터의 더 가벼운 **FeNet-baseline**도 함께 제안한다.

## 방법

### Lightweight Lattice Block (LLB)

격자(lattice) 구조에서 착안한 비선형 특징 추출 블록이다.

- **채널 분리**: 위·아래 두 분기가 각각 특징의 절반만 맡아 계산량을 줄인다.
- **어텐션 기반 교환**: 어텐션으로 계산한 가중치를 이용해 두 분기가 효율적으로 정보를 주고받는다.

단순한 그룹 합성곱은 분기를 완전히 독립시키지만, LLB는 분리하되 정보 교환을 끊지 않는다. 한 분기가 놓친 질감을 다른 분기가 보완할 수 있다.

### Feature Enhancement Block (FEB)

LLB를 **중첩**해 표현력 있는 특징을 얻는다. 깊이가 다른 층은 서로 다른 풍부함의 질감을 담당하고, 이 특징들을 **깊은 층에서 얕은 층 방향으로** 차례로 융합한다. 작은 네트워크 안에서 이미 계산한 특징을 버리지 않고 다시 쓰는 전략이다.

## 실험

네트워크 복잡도는 파라미터 수와 곱셈-덧셈 연산량(Multi-Adds)으로 평가했고, 원격 탐사 데이터셋 두 개와 일반 SR 벤치마크 네 개에서 복잡도와 성능 사이의 좋은 균형을 보였다.

## 정리

경량 모델에서 성능을 만드는 핵심 자원이 **채널 폭보다 특징 재사용 경로**라는 점을 보여 주는 논문이다. 채널을 나누되 교환을 끊지 않고, 여러 깊이의 질감을 다시 쓰는 원칙은 이후 경량 복원 모델을 읽을 때도 유효하다.

다만 bicubic 열화와 PSNR 중심 평가에 가까워, 실제 위성 영상의 센서 잡음이나 대기 영향, 센서 간 분포 차이는 직접 다루지 않는다. 파라미터가 적다고 해서 모바일·엣지 장비에서 실제로 빠르다는 보장도 없으므로, 목표 장비에서 따로 측정해 봐야 한다.
