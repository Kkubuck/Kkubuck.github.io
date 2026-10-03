---
title: Uncertainty-Aware Joint Salient Object and Camouflaged Object Detection
description: 정반대 성격의 두 작업, 현저 객체 탐지(SOD)와 위장 객체 탐지(COD)를 함께 학습해 서로의 성능을 끌어올린다.
pubDate: 2026-03-07 09:00:00 +0900
category: paper-review
tags: [cod, sod, uncertainty]
takeaways:
  - 눈에 띄는 객체를 찾는 SOD와 숨은 객체를 찾는 COD의 상반된 정보를 서로의 학습 신호로 쓴다.
  - COD 데이터의 쉬운 양성 샘플을 SOD의 어려운 양성 샘플로 재활용하고, 유사도 측정 모듈로 두 작업의 상반된 속성을 모델링한다.
  - 두 데이터셋의 라벨 불확실성을 고려해 적대적 학습으로 고차 유사도와 네트워크 신뢰도를 함께 추정한다.
paper:
  title: Uncertainty-Aware Joint Salient Object and Camouflaged Object Detection
  authors: Aixuan Li, Jing Zhang, Yunqiu Lv, Bowen Liu, Tong Zhang, Yuchao Dai
  venue: CVPR 2021
  year: 2021
  url: https://openaccess.thecvf.com/content/CVPR2021/html/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2021/papers/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.pdf
  code: https://github.com/JingZhang617/Joint_COD_SOD
---

## 문제

현저 객체 탐지(SOD)는 사람의 시선을 끄는 객체를 찾고, 위장 객체 탐지(COD)는 주변에 숨은 객체를 찾는다. 겉으로는 정반대 작업이다. 이 논문은 바로 그 **상반된 정보**를 이용해 두 작업을 모두 개선할 수 있다고 본다. 두 작업 모두 출력이 이진 분할 마스크이고, 객체와 배경의 시각적 대비라는 같은 축 위에서 서로 반대쪽 끝에 있기 때문이다.

## 방법

### COD의 쉬운 샘플을 SOD의 어려운 샘플로

COD 데이터셋에도 비교적 잘 보이는 객체가 있다. COD 기준으로는 쉬운 양성 샘플이지만, SOD 기준으로는 눈에 덜 띄는 **어려운 양성 샘플**이다. 이 샘플을 SOD 학습에 넣어, 뚜렷한 객체만 찾는 습관을 줄이고 SOD 모델을 더 견고하게 만든다.

### 유사도 측정 모듈

두 데이터셋을 그냥 합치면 작업의 정체성이 흐려질 수 있다. 그래서 similarity measure 모듈을 두어 두 작업의 상반된 속성을 명시적으로 모델링한다.

### 불확실성을 고려한 적대적 학습

SOD와 COD 데이터셋 모두 라벨에 불확실성이 있다. 경계가 모호하고, 같은 장면도 보는 사람에 따라 다르게 라벨링될 수 있다. 저자들은 적대적 학습 네트워크를 두어 고차 유사도를 측정하는 동시에 네트워크의 신뢰도(confidence)를 추정한다. 불확실한 영역을 확정적인 정답처럼 밀어붙이지 않으려는 장치다.

## 실험

SOD와 COD 벤치마크 모두에서 당시 최고 성능을 보고했다. 공동 학습 논문은 한쪽 성능을 희생해 다른 쪽만 올리는 경우가 많은데, 여기서는 두 작업 모두 좋아졌다는 점이 의미 있다. 절제 실험으로 샘플 재활용, 유사도 측정, 적대적 학습이 각각 기여하는 정도를 확인할 수 있다.

## 정리

새 데이터를 만들지 않고도, **한 작업의 쉬운 예시를 다른 작업의 어려운 예시로 재배치**해 결정 경계를 풍부하게 만들었다는 아이디어가 좋다. 이후 VSCode처럼 하나의 모델로 SOD와 COD를 함께 다루는 연구를 읽을 때, 두 작업이 무엇을 공유하고 어디서 갈라지는지 생각하는 출발점이 된다.

다만 "눈에 띈다"와 "숨어 있다"는 깔끔한 이분법이 아니다. 같은 장면도 해상도나 크롭에 따라 다르게 보이고, 데이터셋마다의 촬영 스타일 차이를 작업 차이로 오인할 위험도 있다.
