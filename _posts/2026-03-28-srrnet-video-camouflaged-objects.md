---
layout: "post"
title: "Scoring, Remember, and Reference: Catching Camouflaged Objects in Videos"
subtitle: "SRRNet은 위장 객체 비디오에서 reference frame을 점수 기반으로 고르고, 기억 정보와 motion cue를 함께 써서 단일 패스로 성능을 높인다."
summary: "SRRNet은 위장 객체 비디오에서 reference frame을 점수 기반으로 고르고, 기억 정보와 motion cue를 함께 써서 단일 패스로 성능을 높인다."
date: "2026-03-28 09:00:00 +0900"
slug: "srrnet-video-camouflaged-objects"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "video"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.pdf"
---

## 오버뷰

비디오 위장 객체 탐지에서는 현재 프레임만 잘 보는 것으로는 부족하고, 어떤 과거 프레임을 참고해야 하는지가 중요하다. SRRNet은 바로 그 reference frame selection과 memory-guided aggregation을 하나의 end-to-end 구조로 묶는다.

## 핵심 주장

- VCOD에서는 long-term reference와 short-term motion cue를 함께 써야 한다.
- dual-purpose decoder가 mask와 score를 동시에 예측해 reference frame selection 자체를 학습 가능하게 만든다.
- TSP-SAM-Bbox 대비 MoCA-Mask와 CAD에서 mDice/mIoU를 모두 끌어올리면서 파라미터 수는 53.79M으로 더 작다.

## 초록

논문은 인간의 memory-recognition에서 영감을 받아, 역사적 비디오 정보를 활용하는 end-to-end VCOD 프레임워크를 제안한다. dual-purpose decoder가 mask와 score를 동시에 생성하고, reference-guided multilevel asymmetric attention이 long-term reference와 short-term motion cue를 통합한다. 결과적으로 약 54M 파라미터로 기존 방법보다 큰 폭의 성능 향상을 보인다.

## 서론

위장 객체는 정지 이미지에서도 어렵지만, 비디오에서는 시간축 정보가 도움과 방해를 동시에 준다. 움직임이 약하면 cue가 약하고, reference를 잘못 고르면 오히려 오류가 누적된다. SRRNet은 reference frame을 score 기반으로 고르는 문제를 구조 안에 포함시킨다.

## 본론

이 논문의 포인트는 메모리를 그냥 많이 쓰는 것이 아니라, 어떤 프레임을 기억하고 참조할지까지 학습한다는 점이다. 그래서 이름도 Scoring, Remember, and Reference다.

## 제안방법

dual-purpose decoder는 예측 mask와 reference selection score를 함께 만든다. 이어 reference-guided multilevel asymmetric attention이 long-term reference information과 short-term motion cue를 결합해 feature를 강화한다. 전체 구조는 한 번의 비디오 패스로 동작하면서, 후속 프레임 처리에 memory guidance를 이용한다.

## 실험

대표 비교는 TSP-SAM-Bbox와의 성능 차이가 가장 잘 보인다. 아래 표는 두 비디오 데이터셋에서 mDice와 mIoU만 뽑아 정리한 것이다.

| 데이터셋 | TSP-SAM-Bbox mDice↑ | SRRNet mDice↑ | TSP-SAM-Bbox mIoU↑ | SRRNet mIoU↑ |
| --- | ---: | ---: | ---: | ---: |
| MoCA-Mask | 0.458 | **0.513** | 0.388 | **0.428** |
| CAD | 0.543 | **0.553** | 0.438 | **0.452** |

숫자 폭이 아주 과장되진 않지만, MoCA-Mask에서는 차이가 꽤 분명하고 CAD에서도 일관된 개선이 있다. 초록에서 말한 memory-guided processing의 효과를 정량적으로 보여준다.

## 결론

SRRNet은 비디오 위장 객체 탐지에서 reference frame 선택을 학습 가능한 구성요소로 만들었다는 점이 핵심이다. 메모리 기반 접근을 실제 성능과 효율 양쪽에서 잘 정리한 논문이다.

## 논의

VCOD는 아직 논문 수가 많지 않은 편이라, 이 논문은 분야 기준점을 잡아주는 역할이 크다. 특히 단일 패스 구조와 비교적 작은 파라미터 수를 함께 가져간 점이 실제 응용 쪽에서 더 매력적으로 보인다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.pdf
