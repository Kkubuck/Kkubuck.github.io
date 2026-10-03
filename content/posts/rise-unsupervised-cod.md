---
title: 'Beyond Single Images: Retrieval Self-Augmented Unsupervised Camouflaged Object Detection'
description: 학습 데이터셋 전체에서 환경과 위장 객체의 프로토타입을 만들고, KNN 검색으로 이미지마다 의사 마스크를 생성하는 비지도 COD(RISE).
pubDate: 2026-04-02 09:00:00 +0900
category: paper-review
tags: [cod, unsupervised]
takeaways:
  - 기존 방법은 이미지 한 장 단위로만 모델링하거나 라벨에 의존해, 데이터셋 전체의 맥락 정보를 활용하지 못했다.
  - 정답 없이 학습 이미지만으로 환경·위장 객체 프로토타입 라이브러리를 만들고(Clustering-then-Retrieval), KNN 검색으로 의사 마스크를 만든다.
  - 여러 시점의 검색 결과를 합치는 Multi-View KNN Retrieval로 특징 지도의 잡음을 줄여, 비지도·프롬프트 기반 방법을 크게 앞섰다.
paper:
  title: 'Beyond Single Images: Retrieval Self-Augmented Unsupervised Camouflaged Object Detection'
  authors: Ji Du, Xin Wang, Fangwei Hao, Mingyang Yu, Chunyuan Chen, Jiesheng Wu, Bin Wang, Jing Xu, Ping Li
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
  code: https://github.com/xiaohainku/RISE
---

## 문제

기존 COD 연구는 주로 **이미지 한 장 단위의 모델링**이나 **라벨 기반 최적화**로 문제를 풀었다. 이 방식은 데이터셋 전체에 담긴 맥락 정보를 거의 쓰지 못하거나, 많은 주석 노동이 필요하다. RISE(RetrIeval SElf-augmented)는 **학습 데이터셋 전체**를 활용해 이미지 한 장의 의사 라벨을 만들고, 이 라벨로 COD 모델을 학습한다.

## 방법

### 프로토타입 라이브러리 만들기

정답 마스크 없이 학습 이미지만으로 **환경**과 **위장 객체**의 프로토타입 라이브러리를 만든다. 라벨이 없으니 질 좋은 프로토타입을 만드는 것 자체가 어렵다. 그래서 Clustering-then-Retrieval(CR) 전략을 쓴다.

1. 클러스터링으로 거친 마스크를 만든다.
2. 히스토그램 기반으로 이미지를 걸러 낸다.
3. 범주를 넘나드는 검색(cross-category retrieval)으로 신뢰도 높은 프로토타입만 남긴다.

### KNN 검색으로 의사 마스크 만들기

이미지마다 라이브러리에서 K-최근접 이웃(KNN)을 검색해, 각 위치가 환경에 가까운지 위장 객체에 가까운지로 의사 마스크를 만든다.

### Multi-View KNN Retrieval (MVKR)

특징 지도에는 아티팩트가 섞여 있어 검색이 흔들릴 수 있다. 여러 시점(view)의 검색 결과를 합쳐 더 견고하고 정확한 의사 마스크를 만든다.

## 실험

최신 비지도 방법과 프롬프트 기반 방법들을 크게 앞섰다.

## 정리

같은 저자들의 [EASE](/posts/ease-environment-aware-unsupervised-cod/)(CVPR 2025)가 외부 대형 모델로 환경 라이브러리를 만들었다면, RISE는 **학습 이미지 자신**에서 환경과 객체의 프로토타입을 모두 만든다. 이미지 한 장으로는 약한 단서를 데이터셋 전체에서 끌어온다는 "beyond single images"라는 제목이 잘 맞는다.

데이터셋 전체를 검색하는 만큼 데이터셋 규모가 커지면 라이브러리 구축과 검색 비용이 늘고, 데이터셋에 없는 종류의 환경에서는 검색 품질이 떨어질 수 있다.
