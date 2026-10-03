---
title: 'Shift the Lens: Environment-Aware Unsupervised Camouflaged Object Detection'
description: 위장 객체 대신 눈에 잘 띄는 환경(배경)을 먼저 찾고, 그 결과를 뒤집어 위장 객체를 검출하는 비지도 COD 방법(EASE).
pubDate: 2026-03-27 09:00:00 +0900
category: paper-review
tags: [cod, unsupervised, sam]
takeaways:
  - 위장 객체를 환경에서 떼어 내는 대신, 반대로 두드러지는 환경을 위장 객체에서 떼어 내는 쪽으로 관점을 바꾼다.
  - 대형 멀티모달 모델, 확산 모델, 비전 기반 모델로 환경 프로토타입 라이브러리를 만들고(DiffPro), 세 가지 검색 방식으로 환경을 찾는다.
  - COD10K에서 기존 비지도 방법보다 평균 10% 이상 좋아졌고, SAM과 결합하면 완전 지도 방법과 견줄 만하다.
paper:
  title: 'Shift the Lens: Environment-Aware Unsupervised Camouflaged Object Detection'
  authors: Ji Du, Fangwei Hao, Mingyang Yu, Desheng Kong, Jiesheng Wu, Bin Wang, Jing Xu, Ping Li
  venue: CVPR 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/CVPR2025/html/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2025/papers/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.pdf
  code: https://github.com/xiaohainku/EASE
---

## 문제

기존 COD 연구는 위장 객체를 환경에서 **떼어 내는** 데 집중해 왔다. 성능은 계속 좋아졌지만 대규모 주석과 복잡한 최적화가 필요했다. 이 논문은 관점을 뒤집는다. 위장 객체는 찾기 어렵지만, 그 객체가 숨어 있는 **환경은 오히려 두드러진다.** 환경을 먼저 찾고 나머지를 위장 객체로 보면 라벨 없이도 검출할 수 있다.

## 방법

EASE(Environment-Aware unSupErvised COD)는 환경 프로토타입 라이브러리를 참조해 환경을 식별하고, 검색된 환경 특징을 **뒤집어** 위장 객체를 검출한다.

### 환경 프로토타입 라이브러리 (DiffPro)

대형 멀티모달 모델, 확산 모델, 비전 기반 모델을 함께 써서 환경 프로토타입 라이브러리를 만든다. 정답 마스크 없이도 "이런 장면에는 이런 환경이 있다"는 대표 특징을 모아 두는 것이다.

### 세 가지 검색 방식

라이브러리에서 환경을 검색할 때 전경과 배경을 헷갈리지 않도록 세 방식을 쓴다.

- **KDE-AT**: 커널 밀도 추정(Kernel Density Estimation)으로 검색 임계값을 이미지마다 적응적으로 정한다.
- **G2L**: 전역에서 지역 픽셀 단위로(Global-to-Local) 좁혀 가며 검색한다.
- **SR**: 이미지 자기 자신에서 다시 검색한다(Self-Retrieval).

## 실험

현재 비지도 방법들보다 크게 좋아졌고, COD10K에서는 평균 10% 이상 향상됐다. SAM과 결합하면 프롬프트 기반 분할 방법을 넘어서고, 최신 완전 지도 방법과도 견줄 만한 성능을 낸다.

## 정리

"숨은 것을 찾기 어렵다면, 숨긴 쪽을 찾자"는 발상의 전환이 이 논문의 핵심이다. 같은 저자들의 [RISE](/posts/rise-unsupervised-cod/)(ICCV 2025)는 환경뿐 아니라 위장 객체의 프로토타입도 학습 이미지에서 직접 만들어, 이 검색 기반 비지도 COD를 한 단계 더 밀고 나간다.

라이브러리를 만드는 데 대형 멀티모달 모델과 확산 모델을 여러 개 쓰므로, "비지도"라고 해도 준비 비용은 결코 작지 않다. 배경 자체가 다양하거나 처음 보는 환경에서는 라이브러리 검색이 흔들릴 수 있다.
