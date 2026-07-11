---
title: The Making and Breaking of Camouflage
description: foreground–background feature similarity와 boundary visibility로 camouflage effectiveness를 측정하고, 이를 생성
  모델의 auxiliary loss로 사용해 VCOD 학습 데이터를 만든다.
summary: foreground–background feature similarity와 boundary visibility로 camouflage effectiveness를 측정하고, 이를 생성 모델의
  auxiliary loss로 사용해 VCOD 학습 데이터를 만든다.
subtitle: 탐지 모델을 바로 설계하기보다 무엇이 위장을 성공시키고 깨뜨리는지 점수화하고, 그 점수를 합성 데이터 생성과 비디오 분할 학습에 다시 연결한 분석 중심 연구.
pubDate: 2026-03-18 09:00:00 +0900
slug: making-and-breaking-of-camouflage-iccv2023
kind: paper
lang: ko
tags:
- paper
- camouflage-analysis
- synthetic-data
- video-cod
- iccv-2023
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2023/html/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.html
venue: ICCV 2023
paperYear: 2023
authors: Hala Lamdouar, Weidi Xie, Andrew Zisserman
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2023/papers/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.pdf
takeaways:
- 모든 위장 샘플이 같은 난도라는 가정을 버리고, 객체·배경 유사성과 경계 가시성으로 효과를 측정한다.
- 측정 점수를 dataset 진단에만 쓰지 않고 생성 모델의 loss로 연결해 더 어려운 합성 데이터를 만든다.
- 학습된 perceptual feature로 정의한 점수가 인간의 실제 탐지 난도를 완전히 대변하는지는 별도 검증이 필요하다.
---

## “무엇이 잘 숨은 것인가”부터 묻기

많은 COD 논문은 주어진 데이터셋에서 마스크 점수를 올리는 데 집중한다. 이 연구는 한 단계 뒤로 물러나 **위장이 효과적이라는 말의 의미**를 정량화한다. 객체 내부의 색이 비슷해도 윤곽 일부가 보이면 쉽게 발견되고, 경계가 사라져도 내부 질감이 배경과 다르면 눈에 띈다.

따라서 camouflage effectiveness는 하나의 픽셀 차이로 설명되지 않는다. 논문은 foreground와 background의 feature similarity, 그리고 boundary visibility를 바탕으로 세 가지 score를 구성한다. 서로 다른 실패 원인을 분리해 데이터셋과 샘플 난도를 비교할 수 있게 한다.

## 데이터셋을 모델 밖에서 진단하기

제안 score를 기존 camouflage dataset 전체에 적용하면, 데이터셋마다 실제 위장 강도의 분포가 다르다는 점을 볼 수 있다. 이미지 수가 많다고 해서 어려운 위장 사례가 많은 것은 아니고, 특정 종류의 배경이나 선명한 윤곽이 반복될 수 있다.

이 분석은 benchmark 점수를 읽는 방식을 바꾼다. 모델 A가 데이터셋 X에서 좋고 Y에서 나쁜 이유가 단순 규모 차이가 아니라, X와 Y가 요구하는 camouflage cue가 다르기 때문일 수 있다. sample-level score는 hard subset을 만들고 curriculum을 설계하는 데도 사용할 수 있다.

## camouflage를 ‘만드는’ 쪽으로

논문은 측정에서 멈추지 않는다. camouflage score를 generative model의 auxiliary loss로 넣어, 객체가 배경과 더 자연스럽게 섞이고 경계가 덜 드러나는 이미지와 비디오를 합성한다. 생성기는 단순 복사·붙여넣기보다 “얼마나 잘 숨었는가”라는 학습 신호를 직접 받는다.

이렇게 만든 synthetic dataset으로 transformer 기반 video segmentation model을 학습하고 MoCA-Mask에서 평가한다. 분석 지표 → 생성 목표 → 탐지 모델 학습으로 이어지는 닫힌 고리가 이 논문의 가장 독특한 부분이다.

## 합성 데이터의 가치

VCOD는 프레임별 정밀 마스크가 비싸고, 실제 동물 영상의 장면 다양성을 통제하기 어렵다. 합성 데이터는 배경, 객체, 움직임, 위장 강도를 조합해 긴 꼬리 조건을 만들 수 있다. 특히 score를 이용하면 쉬운 붙여넣기 영상이 아니라 모델을 실제로 어렵게 하는 샘플을 선택적으로 생성할 수 있다.

실험에서 볼 것은 합성 영상의 시각적 자연스러움만이 아니다. 실제 benchmark 성능이 단순 데이터 양 증가보다 좋아지는지, 어떤 score를 제거했을 때 이득이 사라지는지, 실제 영상과 합성 영상의 domain gap이 얼마나 남는지가 중요하다.

## 이 논문이 남긴 관점

위장을 깨는 모델을 만들려면 먼저 위장을 구성하는 요인을 알아야 한다. 이 연구는 COD를 순수 segmentation 문제가 아니라 **perception, dataset design, generation이 연결된 문제**로 확장한다. 난도 score를 이용해 모델별 실패를 분석하거나 annotation 우선순위를 정하는 후속 아이디어도 자연스럽다.

또한 정답 마스크만으로는 알 수 없는 데이터 품질을 측정하려는 시도라는 점에서 가치가 있다. 같은 객체와 배경이라도 경계 처리 하나가 난도를 크게 바꾼다는 사실을 명시적으로 다룬다.

## 조심할 점

score가 pretrained feature에 의존하면 그 모델의 편향을 그대로 이어받는다. feature similarity가 높다고 사람이 반드시 못 찾는 것은 아니고, 의미적 기대나 움직임 같은 단서가 탐지를 쉽게 만들 수 있다. 생성 모델이 score의 허점을 이용해 부자연스러운 artifact를 만들 가능성도 있다. 인간 반응 시간과의 상관, 다른 종·환경에서의 안정성, 합성 데이터의 다양성을 함께 검증해야 한다.
