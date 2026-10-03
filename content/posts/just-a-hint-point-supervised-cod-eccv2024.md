---
title: 'Just a Hint: Point-Supervised Camouflaged Object Detection'
description: 객체마다 점 하나만 찍은 라벨로 위장 객체 탐지 모델을 학습해, 픽셀 단위 주석의 부담을 크게 줄인다.
pubDate: 2026-03-22 09:00:00 +0900
category: paper-review
tags: [cod, weakly-supervised]
takeaways:
  - 위장 객체는 사람에게도 경계가 모호해서 픽셀 단위 주석 비용이 특히 크다. 객체마다 점 하나만 찍는 방식으로 학습한다.
  - 점 라벨을 적절한 힌트 영역으로 넓히고, 라벨 영역을 일부 가리는 어텐션 조절기로 모델이 객체 전체를 보게 만든다.
  - 색 변환·이동 같은 증강 쌍으로 비지도 대조 학습을 해 점 라벨만으로 불안정한 특징 표현을 안정시킨다.
paper:
  title: 'Just a Hint: Point-Supervised Camouflaged Object Detection'
  authors: Huafeng Chen, Dian Shao, Guangqian Guo, Shan Gao
  venue: ECCV 2024
  year: 2024
  url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/5190_ECCV_2024_paper.php
  pdf: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/05190.pdf
---

## 문제

위장 객체는 배경과의 차이가 미세하고 경계가 모호해서, 모델뿐 아니라 **사람 주석자에게도** 어렵다. 픽셀 단위 마스크를 그리는 데 큰 노력이 든다. 이 논문은 주석 부담을 줄이기 위해 **객체마다 점 하나**만 빠르게 찍은 라벨로 COD를 학습한다.

## 방법

### 힌트 영역 확장

점 하나는 너무 작은 감독 신호다. 먼저 원래의 점 라벨을 적응적으로 넓혀 **적절한 크기의 힌트 영역**으로 만든다.

### 어텐션 조절기

약한 라벨로 학습하면 모델이 객체 전체가 아니라 가장 눈에 띄는 일부분 주변만 찾는 경향이 있다. **어텐션 조절기**(attention regulator)는 라벨이 있는 영역을 일부 가려서, 모델의 주의가 객체 전체로 퍼지도록 만든다.

### 비지도 대조 학습

점 라벨만 있으면 위장 객체의 특징 표현이 불안정하다. 같은 이미지에 색을 바꾸거나 이동하는 등 서로 다른 증강을 적용한 이미지 쌍으로 **비지도 대조 학습**을 해, 표현을 안정시킨다.

## 실험

주요 COD 벤치마크 세 개에서 여러 약지도(weakly-supervised) 방법들을 다양한 지표에서 큰 차이로 앞섰다.

## 정리

COD에서 라벨링 비용은 특히 큰 문제라서, "얼마나 적은 라벨로 충분한가"는 실용적으로 중요한 질문이다. 점 라벨은 클릭 한 번이면 되는 가장 싼 라벨 중 하나다. 같은 해 ECCV의 [Noisy Pseudo Label 논문](/posts/noisy-pseudo-label-cod-eccv2024/)이 박스와 소량의 완전 라벨을 쓴 것과 비교해 보면, 라벨 종류와 비용, 성능 사이의 균형을 가늠할 수 있다.

점이 객체의 어디에 찍히느냐에 따라 확장된 힌트 영역이 달라지므로, 주석자마다 결과가 흔들릴 수 있다는 점은 확인해 볼 부분이다.
