---
title: 'PFNet: Camouflaged Object Segmentation with Distraction Mining'
description: 포식자처럼 먼저 위치를 찾고(Positioning), 헷갈리는 영역을 골라 고치는(Focus) 2단계 구조로 위장 객체를 분할한다.
pubDate: 2026-03-08 09:00:00 +0900
category: paper-review
tags: [cod, refinement]
takeaways:
  - 포식자의 사냥 과정을 본떠 위치 추정(Positioning Module)과 정밀화(Focus Module) 두 단계로 나눈다.
  - Focus Module은 거짓 양성과 거짓 음성 영역을 따로 찾아내 빼고 더하는 distraction mining으로 예측을 고친다.
  - 72 FPS로 실시간 추론이 가능하면서, 세 벤치마크에서 18개 모델보다 좋은 성능을 보고했다.
paper:
  title: Camouflaged Object Segmentation with Distraction Mining
  authors: Haiyang Mei, Ge-Peng Ji, Ziqi Wei, Xin Yang, Xiaopeng Wei, Deng-Ping Fan
  venue: CVPR 2021
  year: 2021
  url: https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf
  code: https://github.com/Mhaiyang/CVPR2021_PFNet
---

## 문제

위장 객체 분할(COS)이 어려운 이유는 객체 후보와 배경이 본질적으로 너무 비슷하기 때문이다. 모델이 자주 하는 실수는 두 가지다. 객체의 일부를 배경으로 놓치거나(거짓 음성), 객체와 비슷한 배경을 객체로 끌어온다(거짓 양성).

PFNet은 포식자가 먹이를 찾는 과정에서 아이디어를 얻었다. 먼저 장면 전체에서 먹이가 있을 법한 곳을 **찾고**(detection), 그다음 그 주변을 자세히 보며 정말 먹이인지 **확인**한다(identification). 이 두 단계를 각각 Positioning Module(PM)과 Focus Module(FM)으로 옮겼다.

## 방법

ResNet-50 백본에서 여러 단계의 특징을 뽑고, 가장 깊은 특징으로 대략적인 위치를 찾은 뒤 얕은 특징으로 내려오며 예측을 다듬는다.

### Positioning Module

가장 깊은 특징에 채널 어텐션과 공간 어텐션을 적용해, 장면 전체를 보고 객체가 있을 법한 위치를 거칠게 예측한다. 이 단계의 목표는 정확한 경계가 아니라 후보를 놓치지 않는 것이다. 이렇게 얻은 초기 지도가 뒤 단계에서 어디에 집중할지를 알려 준다.

### Focus Module과 distraction mining

FM은 윗단계의 예측과 현재 단계의 특징을 받아 **애매한 영역**을 찾는다. 예측을 전경 쪽과 배경 쪽으로 나눠 보고, 두 종류의 방해 요소(distraction)를 따로 발견한다.

- **거짓 양성 방해 요소**: 객체로 예측했지만 실제로는 배경인 영역. 특징에서 빼서 제거한다.
- **거짓 음성 방해 요소**: 배경으로 예측했지만 실제로는 객체인 영역. 특징에 더해 보충한다.

FM을 여러 단계에 걸쳐 반복하면서 윤곽이 정리되고 객체 내부의 빈 곳이 채워진다. 이미 맞힌 영역을 다시 계산하기보다 틀린 영역에 계산을 집중한다는 점이 이 구조의 핵심이다.

## 실험

CHAMELEON, CAMO, COD10K 세 벤치마크에서 네 가지 표준 지표(S-measure, E-measure, weighted F-measure, MAE)로 평가했고, 18개 기존 모델보다 높은 성능을 보고했다. 추론 속도는 72 FPS로, 정확도와 속도를 함께 챙긴 모델이다. 절제 실험에서는 PM만 쓸 때보다 FM과 distraction mining을 더할 때 경계와 배경 오검출이 줄어드는 것을 보인다.

## 정리

PFNet의 refinement는 단순히 디코더를 깊게 쌓는 것이 아니라, 각 단계가 **이전 예측의 어떤 오류를 고칠지** 정해 두었다는 점이 좋다. 이후 iterative mask decoder나 prompt refinement 계열 모델을 읽을 때도 "이번 반복에서 새로 고치는 것이 무엇인가"를 묻게 만든다.

한계도 같은 구조에서 나온다. coarse-to-fine 방식은 첫 단계의 recall에 크게 의존한다. PM이 작은 객체를 아예 놓치면 FM에는 고칠 후보가 없다. 72 FPS도 당시 실험 환경의 수치이므로, 절대 속도보다는 구조가 가볍다는 근거로 읽는 편이 맞다.
