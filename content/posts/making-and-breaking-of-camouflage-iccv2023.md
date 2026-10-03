---
title: The Making and Breaking of Camouflage
description: 위장이 얼마나 효과적인지 자동으로 재는 점수를 만들고, 이를 생성 모델의 손실로 써서 위장 영상을 합성해 학습 데이터로 활용한다.
pubDate: 2026-03-18 09:00:00 +0900
category: paper-review
tags: [cod, video, synthetic-data]
takeaways:
  - 윤곽이 조금만 보이거나 색이 살짝 달라도 위장은 깨진다. 무엇이 위장을 성공하게 하는지 측정하는 세 가지 점수를 제안한다.
  - 위장 정도는 전경-배경 특징의 유사도와 경계의 가시성으로 잴 수 있으며, 이 점수로 기존 위장 데이터셋들을 비교했다.
  - 점수를 생성 모델의 보조 손실로 넣어 위장 이미지·영상을 대량으로 합성하고, 이 데이터로 학습한 모델이 MoCA-Mask에서 최고 성능을 냈다.
paper:
  title: The Making and Breaking of Camouflage
  authors: Hala Lamdouar, Weidi Xie, Andrew Zisserman
  venue: ICCV 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/ICCV2023/html/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2023/papers/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.pdf
---

## 문제

모든 위장이 똑같이 효과적인 것은 아니다. 윤곽이 일부만 보이거나 색이 조금만 달라도 동물이 눈에 띄고 위장이 깨진다. 이 논문은 **무엇이 위장을 성공하게 만드는가**라는 질문에서 출발한다. 위장을 잘 측정할 수 있다면, 위장 데이터를 평가하는 데도, 새로 만드는 데도 쓸 수 있다.

## 방법

### 위장 점수

위장의 효과를 자동으로 평가하는 세 가지 점수를 제안한다. 핵심은 두 가지 관점이다.

- **전경과 배경 특징의 유사도**: 객체의 외형이 주변 배경과 얼마나 비슷한가.
- **경계의 가시성**: 객체의 윤곽이 얼마나 드러나는가.

이 점수로 공개된 위장 데이터셋들을 모두 평가하고 비교했다. 데이터셋마다 위장의 난이도가 얼마나 다른지 정량적으로 볼 수 있게 된 셈이다.

### 위장 합성 (making)

위장 점수를 **생성 모델의 보조 손실**로 넣으면, 위장이 잘 된 이미지나 영상을 대량으로 합성할 수 있다. 사람이 일일이 위장 영상을 찾아 라벨링하지 않아도 학습 데이터를 늘릴 수 있다.

### 위장 깨기 (breaking)

합성한 데이터셋으로 영상 속 위장 동물을 분할하는 트랜스포머 기반 모델을 학습한다.

## 실험

공개 벤치마크인 MoCA-Mask에서 위장 깨기(분할) 성능이 당시 최고 수준을 기록했다.

## 정리

"위장을 측정한다"는 문제를 정면으로 다뤘고, 그 측정값을 평가와 데이터 생성 양쪽에 모두 썼다는 점이 좋다. LSR이 사람의 시선으로 위장 정도를 라벨링했다면, 이 논문은 특징 유사도와 경계 가시성으로 **자동 점수**를 만들었다는 점에서 비교해 볼 만하다.

합성 데이터로 학습한 모델이 실제 위장 동물에서도 잘 동작하려면 합성 영상과 실제 영상의 분포 차이가 작아야 한다. 점수 자체가 특정 특징 추출기에 의존한다는 점도 함께 고려해야 한다.
