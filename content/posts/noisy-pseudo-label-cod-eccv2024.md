---
title: Learning Camouflaged Object Detection from Noisy Pseudo Label
description: 소량의 완전 라벨과 박스 프롬프트로 만든 잡음 많은 의사 라벨에서, 잡음 보정 손실로 정확한 위장 객체 분할을 학습한다.
pubDate: 2026-03-23 09:00:00 +0900
category: paper-review
tags: [cod, weakly-supervised]
takeaways:
  - 박스를 프롬프트로 쓰는 첫 약준지도(weakly semi-supervised) COD 방법으로, 아주 적은 수의 완전 라벨 이미지만 쓴다.
  - 적은 라벨로 만든 의사 라벨에는 잡음 픽셀이 많다. 잡음 보정 손실이 초기 학습 단계에서는 맞는 픽셀을 배우게 하고, 암기 단계에서는 잡음이 주도하는 기울기를 바로잡는다.
  - 완전 라벨 데이터를 20%만 쓰고도 기존 최고 성능 방법보다 좋은 결과를 냈다.
paper:
  title: Learning Camouflaged Object Detection from Noisy Pseudo Label
  authors: Jin Zhang, Ruiheng Zhang, Yanjiao Shi, Zhe Cao, Nian Liu, Fahad Shahbaz Khan
  venue: ECCV 2024
  year: 2024
  url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/51_ECCV_2024_paper.php
  pdf: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/00051.pdf
  code: https://github.com/zhangjinCV/noisy-cod
---

## 문제

기존 COD 방법은 대규모 픽셀 단위 라벨에 크게 의존하고, 이런 라벨은 만드는 데 시간과 노력이 많이 든다. 약지도(weakly supervised) 방법은 라벨링 효율이 높지만, 위장 이미지는 전경과 배경의 경계가 불분명해서 성능이 크게 뒤처진다.

이 논문은 그 중간을 노린다. **아주 적은 수의 완전 라벨 이미지**와, 나머지 이미지의 **박스**만으로 정밀한 분할을 학습하는 첫 약준지도(weakly semi-supervised) COD 방법이다.

## 방법

### 박스를 프롬프트로

위장 장면에서 박스를 프롬프트로 쓸 가능성을 탐구한다. 적은 수의 완전 라벨 이미지로 학습한 모델에 박스를 프롬프트로 넣어, 나머지 이미지의 의사 라벨(pseudo label)을 만든다.

### 잡음 보정 손실

이렇게 적은 데이터로 만든 의사 라벨에는 **잡음 픽셀이 많을 수밖에 없다**. 딥러닝 모델은 학습 초기에는 맞는 패턴을 먼저 배우고, 시간이 지나면 잡음까지 외우는 경향이 있다. 저자들의 잡음 보정 손실(noise correction loss)은 이 두 단계를 나눠 다룬다.

- **초기 학습 단계**: 맞는 픽셀을 잘 배우도록 돕는다.
- **암기 단계**: 잡음 픽셀이 주도하는 잘못된 기울기를 바로잡는다.

## 실험

완전 라벨 데이터를 **20%만** 쓰고도 기존 최고 성능 방법보다 좋은 결과를 냈다.

## 정리

라벨 비용을 줄이는 방향을 "라벨을 약하게(박스)"와 "라벨을 적게(20%)"로 동시에 잡은 실용적인 연구다. 잡음 라벨 학습에서 알려진 "먼저 쉬운 패턴을 배우고 나중에 잡음을 외운다"는 현상을 손실 설계에 직접 반영했다는 점이 좋다.

같은 학회의 [Just a Hint](/posts/just-a-hint-point-supervised-cod-eccv2024/)가 점 라벨만으로 학습한 것과 비교하면, 라벨 비용과 성능의 균형을 가늠하는 데 도움이 된다. 의사 라벨의 품질이 박스 프롬프트 모델에 달려 있으므로, 박스가 부정확한 경우의 견고성은 따로 확인할 필요가 있다.
