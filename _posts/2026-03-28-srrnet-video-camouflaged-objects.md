---
layout: "post"
title: "Scoring, Remember, and Reference: Catching Camouflaged Objects in Videos"
subtitle: "SRRNet은 위장 객체 비디오에서 reference frame을 점수 기반으로 고르고, 기억 정보와 motion cue를 함께 써서 단일 패스로 성능을 높인다."
summary: "SRRNet은 위장 객체 비디오에서 reference frame을 점수 기반으로 고르고, 기억 정보와 motion cue를 함께 써서 단일 패스로 성능을 높인다."
description: "SRRNet은 위장 객체 비디오에서 reference frame을 점수 기반으로 고르고, 기억 정보와 motion cue를 함께 써서 단일 패스로 성능을 높인다."
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

초록을 조금 더 풀어보면, VCOD(비디오 위장 개체 감지)는 외관이 주변 환경과 매우 유사한 개체를 분할하여 도전적이고 새로운 작업을 제시하는 것을 목표로 합니다. 기존 비전 모델은 위장된 물체의 외관을 구별할 수 없고 비디오의 동적 정보를 충분히 활용하지 못하기 때문에 이러한 시나리오에서 종종 어려움을 겪습니다. 이러한 과제를 해결하기 위해 우리는 위장된 시퀀스 처리를 위해 메모리 참조 프레임을 통합하여 과거 비디오 정보를 활용하는 인간의 메모리 인식에서 영감을 얻은 엔드 투 엔드 VCOD 프레임워크를 제안합니다. 구체적으로 우리는 예측 마스크와 점수를 동시에 생성하는 이중 목적 디코더를 설계하여 점수에 기반한 참조 프레임 선택을 가능하게 하는 동시에 보조 감독을 도입하여 특징 추출을 향상시킵니다.

## 서론

위장 객체는 정지 이미지에서도 어렵지만, 비디오에서는 시간축 정보가 도움과 방해를 동시에 준다. 움직임이 약하면 cue가 약하고, reference를 잘못 고르면 오히려 오류가 누적된다. SRRNet은 reference frame을 score 기반으로 고르는 문제를 구조 안에 포함시킨다.

서론에서는 특히, 물체가 외관과 매우 유사한 배경 안에 숨겨져 있으면 인간의 눈조차도 물체를 정확하게 식별하고 참조 프레임 활용 유무에 따른 방법 비교를 설명하는 데 어려움을 겪습니다. 하단: 참조 프레임을 저장하지 않는 기존 비디오 모델. 결과적으로 비디오 시퀀스의 배경 내에 숨겨진 개체를 식별하는 데 초점을 맞춘 VCOD(비디오 위장 개체 탐지) 작업이 발생합니다. 둘째, 참조 프레임을 효과적으로 활용하기 위해 RMA(Reference-Guided Multilevel Asymmetric) Attention을 제안합니다.

## 본론

이 논문의 포인트는 메모리를 그냥 많이 쓰는 것이 아니라, 어떤 프레임을 기억하고 참조할지까지 학습한다는 점이다. 그래서 이름도 Scoring, Remember, and Reference다.

## 제안방법

dual-purpose decoder는 예측 mask와 reference selection score를 함께 만든다. 이어 reference-guided multilevel asymmetric attention이 long-term reference information과 short-term motion cue를 결합해 feature를 강화한다. 전체 구조는 한 번의 비디오 패스로 동작하면서, 후속 프레임 처리에 memory guidance를 이용한다.

방법을 조금 더 자세히 보면, 프레임워크는 RMA(Reference-Guided Multilevel Asymmetric) 주의 모듈과 이중 목적 디코더라는 두 가지 핵심 구성 요소로 구성됩니다. 제안된 프레임워크는 전체 시퀀스를 처리한 후 비교에 의존하는 방법을 피하면서 비디오의 단일 순회로 이 작업을 완료합니다. 변환기의 특징을 처리한 후 디코더는 두 가지 분기를 통해 결과를 출력합니다. 하나는 이진 분할 마스크 Oseg를 생성하고 다른 하나는 인코더 특징과 분할 마스크를 기반으로 분할 점수를 예측합니다. 제안된 프레임워크는 비디오 시퀀스를 엄격하게 순차적인 순서로 처리합니다.

## 실험

대표 비교는 TSP-SAM-Bbox와의 성능 차이가 가장 잘 보인다. 아래 표는 두 비디오 데이터셋에서 mDice와 mIoU만 뽑아 정리한 것이다.

실험 파트를 조금 더 자세히 보면, 모델을 평가하기 위해 여러 가지 최첨단(SOTA) 방법과 비교했습니다. 결과는 우리 모델이 대부분의 평가 지표에서 기존의 모든 방법보다 성능이 우수하다는 것을 보여줍니다. CAD 데이터세트에서도 우리의 방법은 이전 접근 방식보다 성능이 뛰어나 2%~12%의 개선을 달성했습니다. 세분화 성능을 보다 직관적으로 비교하기 위해 MoCA-Mask 데이터 세트에서 6개 비디오를 예로 선택하고 SRRNet을 다른 SOTA 방법과 정성적으로 비교했습니다.

## 결론

SRRNet은 비디오 위장 객체 탐지에서 reference frame 선택을 학습 가능한 구성요소로 만들었다는 점이 핵심이다. 메모리 기반 접근을 실제 성능과 효율 양쪽에서 잘 정리한 논문이다.

## 논의

VCOD는 아직 논문 수가 많지 않은 편이라, 이 논문은 분야 기준점을 잡아주는 역할이 크다. 특히 단일 패스 구조와 비교적 작은 파라미터 수를 함께 가져간 점이 실제 응용 쪽에서 더 매력적으로 보인다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.pdf
