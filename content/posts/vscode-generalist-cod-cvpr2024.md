---
title: 'VSCode: General Visual Salient and Camouflaged Object Detection with 2D Prompt Learning'
description: 도메인(RGB·깊이·열·영상)과 작업(SOD·COD)을 두 축의 프롬프트로 나눠, 하나의 모델로 여러 현저·위장 객체 탐지 작업을 함께 푼다.
pubDate: 2026-03-20 09:00:00 +0900
category: paper-review
tags: [cod, sod, multimodal]
takeaways:
  - SOD와 COD는 관련 있지만 다른 이진 분할 작업이고, 여러 모달리티가 공통 단서와 고유 단서를 함께 가진다.
  - VST를 기반 모델로 두고, 도메인과 작업을 각각의 차원으로 하는 2D 프롬프트를 인코더-디코더에 넣는다.
  - 6개 작업, 26개 데이터셋에서 최고 성능을 냈고, 프롬프트를 조합해 RGB-D COD 같은 처음 보는 작업에도 zero-shot으로 일반화한다.
paper:
  title: 'VSCode: General Visual Salient and Camouflaged Object Detection with 2D Prompt Learning'
  authors: Ziyang Luo, Nian Liu, Wangbo Zhao, Xuguang Yang, Dingwen Zhang, Deng-Ping Fan, Fahad Khan, Junwei Han
  venue: CVPR 2024
  year: 2024
  url: https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf
  code: https://github.com/Sssssuperior/VSCode
---

## 문제

현저 객체 탐지(SOD)와 위장 객체 탐지(COD)는 서로 관련 있지만 성격이 다른 이진 분할 작업이다. 여기에 RGB, 깊이(RGB-D), 열화상(RGB-T), 영상 같은 여러 모달리티가 붙으면서, 작업마다 따로 설계한 전문 모델(specialist)이 늘어났다. 이런 방식은 중복이 많고, 작업 사이의 공통점을 살리지 못해 결과도 최적이 아닐 수 있다.

## 방법

VSCode는 하나의 범용 모델(generalist)로 여러 SOD와 COD 작업을 함께 푼다.

### 2D 프롬프트

현저 객체 탐지용 트랜스포머인 VST를 기반 모델로 쓰고, 인코더-디코더 구조 안에 **두 축의 프롬프트**를 넣는다.

- **도메인 프롬프트**: RGB, 깊이, 열화상, 영상처럼 입력 모달리티의 고유한 지식을 담는다.
- **작업 프롬프트**: SOD인지 COD인지, 작업의 고유한 지식을 담는다.

두 지식을 서로 다른 차원으로 나눠 배우기 때문에, 처음 보는 조합도 프롬프트를 조합해 만들 수 있다.

### 프롬프트 판별 손실

프롬프트끼리 비슷해지면 도메인과 작업의 고유성이 흐려진다. 프롬프트 판별 손실(prompt discrimination loss)로 각 프롬프트가 고유한 특성을 갖도록 분리해 최적화를 돕는다.

## 실험

학습에는 SOD 4가지(RGB, RGB-D, RGB-T, 영상)와 COD(RGB, 영상) 작업을 함께 썼고, 6개 작업 26개 데이터셋에서 기존 최고 성능 모델을 앞섰다. RGB-D COD처럼 학습 때 보지 못한 작업에서도 2D 프롬프트를 조합해 zero-shot으로 일반화하는 능력을 보였다.

## 정리

Joint SOD-COD(CVPR 2021)가 두 작업의 상반된 정보를 서로의 학습 신호로 썼다면, VSCode는 한 걸음 더 나아가 **모달리티와 작업을 분해 가능한 프롬프트**로 표현했다. 프롬프트 조합으로 새 작업에 대응한다는 아이디어가 특히 흥미롭다.

다만 범용 모델은 데이터셋이 많은 작업 쪽으로 학습이 치우칠 수 있다. 저자들은 이후 Mixture of Prompt Experts와 2단계 학습을 더한 확장판 VSCode-v2를 TPAMI에 발표했다.
