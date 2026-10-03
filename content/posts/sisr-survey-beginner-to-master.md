---
title: 'From Beginner to Master: A Survey for Deep Learning-based Single-Image Super-Resolution'
description: 딥러닝 기반 단일 영상 초해상도(SISR) 연구를 모델 이름이 아니라 설계 목표에 따라 정리한 서베이. 데이터셋, 업샘플링, 손실, 평가 방법까지 훑는다.
pubDate: 2023-11-16 22:26:08 +0900
category: paper-review
tags: [super-resolution, survey]
takeaways:
  - 딥러닝 기반 SISR 방법을 설계 목표에 따라 묶어, 모델을 외우기보다 연구를 읽는 틀을 준다.
  - 벤치마크 데이터셋, 업샘플링 방식, 최적화 목표, 화질 평가 방법을 먼저 정리하고, 대표 모델의 복원 결과를 직접 비교한다.
  - SISR은 하나의 순위표가 아니라 정확도(PSNR), 지각 품질, 연산량 사이의 선택 문제라는 점이 잘 드러난다.
paper:
  title: 'From Beginner to Master: A Survey for Deep Learning-based Single-Image Super-Resolution'
  authors: Juncheng Li, Zehua Pei, Wenjie Li, Guangwei Gao, Longguang Wang, Yingqian Wang, Tieyong Zeng
  venue: arXiv 2021
  year: 2021
  url: https://arxiv.org/abs/2109.14335
  pdf: https://arxiv.org/pdf/2109.14335
  code: https://github.com/CV-JunchengLi/SISR-Survey
origin:
  name: Tistory
  url: https://jms3084.tistory.com/37
---

## 어떤 서베이인가

단일 영상 초해상도(single-image super-resolution, SISR)는 저해상도 영상 한 장으로 고해상도 영상을 복원하는 문제다. 딥러닝이 들어오면서 크게 발전했고, 모델도 많아졌다. 이 서베이는 딥러닝 기반 SISR 방법들을 **설계 목표**에 따라 묶어 정리한다. 구성은 다음과 같다.

1. 문제 정의, 연구 배경, SISR의 의의
2. 관련 기반: 벤치마크 데이터셋, 업샘플링 방법, 최적화 목표, 화질 평가 방법
3. SISR 방법의 상세 분류와 분야별 응용
4. 대표 모델들의 복원 결과 비교
5. 남은 문제와 새로운 흐름, 앞으로의 방향

## 읽으면서 정리한 네 가지 축

처음 SISR 논문을 읽으면 EDSR, RCAN, ESRGAN, SwinIR처럼 모델 이름부터 외우게 된다. 이 서베이를 읽고 나면 새 논문을 볼 때 다음 네 가지를 먼저 확인하게 된다.

### 열화 과정

벤치마크는 대개 고해상도 영상을 bicubic으로 축소해 저해상도 입력을 만든다. 실제 카메라 영상에는 블러, 센서 잡음, 압축이 한꺼번에 섞인다. 같은 4배 복원이라도 입력을 어떻게 만들었는지에 따라 문제의 난도가 완전히 달라진다.

### 특징 추출과 업샘플링 위치

잔차 연결과 깊은 합성곱으로 시작해, 채널·공간 어텐션, 비지역 연산, 트랜스포머로 발전해 왔다. 업샘플링은 입력을 먼저 키우는 방식, 특징 공간에서 계산한 뒤 마지막에 키우는 방식, 배율을 점진적으로 높이는 방식으로 나뉜다. 어디서 해상도를 올리는지가 계산량에 직접 영향을 준다.

### 학습 목표

L1·L2 손실은 PSNR을 높이는 데 유리하지만 사람이 보기에 좋은 미세 질감을 항상 살리지는 못한다. 지각 손실(perceptual loss)과 적대적 학습은 더 그럴듯한 결과를 만들지만, 원본에 없던 질감을 만들어 낼 위험이 있다.

### 평가 조건

PSNR과 SSIM은 여전히 기본 지표지만 색 공간, 테두리 크롭 범위, 테스트 코드가 다르면 숫자가 쉽게 달라진다. 지각 품질을 다루는 논문은 정량 지표와 함께 실패 사례를 확인해야 한다.

## 정리

특정 모델을 추천받기보다, **SISR 논문을 읽는 순서**를 배우는 데 좋은 서베이다. 모델 구조보다 먼저 열화 모델, 학습 목표, 평가 방식을 확인하면, 논문이 실제로 해결한 조건과 남겨 둔 조건이 잘 보인다.

2021년에 정리된 자료라서 이후 크게 늘어난 확산 모델 기반 복원이나 실제 영상 초해상도 흐름은 담겨 있지 않다. 최신 모델 목록보다는 기본 좌표계로 쓰는 편이 맞다.
