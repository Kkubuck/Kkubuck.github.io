---
title: 'USCNet: Rethinking Detecting Salient and Camouflaged Objects in Unconstrained Scenes'
description: 한 장면에 현저 객체와 위장 객체가 함께 있을 수 있는 현실 조건을 반영한 데이터셋 USC12K와, 두 객체의 관계를 모델링하는 USCNet을 제안한다.
pubDate: 2026-04-03 09:00:00 +0900
category: paper-review
tags: [cod, sod, dataset]
takeaways:
  - SOD 모델은 위장 객체를 현저 객체로, COD 모델은 현저 객체를 위장 객체로 착각한다. 데이터셋의 상호 배타적 가정과 관계 모델링의 부재가 원인이다.
  - 현저·위장 객체가 존재할 수 있는 네 가지 경우를 모두 담은 대규모 데이터셋 USC12K를 만들었다.
  - 샘플 간·샘플 내 관계를 모델링하는 두 가지 프롬프트 쿼리를 둔 USCNet과, 두 객체를 구분하는 능력을 재는 지표 CSCS를 제안했다.
paper:
  title: Rethinking Detecting Salient and Camouflaged Objects in Unconstrained Scenes
  authors: Zhangjun Zhou, Yiping Li, Chunlin Zhong, Jianuo Huang, Jialun Pei, Hua Li, He Tang
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.pdf
  code: https://github.com/ssecv/USCNet
---

## 문제

사람의 시각 시스템은 현저 객체와 위장 객체를 서로 다른 방식으로 인식한다. 그런데 기존 모델은 두 작업을 잘 구분하지 못한다. SOD 모델은 위장 객체를 현저 객체로 잘못 분류하고, COD 모델은 반대로 현저 객체를 위장 객체로 오해한다.

저자들은 두 가지 원인을 든다.

1. **데이터셋의 주석 방식**: 기존 SOD/COD 데이터셋은 한 장면에 현저 객체 **아니면** 위장 객체만 있다고 가정한다. 현실의 장면과는 맞지 않는다.
2. **관계 모델링의 부재**: 기존 방법은 이렇게 제약된 데이터셋에 맞춰 설계되어, 현저 객체와 위장 객체의 관계를 명시적으로 다루지 않는다.

## 방법

### USC12K 데이터셋

제약 없는(unconstrained) 장면에서의 현저·위장 객체 탐지를 위해 대규모 데이터셋 **USC12K**를 만들었다. 현저 객체와 위장 객체가 존재할 수 있는 **논리적으로 가능한 네 가지 경우**를 모두 담고, 라벨도 빠짐없이 달았다.

### USCNet

현저 객체와 위장 객체의 관계를 명시적으로 모델링하기 위해 두 가지 프롬프트 쿼리 메커니즘을 둔다.

- **샘플 간**(inter-sample) 관계를 모델링하는 쿼리
- **샘플 내**(intra-sample) 관계를 모델링하는 쿼리

### CSCS 지표

모델이 현저 객체와 위장 객체를 얼마나 잘 구분하는지 평가하는 새 지표 CSCS를 설계했다.

## 실험

모든 장면 유형과 여러 지표에서 최고 성능을 냈다.

## 정리

[Joint SOD-COD](/posts/joint-sod-cod-cvpr2021/)나 [VSCode](/posts/vscode-generalist-cod-cvpr2024/)가 두 작업을 한 모델로 함께 다뤘지만, 데이터는 여전히 "현저 아니면 위장"이라는 가정 위에 있었다. USCNet은 그 **데이터 가정 자체**를 문제 삼았다는 점에서 의미가 크다. 실제 응용에서는 한 장면에 두 종류의 객체가 섞여 있는 경우가 흔하다.

어떤 객체를 현저하다고 볼지, 위장되었다고 볼지는 결국 사람의 판단이므로, 경계에 있는 객체의 라벨은 주석자에 따라 달라질 수 있다.
