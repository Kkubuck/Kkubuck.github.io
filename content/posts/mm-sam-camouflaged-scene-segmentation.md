---
title: Multi-modal Segment Anything Model for Camouflaged Scene Segmentation
description: 사람이 프롬프트를 주지 않아도 BLIP으로 만든 캡션과 시각 임베딩을 SAM에 넣어, 위장 장면을 분할한다.
pubDate: 2026-03-29 09:00:00 +0900
category: paper-review
tags: [cod, sam, multimodal]
takeaways:
  - SAM을 수동 프롬프트 없이 위장 장면에 쓰기 위해, 멀티모달 프롬프트로 이미지의 의미 정보를 추가로 준다.
  - BLIP으로 캡션을 만들어 텍스트 임베딩을 얻고, BLIP의 시각 인코더로 시각 임베딩을 얻어 함께 SAM에 넣는다.
  - 다단계 어댑터로 멀티모달 정보를 통합하고 SAM의 dense embedding을 이미지 임베딩으로 바꿔, 세 벤치마크 12개 지표 중 11개에서 최고 성능을 냈다.
paper:
  title: Multi-modal Segment Anything Model for Camouflaged Scene Segmentation
  authors: Guangyu Ren, Hengyan Liu, Michalis Lazarou, Tania Stathaki
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.pdf
  code: https://github.com/ic-qialanqian/Vision-Language-SAM
---

## 문제

위장 장면의 객체는 색, 질감, 모양까지 배경과 비슷해서 사람에게도 컴퓨터 비전 시스템에게도 찾기 어렵다. SAM은 강력한 분할 모델이지만 점이나 박스 같은 **프롬프트**가 필요하고, 위장 객체에는 사람이 정확한 프롬프트를 주기도 어렵다. 이 논문은 **수동 프롬프트 없이** SAM을 위장 장면 분할에 쓰는 방법을 제안한다.

## 방법

핵심은 **멀티모달 프롬프트**에서 얻는 풍부한 정보다.

### BLIP으로 만든 텍스트·시각 임베딩

1. BLIP 모델로 이미지 캡션을 생성하고, 텍스트 인코더로 텍스트 임베딩을 얻는다.
2. BLIP의 시각 인코더로 시각 임베딩을 얻는다.
3. 두 임베딩을 SAM에 함께 넣어 이미지에 대한 추가 의미 정보를 준다.

### 구조 변경

- **다단계 어댑터**(multi-level adapter): 멀티모달 정보를 SAM 안에 효과적으로 통합한다.
- **dense embedding 교체**: SAM의 dense embedding(원래는 마스크 프롬프트용)을 SAM 이미지 인코더의 이미지 임베딩으로 바꾼다.

## 실험

위장 객체 탐지 세 벤치마크에서 12개 지표 중 11개로 최고 성능을 냈다. 의료 영상 분할 같은 다른 작업에도 적용해, 최신 방법과 비슷하거나 더 나은 성능을 보였다.

## 정리

SAM 기반 COD의 공통 과제인 "프롬프트를 어디서 얻을 것인가"에, **다른 기반 모델이 만든 텍스트와 시각 정보**로 답한 논문이다. 같은 그룹이 ICCV 2025에 함께 낸 [ARM](/posts/adaptive-refinement-arm-cod/)은 이렇게 외부 모델이 만든 정보에 도메인 편향이 섞일 수 있다는 점을 짚고, 정보를 걸러 넣는 방향으로 이어진다. 두 논문을 함께 읽으면 좋다.

BLIP의 캡션이 위장 객체를 아예 언급하지 않는 경우, 텍스트 임베딩은 배경 쪽 의미만 담게 된다. 그런 장면에서 성능이 어떻게 변하는지가 궁금한 부분이다.
