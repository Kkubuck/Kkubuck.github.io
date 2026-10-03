---
title: 'LSR: Simultaneously Localize, Segment and Rank the Camouflaged Objects'
description: 위장 객체를 분할하는 데서 그치지 않고, 어느 부분 때문에 들키는지와 얼마나 잘 숨었는지까지 함께 예측한다.
pubDate: 2026-03-06 09:00:00 +0900
category: paper-review
tags: [cod, dataset]
takeaways:
  - 이진 마스크만으로는 알 수 없는 "얼마나 잘 숨었는가(위장 정도)"를 명시적으로 모델링한다.
  - 들키게 만드는 판별 영역을 찾는 localization, 전체를 분할하는 segmentation, 위장 정도를 매기는 ranking을 함께 학습한다.
  - 대규모 테스트셋 NC4K를 함께 공개해 COD 모델의 일반화를 평가할 기반을 넓혔다.
paper:
  title: Simultaneously Localize, Segment and Rank the Camouflaged Objects
  authors: Yunqiu Lv, Jing Zhang, Yuchao Dai, Aixuan Li, Bowen Liu, Nick Barnes, Deng-Ping Fan
  venue: CVPR 2021
  year: 2021
  url: https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf
  code: https://github.com/JingZhang617/COD-Rank-Localize-and-Segment
---

## 문제

기존 COD 데이터는 객체를 1, 배경을 0으로 표시한 이진 마스크만 제공한다. 하지만 같은 마스크를 가진 객체라도 사람 눈에 띄는 정도는 크게 다르다. 한눈에 보이는 개체도 있고, 오래 봐도 찾기 어려운 개체도 있다. 저자들은 객체가 배경에 비해 얼마나 눈에 띄는지(conspicuousness)를 명시적으로 모델링하면, 위장과 동물의 진화를 더 잘 이해하고 더 정교한 위장 기법을 설계하는 데도 도움이 된다고 주장한다.

또 하나의 관찰은 **위장 객체를 들키게 만드는 것은 객체 전체가 아니라 특정 부분**이라는 점이다. 눈, 배경과 어긋나는 무늬, 끊긴 윤곽 같은 곳이다.

## 방법

위치 찾기(localize), 분할(segment), 순위 매기기(rank)를 동시에 하는 첫 ranking 기반 COD 네트워크를 제안한다.

- **Localization**: 객체를 눈에 띄게 만드는 판별 영역을 찾는다. 사람의 시선 데이터(fixation)로 학습한다.
- **Segmentation**: 판별 영역에서 출발해 위장 객체의 전체 범위를 분할한다.
- **Ranking**: 장면 속 객체마다 얼마나 쉽게 발견되는지(detectability)를 추론한다.

학습 데이터로는 COD10K 학습 이미지에 아이트래커로 시선을 기록해, 2,000장에 시선(fixation), 순위(ranking), 인스턴스 라벨을 붙였다. 테스트용으로는 280장을 같은 방식으로 라벨링했다.

### NC4K

모델과 함께 4,121장 규모의 새로운 COD 테스트셋 **NC4K**를 공개했다. 기존의 작은 테스트셋에서 얻은 성능이 다른 장면에서도 유지되는지 확인하기 위한 데이터로, 이후 COD 논문의 표준 평가셋이 되었다.

## 실험

제안 모델은 기존 COD 방법보다 좋은 분할 성능을 보이면서, 위치와 순위라는 추가 출력을 제공한다. 판별 영역 출력 덕분에 모델이 객체의 어느 부분을 근거로 판단했는지 확인할 수 있어, 저자들의 표현대로 "더 해석 가능한" COD 네트워크가 된다.

## 정리

"정답 마스크가 같으면 같은 난이도인가?"라는 질문을 던졌다는 점이 이 논문의 가장 큰 기여다. 쉬운 샘플과 어려운 샘플을 같은 이진 목표로만 학습하면, 모델이 위장이 깨지는 이유를 배울 기회가 없다. 판별 영역과 난도를 별도 신호로 주는 방식은 hard example mining이나 불확실성 모델링과도 연결된다.

다만 위장 정도는 객체의 고정된 속성이 아니다. 관찰 시간, 화면 크기, 촬영 거리에 따라 달라지는데, 단일 순위 라벨은 이런 변동을 하나로 압축한다. 순위 라벨이 분할 성능 자체를 얼마나 끌어올리는지도 따로 확인해 볼 부분이다.
