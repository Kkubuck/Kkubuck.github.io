---
title: 'Segment, Magnify and Reiterate: Detecting Camouflaged Objects the Hard Way'
description: 분할하고, 객체 영역을 확대하고, 다시 분할하는 과정을 반복해 작은 위장 객체를 정확하게 찾는다(SegMaR).
pubDate: 2026-03-11 09:00:00 +0900
category: paper-review
tags: [cod, refinement]
takeaways:
  - 경계가 가늘고 해상도가 낮은 작은 위장 객체는 큰 객체보다 더 많은 처리가 필요하다는 데서 출발한다.
  - 시선과 경계 영역에 집중하게 하는 판별 마스크와, 이미지 크기를 키우지 않고 객체 영역을 확대하는 어텐션 기반 샘플러를 쓴다.
  - 작은 위장 객체에서 경쟁 방법 두 개보다 평균 7.4%, 20.0% 높은 성능을 보고했다.
paper:
  title: 'Segment, Magnify and Reiterate: Detecting Camouflaged Objects the Hard Way'
  authors: Qi Jia, Shuilian Yao, Yu Liu, Xin Fan, Risheng Liu, Zhongxuan Luo
  venue: CVPR 2022
  year: 2022
  url: https://openaccess.thecvf.com/content/CVPR2022/html/Jia_Segment_Magnify_and_Reiterate_Detecting_Camouflaged_Objects_the_Hard_Way_CVPR_2022_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2022/papers/Jia_Segment_Magnify_and_Reiterate_Detecting_Camouflaged_Objects_the_Hard_Way_CVPR_2022_paper.pdf
  code: https://github.com/dlut-dimt/SegMaR
---

## 문제

기존 COD 방법은 대부분 한 번에 예측하는 단일 단계 방식이었다. 그런데 작은 객체는 경계가 가늘고 차지하는 픽셀이 적어서, 큰 객체보다 더 많은 처리가 필요하다. 한 번의 예측으로 큰 객체와 작은 객체를 똑같이 다루면 작은 객체에서 성능이 크게 떨어진다.

사람은 잘 안 보이는 물체를 찾을 때 대략 위치를 잡은 뒤 그 부분을 **확대해서 다시 본다**. SegMaR는 이 coarse-to-fine 전략을 그대로 옮겼다.

## 방법

이름 그대로 **분할**(Segment), **확대**(Magnify), **반복**(Reiterate)을 여러 단계에 걸쳐 수행한다.

### 판별 마스크

이진 마스크만으로 학습하는 대신, 모델이 **시선이 머무는 영역과 경계 영역**에 집중하도록 만든 판별 마스크(discriminative mask)를 새로 설계했다. 객체를 찾게 만드는 단서와 윤곽에 학습 신호를 더 주는 방식이다.

### 어텐션 기반 샘플러

이전 단계의 예측을 바탕으로 객체 영역을 점점 확대한다. 이미지를 통째로 키우면 계산량이 커지지만, 어텐션 기반 샘플러는 **이미지 크기는 그대로 두고** 객체가 있는 부분에 더 많은 픽셀을 할당하도록 다시 샘플링한다. 확대된 입력으로 다시 분할하고, 결과는 원래 좌표로 되돌린다.

### 반복

분할과 확대를 여러 단계 반복하며 예측을 다듬는다.

## 실험

여러 벤치마크에서 기존 최고 성능 방법보다 일관되게 좋았고, 특히 **작은 위장 객체**에서 두 경쟁 방법보다 표준 지표 평균으로 각각 7.4%, 20.0% 높은 성능을 보였다. 판별 마스크의 효과와, 다른 네트워크 구조에 붙였을 때의 일반화도 추가로 분석했다.

## 정리

객체 크기에 따라 필요한 연산량이 다르다는 관찰을 구조로 옮긴 점이 좋다. 이미지를 키우는 대신 샘플링 밀도를 조절하는 방식은 고해상도 입력이 부담스러운 상황에서 특히 실용적이다. 같은 해에 나온 ZoomNet이 여러 배율을 **동시에** 본다면, SegMaR는 확대를 **순차적으로** 반복한다는 점에서 비교해 볼 만하다.

반복 구조인 만큼 첫 단계에서 객체를 크게 놓치면 이후 확대가 엉뚱한 곳을 향할 수 있고, 단계 수만큼 추론 시간이 늘어난다.
