---
title: 'OVSeg: Open-Vocabulary Semantic Segmentation with Mask-adapted CLIP'
description: 2단계 개방 어휘 분할의 병목이 마스크 영역을 잘 분류하지 못하는 CLIP에 있다는 것을 찾고, 마스크-텍스트 쌍 미세조정과 mask prompt tuning으로 해결한다.
pubDate: 2024-02-15 13:25:06 +0900
category: paper-review
tags: [open-vocabulary, clip, semantic-segmentation]
takeaways:
  - 마스크 후보를 만든 뒤 CLIP으로 분류하는 2단계 방식의 병목은, 마스킹된 이미지를 잘 분류하지 못하는 CLIP 자체다.
  - COCO Captions의 명사와 마스크 영역을 CLIP으로 짝지어 학습 데이터를 만들었고, 잡음이 있어도 다양한 데이터가 CLIP의 일반화를 더 잘 지켰다.
  - 마스크 이미지의 빈 영역을 학습 가능한 프롬프트로 채우는 mask prompt tuning으로, ADE20K-150에서 이전 최고보다 8.5%p 높은 29.6% mIoU를 냈다.
paper:
  title: Open-Vocabulary Semantic Segmentation with Mask-adapted CLIP
  authors: Feng Liang, Bichen Wu, Xiaoliang Dai, Kunpeng Li, Yinan Zhao, Hang Zhang, Peizhao Zhang, Peter Vajda, Diana Marculescu
  venue: CVPR 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/CVPR2023/html/Liang_Open-Vocabulary_Semantic_Segmentation_With_Mask-Adapted_CLIP_CVPR_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2023/papers/Liang_Open-Vocabulary_Semantic_Segmentation_With_Mask-Adapted_CLIP_CVPR_2023_paper.pdf
  code: https://github.com/facebookresearch/ov-seg
origin:
  name: Tistory
  url: https://jms3084.tistory.com/40
---

## 문제

개방 어휘 의미 분할(open-vocabulary semantic segmentation)은 학습 때 보지 못했을 수도 있는 텍스트 설명에 따라 이미지를 의미 영역으로 나누는 작업이다. 최근의 2단계 방법은 먼저 클래스와 무관한 마스크 후보를 만들고, 사전학습된 CLIP으로 마스크 영역을 분류한다.

얼핏 보면 마스크 품질이 병목일 것 같지만, 이 논문은 **CLIP이 병목**이라는 것을 찾아냈다. CLIP은 자연스러운 전체 이미지와 텍스트 쌍으로 학습했는데, 실제 추론에서는 객체 주변이 잘리고 나머지가 비어 있는 **마스크 이미지**를 받는다. 입력 분포가 달라 분류 성능이 크게 떨어진다.

## 방법

### 마스크-텍스트 쌍으로 CLIP 미세조정

마스크 영역과 그에 맞는 텍스트 설명의 모음으로 CLIP을 미세조정한다. 학습 데이터는 기존 이미지-캡션 데이터셋(COCO Captions)에서 캐낸다. 캡션의 명사를 뽑고, CLIP을 이용해 마스크 영역과 명사를 짝짓는다.

정확하게 수작업으로 라벨링했지만 클래스가 고정된 데이터(COCO-Stuff)와 비교하면, 이렇게 만든 데이터는 **잡음이 있지만 다양하다**. 실험해 보니 이쪽이 CLIP의 일반화 능력을 더 잘 지켰다. 미지의 클래스로 일반화하려면 라벨의 정확도보다 어휘의 다양성이 더 중요할 수 있다는 관찰이다.

### Mask prompt tuning

마스크 이미지의 빈 영역을 0이나 고정 색으로 두면 CLIP이 학습 때 본 적 없는 강한 패턴이 생긴다. 이 "빈" 영역을 **학습 가능한 프롬프트**로 채운다. 텍스트 프롬프트가 문장을 조정한다면, mask prompt는 이미지에서 비어 있는 문맥을 조정하는 시각적 프롬프트다.

mask prompt tuning만으로도 CLIP의 가중치를 전혀 바꾸지 않고 큰 향상을 얻었고, 전체를 미세조정한 모델에 더해도 추가로 좋아졌다.

## 실험

COCO로 학습하고 ADE20K-150에서 평가했을 때, 가장 좋은 모델이 29.6% mIoU로 이전 최고보다 8.5%p 높았다. 처음으로 개방 어휘 범용 모델이, 데이터셋별 적응 없이 2017년의 지도학습 전문 모델과 비슷한 성능에 도달했다.

## 정리

큰 모델을 가져다 쓰기 전에 **입력 분포가 맞는지부터 확인하라**는 좋은 사례다. "CLIP은 자연 이미지에서 강하다"와 "잘린 마스크 영역에서도 강하다"는 같은 말이 아니다.

캡션의 명사를 CLIP으로 짝짓는 과정에는 초기 CLIP의 편향이 그대로 들어가고, 캡션에 언급되지 않은 작은 객체는 학습 쌍에서 빠진다. 마스크 후보마다 CLIP을 돌려야 하는 2단계 구조는 계산량도 크다. 위장 객체처럼 마스크 후보 자체가 어려운 대상으로 확장한 연구는 [OVCOS](/posts/ovcos-ovcoser-eccv2024/)에서 이어진다.
