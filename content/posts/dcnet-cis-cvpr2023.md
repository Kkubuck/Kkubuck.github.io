---
title: 'DCNet: Camouflaged Instance Segmentation via Explicit De-Camouflaging'
description: 위장 특성을 픽셀 수준에서 떼어 내고 인스턴스 수준에서 억제해, 위장 객체를 개체별로 분할한다.
pubDate: 2026-03-14 09:00:00 +0900
category: paper-review
tags: [cod, instance-segmentation, frequency]
takeaways:
  - 일반 인스턴스 분할 모델은 위장에 쉽게 속기 때문에, 위장 특성을 명시적으로 걷어 내는 De-camouflaging Network를 제안한다.
  - 픽셀 수준 모듈은 푸리에 변환으로 위장 특성을 추출하고, 차이 어텐션으로 위장 특성만 지운다.
  - 인스턴스 수준 모듈은 인스턴스 프로토타입과 신뢰할 수 있는 기준점으로 배경 잡음에 강한 유사도를 만든다.
paper:
  title: Camouflaged Instance Segmentation via Explicit De-Camouflaging
  authors: Naisong Luo, Yuwen Pan, Rui Sun, Tianzhu Zhang, Zhiwei Xiong, Feng Wu
  venue: CVPR 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/CVPR2023/html/Luo_Camouflaged_Instance_Segmentation_via_Explicit_De-Camouflaging_CVPR_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2023/papers/Luo_Camouflaged_Instance_Segmentation_via_Explicit_De-Camouflaging_CVPR_2023_paper.pdf
---

## 문제

**위장 인스턴스 분할**(Camouflaged Instance Segmentation, CIS)은 위장 객체를 하나의 전경으로 묶지 않고, 개체마다 따로 마스크를 예측하는 작업이다. 대상은 주로 주변 환경에 맞춰 외형을 바꾼 야생 동물이다. 일반 인스턴스 분할 모델은 이런 기만적인 위장에 쉽게 속아 성능이 크게 떨어진다.

## 방법

DCNet(De-camouflaging Network)은 위장을 명시적으로 걷어 내는 두 모듈로 이루어진다.

### 픽셀 수준: 위장 분리

- 푸리에 변환을 이용해 픽셀 특징에서 **위장 특성**을 추출한다.
- **차이 어텐션**(difference attention)으로 위장 특성은 지우고 대상 객체의 특성은 남긴다.

배경을 흉내 내는 성분을 따로 떼어 내, 특징에서 위장의 영향을 줄이는 단계다.

### 인스턴스 수준: 위장 억제

- **인스턴스 프로토타입**으로 여러 픽셀의 정보를 모아 인스턴스 단위의 풍부한 표현을 만든다.
- 분할할 때 배경 잡음의 영향을 줄이기 위해 **신뢰할 수 있는 기준점**(reference point)을 몇 개 골라, 더 견고한 유사도 측정에 쓴다.

## 실험

COD10K와 NC4K의 인스턴스 분할 벤치마크에서 기존 CIS 방법보다 평균 정밀도(AP)가 5% 이상 높았다.

## 정리

COD가 객체의 위치를 찾는 데 집중했다면, CIS는 붙어 있는 여러 개체를 **구분**해야 한다는 점에서 더 어렵다. 위장 특성을 주파수 영역에서 분리한다는 아이디어는 FDCOD 같은 주파수 기반 COD와도 이어진다. 개방 어휘 인스턴스 분할로 넘어가는 최근 흐름(OVCIS)을 읽을 때 기준 모델로 다시 보게 되는 논문이다.

위장 특성과 대상 특성이 항상 주파수 성분으로 깔끔하게 나뉘는 것은 아니어서, 무늬가 객체 고유의 특징인 경우 함께 지워질 위험이 있다.
