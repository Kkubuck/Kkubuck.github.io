---
title: 'OVCoser: Open-Vocabulary Camouflaged Object Segmentation'
description: 위장 객체를 분할하면서 처음 보는 클래스 이름까지 붙이는 새 작업(OVCOS)과 데이터셋 OVCamo, 고정된 CLIP 기반의 기준 모델 OVCoser를 제안한다.
pubDate: 2026-03-24 09:00:00 +0900
category: paper-review
tags: [cod, open-vocabulary, clip, dataset]
takeaways:
  - 기존 개방 어휘 분할 데이터셋에는 복잡한 장면에 숨은 위장 객체가 거의 없어, 새 작업 OVCOS와 11,483장 규모의 OVCamo 데이터셋을 만들었다.
  - 파라미터를 고정한 CLIP 위에 반복적 의미 안내와 구조 강화를 더한 단일 단계 트랜스포머 기준 모델 OVCoser를 제안한다.
  - 클래스 의미 지식에 경계와 깊이의 시각 구조 단서를 더해, OVCamo에서 기존 개방 어휘 의미 분할 방법들을 크게 앞섰다.
paper:
  title: Open-Vocabulary Camouflaged Object Segmentation
  authors: Youwei Pang, Xiaoqi Zhao, Jiaming Zuo, Lihe Zhang, Huchuan Lu
  venue: ECCV 2024
  year: 2024
  url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/6409_ECCV_2024_paper.php
  pdf: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/06409.pdf
  code: https://github.com/lartpang/OVCamo
---

## 문제

CLIP 같은 대규모 비전-언어 모델(VLM)이 나오면서 개방 세계의 객체 인식이 가능해졌다. 추론 시점에 처음 보는 클래스까지 인식해야 하는 개방 어휘 조밀 예측(open-vocabulary dense prediction)에 사전학습 VLM을 쓰는 연구도 많다.

그런데 기존 연구들은 관련 작업의 공개 데이터셋으로 실험한다. 이 데이터셋들은 개방 어휘를 위해 만든 것이 아니고, 수집 편향과 주석 비용 때문에 **복잡한 장면에 숨은 위장 객체**는 거의 들어 있지 않다. 기존 COD는 반대로 객체 종류와 상관없이 모든 위장 영역을 하나의 전경으로 분할한다. 위장 객체를 찾으면서 **무엇인지까지** 말하는 문제는 비어 있었다.

## 방법

### 새 작업 OVCOS와 데이터셋 OVCamo

개방 어휘 위장 객체 분할(open-vocabulary camouflaged object segmentation, OVCOS)이라는 새 작업을 정의하고, 직접 고른 11,483장의 이미지에 정밀한 마스크와 객체 클래스를 단 대규모 복잡 장면 데이터셋 **OVCamo**를 만들었다. 학습에 쓰는 클래스와 평가에만 나오는 클래스를 나눠, 처음 보는 클래스로의 일반화를 평가한다.

### 기준 모델 OVCoser

파라미터를 고정한 CLIP 위에 붙이는 단일 단계 트랜스포머다. CLIP의 의미 공간은 그대로 두고 위장 객체에 필요한 부분만 학습해, 학습 클래스에 과적합되어 개방 어휘 능력을 잃는 것을 막는다.

- **반복적 의미 안내**(iterative semantic guidance): 클래스의 의미 지식으로 객체 후보를 반복해서 좁혀 간다.
- **구조 강화**(structure enhancement): 경계와 깊이 정보로 시각 구조 단서를 보충한다. 색과 질감이 배경과 같아도 윤곽과 3D 구조에서 차이가 드러날 수 있다.

## 실험

OVCamo에서 기존 개방 어휘 의미 분할 방법들의 최고 성능을 큰 차이로 앞섰다.

## 정리

COD를 이진 분할에서 **장면 이해**로 넓힌 출발점이 되는 논문이다. 언어가 "무엇"을, 경계와 깊이가 "어디에 어떤 모양으로"를 맡는 역할 분담이 명확하다. 이후 SuCLIP 같은 OVCOS 연구들이 이 데이터셋과 기준 모델을 비교 대상으로 쓴다.

평가 클래스가 정말 "처음 보는" 것인지는 CLIP의 사전학습 데이터를 다 알 수 없어 엄밀히 따지기 어렵다. "개구리"와 "동물"처럼 수준이 다른 클래스 이름에 따라 평가가 달라질 수 있다는 점도 함께 볼 부분이다. OVCOS 논문들을 비교할 때 고정해야 할 조건은 [OVCOS 비교표를 만들기 전에 고정할 것들](/posts/ovcos-comparison-protocol/)에 따로 정리했다.
