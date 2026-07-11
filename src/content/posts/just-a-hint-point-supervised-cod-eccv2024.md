---
title: 'Just a Hint: Point-Supervised Camouflaged Object Detection'
description: 한 점 supervision에서 adaptive hint area를 만들고 attention regulator와 unsupervised contrastive learning으로
  partial localization과 불안정한 특징을 보완한다.
summary: 한 점 supervision에서 adaptive hint area를 만들고 attention regulator와 unsupervised contrastive learning으로 partial
  localization과 불안정한 특징을 보완한다.
subtitle: 객체마다 클릭 한 번만 받아 점을 적절한 영역으로 확장하고, attention이 판별 부위에만 갇히지 않도록 조절하며 contrastive consistency로 전체 객체 표현을 학습한
  약지도 COD.
pubDate: 2026-03-22 09:00:00 +0900
slug: just-a-hint-point-supervised-cod-eccv2024
kind: paper
lang: ko
tags:
- paper
- weak-supervision
- point-supervision
- cod
- eccv-2024
categories:
- papers
sourceUrl: https://eccv.ecva.net/virtual/2024/poster/2276
venue: ECCV 2024
paperYear: 2024
authors: Huafeng Chen, Dian Shao, Guangqian Guo, Shan Gao
reviewedOn: '2026-07-10'
pdfUrl: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/02276.pdf
takeaways:
- 픽셀 마스크 대신 객체당 한 점만 요구해 COD annotation 비용을 크게 낮춘다.
- point를 hint area로 확장한 뒤 일부 labeled region을 가려 attention이 객체 전체로 퍼지게 한다.
- 한 점이 항상 객체 내부의 대표 위치라는 가정과 pseudo area의 초기 오류가 학습 결과를 좌우한다.
---

## 왜 한 점인가

위장 객체의 픽셀 마스크는 사람에게도 만들기 어렵다. 경계가 보이지 않아 확대와 반복 검수가 필요하고, 한 장을 주석하는 비용이 높다. 반면 객체 안을 한 번 클릭하는 것은 훨씬 빠르다. 이 논문은 **객체당 한 점**만으로 COD 모델을 학습할 수 있는지 묻는다.

문제는 점이 위치만 알려 줄 뿐 크기와 형태를 말해 주지 않는다는 것이다. 모델은 눈이나 무늬처럼 가장 구분하기 쉬운 작은 부분만 찾고도 point loss를 만족할 수 있다. 따라서 supervision을 넓히되 잘못 확장하지 않는 장치가 필요하다.

## point에서 hint area로

첫 단계는 원래 point annotation을 주변의 합리적인 **hint area**로 adaptive expansion하는 것이다. 고정 반경 원을 그리면 작은 객체에서는 배경을 포함하고 큰 객체에서는 너무 적은 부분만 덮는다. 이미지 특징과 현재 예측을 이용해 점 주변에서 객체일 가능성이 높은 영역을 유연하게 늘린다.

이 area는 완전한 pseudo mask가 아니라 출발 힌트다. 확실한 중심부를 제공해 모델이 배경 전체에서 객체를 검색하는 부담을 줄이면서도, 경계를 확정했다고 가정하지 않는다.

## attention regulator

약지도 분할의 대표 실패는 discriminative part만 찾는 것이다. 논문은 labeled region의 일부를 의도적으로 masking해, 모델이 익숙한 한 부분에만 attention을 두지 못하게 한다. 보이는 힌트가 달라질 때마다 객체의 다른 부분을 탐색해야 하므로 attention이 전체 형태로 퍼진다.

이 방식은 hide-and-seek 계열의 직관과 닮았지만 COD에서는 더 조심스럽다. 객체와 배경 차이가 작아서 너무 많은 힌트를 가리면 학습 신호 자체가 사라질 수 있다. masking 강도와 hint 품질 사이의 균형이 중요하다.

## unsupervised contrastive consistency

한 점만으로 얻은 객체 feature는 augmentation에 쉽게 흔들린다. 저자들은 색 변화나 translation처럼 서로 다른 augmentation을 적용한 이미지 쌍에서 표현을 맞추는 unsupervised contrastive learning을 사용한다. 위치와 색이 조금 바뀌어도 같은 위장 객체의 semantic은 유지되어야 한다는 제약이다.

contrastive objective는 dense label이 주지 못하는 global consistency를 보완한다. 다만 색 자체가 위장 단서인 경우 강한 color augmentation이 필요한 정보를 지울 수 있으므로 변환 선택을 검토해야 한다.

## 평가에서 중요한 비교

논문은 세 주요 COD benchmark에서 기존 weakly supervised 방법과 비교한다. fully supervised SOTA와의 격차도 중요하지만, annotation 비용이 같은 point-supervised baseline 대비 얼마나 좋아지는지가 더 공정한 질문이다. point 수, 클릭 위치 규칙, 추가 pretrained model 사용 여부를 맞춰야 한다.

절제 실험에서는 adaptive expansion, attention regulator, contrastive learning이 각각 partial mask와 boundary 오류를 어떻게 줄이는지 봐야 한다. 한 점이 중심에 있을 때와 경계 가까이에 있을 때의 민감도도 실용성에 직접 연결된다.

## 한계

클릭이 객체 밖에 있거나 여러 개체가 붙은 영역에 찍히면 hint가 잘못 퍼질 수 있다. 모델이 처음 만든 area의 오류가 self-training처럼 강화될 위험도 있다. 실제 annotation 절감 효과를 말하려면 클릭 시간뿐 아니라 실패한 hint를 사람이 수정하는 비용까지 계산해야 한다. 그래도 COD의 가장 큰 병목 중 하나인 정밀 마스크 의존을 현실적으로 낮춘 연구다.
