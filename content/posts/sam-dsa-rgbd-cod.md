---
title: 'SAM-DSA: Improving SAM for Camouflaged Object Detection via Dual Stream Adapters'
description: SAM 구조는 그대로 두고, RGB와 깊이 영상을 위한 이중 스트림 어댑터와 양방향 지식 증류로 RGB-D 위장 객체 탐지 성능을 높인다.
pubDate: 2026-04-01 09:00:00 +0900
category: paper-review
tags: [cod, sam, depth]
takeaways:
  - SAM은 자연 이미지에서는 강하지만 위장 객체 탐지에서는 성능이 만족스럽지 않다. RGB-D 입력으로 이를 보완한다.
  - 이미지 인코더의 어텐션 블록에 병렬 이중 스트림 어댑터를 넣고, 마스크 디코더와 깊이용 복제본으로 두 스트림의 마스크를 예측한다.
  - 모델·모달 증류기로 이루어진 양방향 지식 증류가 두 스트림 임베딩의 연관을 강화해, 네 COD 벤치마크에서 SAM 대비 큰 향상을 보였다.
paper:
  title: Improving SAM for Camouflaged Object Detection via Dual Stream Adapters
  authors: Jiaming Liu, Linghe Kong, Guihai Chen
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.pdf
---

## 문제

SAM(Segment Anything Model)은 자연 이미지에서 범용 분할 성능이 뛰어나지만, 위장 객체 탐지에서는 성능이 만족스럽지 않다. 색과 질감이 배경과 같은 위장 객체는 RGB만으로는 구분 단서가 부족하다. SAM-DSA는 **깊이 영상**을 함께 넣어 RGB-D 입력으로 COD를 푼다.

## 방법

SAM의 구조는 그대로 유지한 채 어댑터와 디코더만 확장한다.

### 이중 스트림 어댑터

이미지 인코더에 RGB용과 깊이용 **이중 스트림 어댑터**를 붙여, 두 영상의 상호 보완적인 정보를 학습한다. 어댑터는 인코더의 어텐션 블록 안에 **병렬로** 들어가, 두 종류의 이미지 임베딩을 서로 다듬고 바로잡는다. 마스크 디코더와, 이를 복제한 깊이용 디코더를 미세조정해 두 스트림의 마스크를 각각 예측한다.

### 양방향 지식 증류

두 스트림의 임베딩은 서로 직접 상호작용하지 않아 채널 사이에 차이가 생긴다. 이를 줄이기 위해 **모델 증류기**(model distiller)와 **모달 증류기**(modal distiller)로 이루어진 양방향 지식 증류로 두 임베딩의 연관을 강화한다.

### 프롬프트 갱신

RGB와 깊이 어텐션 지도의 마스크를 예측할 때, 두 이미지 임베딩을 합쳐 프롬프트 임베딩과 함께 학습해 초기 프롬프트를 갱신한다. 그다음 마스크 디코더에 넣어 이미지 임베딩과 프롬프트 임베딩의 일관성을 맞춘다.

## 실험

네 COD 벤치마크에서 SAM보다 크게 향상됐고, 같은 미세조정 방식 안에서 최고 성능을 냈다.

## 정리

기반 모델을 통째로 미세조정하지 않고 **어댑터만 붙여** 새로운 모달리티를 넣는 방식은, SAM 기반 연구에서 계산량과 성능의 균형을 잡는 흔한 해법이다. 이 논문은 거기에 두 스트림을 연결하는 증류를 더했다는 점이 다르다. 깊이를 다룬다는 점에서 [PopNet](/posts/source-free-depth-pop-out-iccv2023/)이 추정 깊이를 사전 지식으로 쓴 것과 비교해 볼 만하다.

깊이 영상이 있어야 한다는 전제가 있으므로, 깊이를 추정해서 쓰는 경우 추정 오류가 성능에 미치는 영향을 함께 봐야 한다.
