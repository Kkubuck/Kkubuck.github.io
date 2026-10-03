---
title: 'SLT-Net: Implicit Motion Handling for Video Camouflaged Object Detection'
description: 광학 흐름을 따로 추정하지 않고 상관 볼륨으로 움직임을 암묵적으로 학습해, 영상 속 위장 객체를 찾는다. MoCA-Mask 데이터셋도 함께 공개했다.
pubDate: 2026-03-10 09:00:00 +0900
category: paper-review
tags: [cod, video, dataset]
takeaways:
  - 정지 영상에서는 보이지 않던 위장 객체도 움직이면 드러나므로, 영상에서는 움직임을 다루는 방식이 핵심이다.
  - 이웃 프레임 사이의 밀집 상관 볼륨으로 움직임을 암묵적으로 표현하고, 분할 정답만으로 움직임 추정과 분할을 함께 최적화한다.
  - 시공간 트랜스포머로 긴 구간의 일관성을 맞추고, 픽셀 단위 마스크를 단 MoCA-Mask와 VCOD 벤치마크를 공개했다.
paper:
  title: Implicit Motion Handling for Video Camouflaged Object Detection
  authors: Xuelian Cheng, Huan Xiong, Deng-Ping Fan, Yiran Zhong, Mehrtash Harandi, Tom Drummond, Zongyuan Ge
  venue: CVPR 2022
  year: 2022
  url: https://openaccess.thecvf.com/content/CVPR2022/html/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2022/papers/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.pdf
  code: https://github.com/XuelianCheng/SLT-Net
---

## 문제

위장 객체는 배경과 비슷한 무늬를 가지고 있어 정지 영상 한 장으로는 찾기 어렵다. 하지만 **움직이는 순간** 눈에 띈다. 그래서 영상 위장 객체 탐지(VCOD)에서는 시간에 따른 변화를 어떻게 다루느냐가 핵심이다.

기존 VCOD 방법은 호모그래피나 광학 흐름(optical flow)으로 움직임을 명시적으로 추정한 뒤 분할했다. 이 경우 움직임 추정의 오류와 분할의 오류가 **함께 누적**된다. 흐름 추정이 틀리면 그 위에서 하는 분할도 틀리기 쉽다.

## 방법

SLT-Net은 움직임 추정과 객체 분할을 하나의 최적화 틀 안에 넣었다. 이름처럼 짧은 시간(short-term)과 긴 시간(long-term)을 나눠 다룬다.

### Short-term: 암묵적 움직임 추정

연속된 두 프레임 사이에 **밀집 상관 볼륨**(dense correlation volume)을 만들어 움직임을 암묵적으로 표현한다. 광학 흐름을 따로 정답으로 학습하지 않고, 최종 분할 정답만으로 움직임 추정과 분할을 **함께** 최적화한다. 분할에 도움이 되는 방향으로 움직임 표현이 학습되는 셈이다.

### Long-term: 시공간 일관성

짧은 구간 예측은 프레임마다 흔들릴 수 있다. 여러 프레임의 예측과 원본 프레임을 시공간 트랜스포머(spatio-temporal transformer)에 함께 넣어, 영상 전체에서 일관되도록 예측을 다듬는다.

### MoCA-Mask

움직이는 위장 동물 영상 데이터셋인 MoCA는 바운딩 박스 라벨만 있었다. 저자들은 여기에 픽셀 단위 마스크를 직접 그린 **MoCA-Mask**를 만들고, 기존 방법들을 함께 평가한 VCOD 벤치마크를 구성했다.

## 실험

VCOD 벤치마크에서 제안한 구조의 효과를 보였고, 정지 영상 COD 모델(SINet 등)과 영상 객체 분할 모델을 MoCA-Mask에서 함께 비교했다.

## 정리

움직임을 따로 맞히게 하지 않고 **분할에 필요한 만큼만** 학습하게 한 점이 이 논문의 핵심이다. 명시적 흐름 추정은 위장 객체처럼 배경과 비슷한 텍스처에서 특히 불안정한데, 이 문제를 우회한 셈이다. 이후 TSP-SAM 같은 SAM 기반 VCOD 연구도 MoCA-Mask를 기준 벤치마크로 쓴다.

다만 움직임이 거의 없는 위장 객체에는 이 신호가 약하다. 카메라 움직임이 큰 영상에서는 객체의 움직임과 배경의 움직임을 구분하는 문제가 남는다.
