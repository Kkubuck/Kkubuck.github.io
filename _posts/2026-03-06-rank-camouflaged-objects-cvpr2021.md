---
layout: post
title: Simultaneously Localize, Segment and Rank the Camouflaged Objects
subtitle: 모든 위장 객체를 같은 난도로 취급하지 않고, 보이게 만드는 부분과 전체 마스크, 탐지 난도를 함께 예측해 COD를 해석 가능한 다중 작업으로 확장한 연구.
summary: 이 논문은 객체 위치·분할·위장 난도 순위를 동시에 학습한다. 이진 마스크만으로는 표현할 수 없던 “얼마나 잘 숨었는가”를 COD의 명시적 출력으로 만든다.
description: 이 논문은 객체 위치·분할·위장 난도 순위를 동시에 학습한다. 이진 마스크만으로는 표현할 수 없던 “얼마나 잘 숨었는가”를 COD의 명시적 출력으로 만든다.
date: 2026-03-06 09:00:00 +0900
slug: rank-camouflaged-objects-cvpr2021
lang: ko
paper: true
categories:
- papers
tags:
- paper
- cod
- ranking
- multi-task
- cvpr-2021
venue: CVPR 2021
paper_year: 2021
paper_authors: Yunqiu Lv, Jing Zhang, Yuchao Dai, Aixuan Li, Bowen Liu, Nick Barnes, Deng-Ping Fan
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf
takeaways:
- 이진 마스크에 더해 객체가 얼마나 눈에 띄는지 순위를 예측한다.
- 판별적인 일부 영역을 찾는 localization과 전체 형태를 복원하는 segmentation을 분리해 학습한다.
- 순위 라벨은 해석력을 높이지만 관찰자와 촬영 조건에 따라 달라질 수 있는 주관적 신호다.
---

## 이진 마스크가 놓치는 것

일반적인 COD 데이터는 객체 픽셀을 1, 배경을 0으로 표시한다. 하지만 같은 정답 마스크를 가진 객체라도 사람에게 드러나는 정도는 크게 다르다. 윤곽 하나가 선명한 개체가 있는가 하면, 오래 봐도 어디에 있는지 알기 어려운 개체도 있다. 이 논문은 그 차이를 **위장의 정도, 즉 detectability**로 모델링한다.

문제 설정부터 흥미롭다. 목표는 단순히 “숨은 객체를 분할하라”가 아니라, **어디가 객체를 들키게 하는지 찾고(localize), 전체 객체를 복원하며(segment), 얼마나 쉽게 발견되는지 순위를 매기는(rank)** 것이다. 세 출력이 함께 있어야 예측이 왜 나왔는지 설명할 여지가 생긴다.

## 세 작업이 맡는 역할

localization 분기는 객체 전체가 아니라 사람의 시선이 먼저 머무를 법한 판별 영역을 찾는다. 배경과 완벽히 섞이지 않은 무늬, 끊어진 윤곽, 눈처럼 두드러지는 작은 부위가 여기에 해당한다. segmentation 분기는 이 국소 단서를 출발점으로 전체 객체 범위를 채운다.

ranking 분기는 객체별 탐지 난도를 상대적인 순서로 추정한다. 이 출력은 확률 마스크와 다른 정보를 준다. 마스크 confidence가 모델의 확신이라면, camouflage rank는 장면 속 객체가 관찰자에게 얼마나 드러나는지를 표현하려는 값이다. 저자들은 이 세 작업을 공동 학습해 판별 부위와 전체 형태, 난도 판단이 서로 영향을 주도록 한다.

## 데이터셋 기여를 같이 봐야 하는 이유

논문은 모델뿐 아니라 더 큰 COD 테스트 세트를 제안한다. 새로운 평가 장면을 늘린 이유는 기존의 작은 테스트셋에서 얻은 성능이 다른 생물·배경·크기의 객체에도 유지되는지 확인하기 위해서다. COD처럼 장면 편향이 큰 분야에서는 모델 구조만큼 평가 데이터의 폭이 중요하다.

또한 fixation과 rank를 위한 주석은 기존 이진 마스크보다 풍부한 감독 신호다. 덕분에 모델이 맞았는지뿐 아니라 어떤 부분을 근거로 삼았는지, 예측한 난도 순서가 사람의 판단과 얼마나 비슷한지를 별도로 살필 수 있다.

## 결과를 읽는 관점

정량 비교에서 제안 모델은 기존 COD 방식과 경쟁하면서, 추가로 위치와 순위 출력을 제공한다. 여기서 핵심 성과는 segmentation 점수 하나의 최고 기록이라기보다 **COD를 해석 가능한 다중 작업으로 재정의했다는 것**이다. 판별 영역을 명시적으로 찾으면 모델이 객체의 어떤 부분에 의존하는지 시각적으로 점검할 수 있다.

다만 세 작업의 이득을 분리해서 볼 필요가 있다. ranking supervision이 segmentation 자체를 얼마나 개선하는지, localization 라벨 없이도 같은 효과를 얻을 수 있는지, 서로 다른 관찰자 사이에서 순위가 얼마나 일치하는지가 실제 활용 가능성을 좌우한다.

## 내가 남긴 해석

이 논문은 “정답 마스크가 같으면 같은 문제인가?”라는 좋은 반문을 던진다. 어려운 샘플과 쉬운 샘플을 같은 이진 목표로만 학습하면, 모델은 위장이 깨지는 이유를 배울 기회를 잃는다. 난도와 판별 부위를 별도 신호로 주는 방식은 hard-example mining이나 uncertainty modeling과도 연결된다.

최근의 prompt 기반 모델을 평가할 때도 이 관점이 유용하다. 마스크가 정확하더라도 모델이 실제로 위장이 깨진 단서를 찾았는지, 아니면 데이터셋의 배경 편향을 외운 것인지 확인해야 한다.

## 남는 한계

위장 난도는 객체의 고정 속성이 아니다. 관찰 시간, 화면 크기, 색각, 촬영 거리와 배경 문맥에 따라 달라진다. 단일 순위 라벨은 이런 변동을 압축한다. 따라서 이 연구를 확장하려면 여러 관찰자의 분포, 시선 추적, 시간에 따른 발견 확률처럼 더 풍부한 인간 인지 신호가 필요하다. 그럼에도 이진 분할 밖의 질문을 COD에 도입했다는 점에서 기준점이 되는 작업이다.
