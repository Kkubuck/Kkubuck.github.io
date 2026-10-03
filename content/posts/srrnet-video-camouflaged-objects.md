---
title: 'Scoring, Remember, and Reference: Catching Camouflaged Objects in Videos'
description: 사람의 기억-인식 과정에서 착안해, 예측 점수로 고른 과거 프레임을 기억으로 참조하며 영상 속 위장 객체를 찾는 SRR.
pubDate: 2026-03-28 09:00:00 +0900
category: paper-review
tags: [cod, video]
takeaways:
  - 기존 모델은 위장 객체의 구분되지 않는 외형과, 영상의 동적 정보를 충분히 쓰지 못하는 문제로 영상 위장 객체 탐지에서 고전한다.
  - 마스크와 점수를 함께 내는 이중 목적 디코더로 참조 프레임을 고르고, 참조 기반 다단계 비대칭 어텐션으로 장기 참조 정보와 단기 움직임 단서를 합친다.
  - 영상을 한 번만 통과하는 54M 파라미터 모델로, 벤치마크에서 기존 방법보다 약 10% 높은 성능을 냈다.
paper:
  title: 'Scoring, Remember, and Reference: Catching Camouflaged Objects in Videos'
  authors: Yu'ang Feng, Shuyong Gao, Fuzhen Yan, Yicheng Song, Lingyi Hong, Junjie Hu, Wenqiang Zhang
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.pdf
---

## 문제

영상 위장 객체 탐지(VCOD)는 주변과 외형이 아주 비슷한 객체를 영상에서 분할하는 작업이다. 기존 비전 모델은 두 가지 이유로 고전한다. 위장 객체의 외형이 구분되지 않고, 영상의 **동적 정보**를 충분히 활용하지 못한다.

사람은 영상을 볼 때 앞에서 본 장면을 **기억**해 두고, 지금 프레임을 그 기억과 비교하며 인식한다. SRR은 이 기억-인식 과정을 본떴다.

## 방법

### Scoring: 이중 목적 디코더

디코더가 예측 마스크와 함께 **점수**를 동시에 낸다. 점수는 어떤 프레임을 참조 프레임으로 기억해 둘지 고르는 데 쓰이고, 동시에 보조 감독 신호가 되어 특징 추출을 강화한다.

### Remember: 메모리 참조 프레임

점수가 높은, 즉 예측을 믿을 만한 과거 프레임을 메모리에 저장해 이후 프레임을 처리할 때 참조한다.

### Reference: 참조 기반 다단계 비대칭 어텐션

참조 프레임에서 오는 **장기 정보**와, 이웃 프레임에서 오는 **단기 움직임 단서**를 비대칭 어텐션으로 여러 단계에 걸쳐 합친다.

## 실험

벤치마크 데이터셋에서 기존 방법보다 약 10% 높은 성능을 냈다. 파라미터는 54M으로 더 적고, 영상을 **한 번만** 통과하면 된다.

## 정리

[SLT-Net](/posts/implicit-motion-vcod-cvpr2022/)이 짧은 움직임과 긴 일관성을 따로 다뤘고, [TSP-SAM](/posts/tsp-sam-vcod-cvpr2024/)이 움직임을 SAM의 프롬프트로 바꿨다면, SRR은 **어떤 과거 프레임을 기억할지 스스로 점수를 매긴다**는 점이 새롭다. 비디오 객체 분할(VOS)의 메모리 기반 방법을 위장 객체에 맞게 가져온 것으로도 읽을 수 있다.

점수가 높다고 예측이 맞는 것은 아니므로, 모델이 확신하며 틀린 프레임이 메모리에 들어가면 오류가 이후 프레임으로 이어질 수 있다.
