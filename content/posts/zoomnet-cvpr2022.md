---
title: 'Zoom in and Out: A Mixed-Scale Triplet Network for Camouflaged Object Detection'
description: 흐릿한 이미지를 확대하고 축소해 보는 사람의 행동을 본떠, 세 가지 배율의 입력을 함께 처리하는 ZoomNet.
pubDate: 2026-03-12 09:00:00 +0900
category: paper-review
tags: [cod, multi-scale, uncertainty]
takeaways:
  - 같은 이미지를 세 가지 배율로 입력해, 작은 단서와 넓은 문맥을 동시에 본다.
  - Scale Integration Unit(SIU)이 배율별 특징을 합치고, Hierarchical Mixed-scale Unit(HMU)이 혼합된 특징을 계층적으로 다듬는다.
  - 애매한 예측을 줄이는 uncertainty-aware loss를 더해, 네 데이터셋에서 23개 기존 모델을 앞섰다.
paper:
  title: 'Zoom in and Out: A Mixed-Scale Triplet Network for Camouflaged Object Detection'
  authors: Youwei Pang, Xiaoqi Zhao, Tian-Zhu Xiang, Lihe Zhang, Huchuan Lu
  venue: CVPR 2022
  year: 2022
  url: https://openaccess.thecvf.com/content/CVPR2022/html/Pang_Zoom_in_and_Out_A_Mixed-Scale_Triplet_Network_for_Camouflaged_CVPR_2022_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2022/papers/Pang_Zoom_in_and_Out_A_Mixed-Scale_Triplet_Network_for_Camouflaged_CVPR_2022_paper.pdf
  code: https://github.com/lartpang/ZoomNet
---

## 문제

위장 객체는 배경과 비슷할 뿐 아니라 **크기가 제각각이고, 외형이 흐릿하며, 심하게 가려진** 경우도 많다. 사람은 이런 흐릿한 이미지를 볼 때 확대해서 세부를 보고, 축소해서 전체 맥락을 본다. ZoomNet은 이 zoom in/out 행동을 네트워크로 옮겼다.

## 방법

### 세 배율의 입력

같은 이미지를 기준 배율, 축소, 확대한 세 가지 크기로 만들어(mixed-scale triplet) 공유 인코더에 넣는다. 확대한 입력은 작은 객체와 가는 윤곽을 더 많은 픽셀로 표현하고, 축소한 입력은 장면 전체의 배치를 압축해 보여 준다.

한 입력에서 나온 네트워크 내부의 여러 해상도(feature pyramid)를 섞는 것과는 다르다. 실제로 크기를 바꾼 입력들이 주는 **서로 다른 관찰**을 맞춰 합친다.

### Scale Integration Unit (SIU)

인코더의 각 단계에서 세 배율의 특징을 기준 배율에 맞춰 정렬하고 합친다. 위치마다 어느 배율의 정보가 유용한지 다르기 때문에, 단순히 크기를 맞춰 더하지 않고 가중치를 두어 선택적으로 합친다.

### Hierarchical Mixed-scale Unit (HMU)

합쳐진 특징을 여러 그룹으로 나눠 계층적으로 상호작용시키며 다듬는다. 배율이 섞인 의미 정보를 디코더 단계마다 더 풍부하게 만든다.

### Uncertainty-aware loss

구분되지 않는 질감 때문에 모델은 0.5 근처의 애매한 예측을 내기 쉽다. 예측이 0이나 1에 가까워지도록 유도하는 정규화 손실(uncertainty-aware loss)을 더해, 후보 영역에서 더 확신 있는 예측을 하도록 만든다.

## 실험

네 개의 COD 공개 데이터셋에서 기존 23개 최고 성능 모델을 일관되게 앞섰다. 현저 객체 탐지(SOD)에서도 최신 모델보다 좋은 성능을 보여, COD에만 맞춘 구조가 아니라는 점도 확인했다.

## 정리

여러 배율을 동시에 보는 설계는 크기 변화, 흐릿함, 가림을 한꺼번에 다루는 단순하고 강력한 방법이다. 같은 해의 SegMaR가 확대를 순차적으로 반복한다면, ZoomNet은 세 배율을 **병렬로** 본다.

대신 입력을 세 번 인코딩하므로 계산량이 늘고, 확대·축소 과정의 보간이 가는 경계에 영향을 줄 수 있다. 같은 저자들은 이후 이 구조를 영상까지 확장한 ZoomNeXt를 내놓았다.
