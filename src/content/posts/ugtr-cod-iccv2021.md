---
title: Uncertainty-Guided Transformer Reasoning for Camouflaged Object Detection
description: UGTR은 backbone 출력의 조건부 분포에서 초기 예측과 uncertainty를 얻고, 불확실한 영역을 attention으로 재추론한다. Bayesian representation과
  transformer를 결합한 초기 COD 연구다.
summary: UGTR은 backbone 출력의 조건부 분포에서 초기 예측과 uncertainty를 얻고, 불확실한 영역을 attention으로 재추론한다. Bayesian representation과
  transformer를 결합한 초기 COD 연구다.
subtitle: 초기 마스크 하나만 예측하지 않고 조건부 분포와 불확실성을 추정한 뒤, 애매한 영역에 transformer reasoning을 집중하는 확률적 COD 모델.
pubDate: 2026-03-09 09:00:00 +0900
slug: ugtr-cod-iccv2021
kind: paper
lang: ko
tags:
- paper
- cod
- uncertainty
- transformer
- iccv-2021
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2021/html/Yang_Uncertainty-Guided_Transformer_Reasoning_for_Camouflaged_Object_Detection_ICCV_2021_paper.html
venue: ICCV 2021
paperYear: 2021
authors: Fan Yang, Qiang Zhai, Xin Li, Rui Huang, Ao Luo, Hong Cheng, Deng-Ping Fan
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2021/papers/Yang_Uncertainty-Guided_Transformer_Reasoning_for_Camouflaged_Object_Detection_ICCV_2021_paper.pdf
codeUrl: https://github.com/fanyang587/UGTR
takeaways:
- 단일 결정론적 마스크 대신 초기 예측의 조건부 분포와 픽셀별 불확실성을 모델링한다.
- 불확실한 영역을 transformer attention의 추론 대상으로 사용해 계산의 초점을 정한다.
- uncertainty가 잘 보정되었는지와 정확도 향상은 별개의 문제이므로 calibration 평가가 더 필요하다.
---

## COD에서 불확실성은 오류가 아니다

위장 객체의 경계는 실제로 애매하다. 모델이 확신하지 못하는 것이 단순한 학습 실패가 아니라, 입력 자체가 여러 해석을 허용하기 때문일 수 있다. UGTR은 이 점을 출발점으로 삼아 한 장의 결정론적 마스크를 바로 내놓지 않는다. 먼저 가능한 예측의 **조건부 분포**를 학습하고, 그 분포에서 초기 마스크와 불확실성을 함께 얻는다.

이 관점은 confidence score를 마지막에 덧붙이는 방식과 다르다. uncertainty가 후처리용 표시가 아니라 다음 추론 단계가 어디를 볼지 정하는 신호가 된다.

## 확률적 초기 표현

백본 특징을 입력으로 하는 probabilistic representation은 여러 잠재 표현을 통해 예측 변동을 나타낸다. 안정적으로 객체라고 보는 영역은 샘플 사이에서 비슷한 값을 유지하고, 객체와 배경이 구분되지 않는 영역은 변동이 커진다. 이 차이로 초기 estimate와 uncertainty map을 구성한다.

결정론적 특징만 사용하면 애매한 경계도 하나의 값으로 압축된다. 반면 분포를 학습하면 “어디를 아직 모르는가”를 공간적으로 남길 수 있다. COD처럼 모호함이 핵심인 문제에 잘 맞는 표현이다.

## uncertainty-guided transformer reasoning

다음 단계의 transformer는 모든 위치를 똑같이 다시 계산하지 않는다. uncertainty map이 가리키는 애매한 영역을 중심으로, 멀리 떨어진 확실한 객체 내부나 배경 문맥과의 관계를 attention으로 추론한다. 예를 들어 흐릿한 경계 픽셀은 주변의 비슷한 질감만 봐서는 판단하기 어렵지만, 객체의 다른 부분과 전역 형태를 함께 보면 소속을 정할 수 있다.

이 구조는 Bayesian learning의 “모르는 정도”와 transformer의 “장거리 관계 추론”을 역할별로 결합한다. uncertainty가 질문을 만들고 attention이 그 질문에 필요한 문맥을 모은다고 볼 수 있다.

## 실험을 읽는 두 층

논문은 CHAMELEON, CAMO, COD10K에서 당시 방법보다 높은 분할 성능을 보고하고, 확률적 표현과 transformer reasoning의 기여를 절제한다. 첫 번째 층은 마스크 정확도다. 불확실한 영역을 다시 추론했을 때 경계와 어려운 객체에서 오류가 줄어드는지 본다.

두 번째 층은 uncertainty의 품질이다. 정확도가 올랐다고 해서 uncertainty가 곧바로 잘 보정된 것은 아니다. 높은 uncertainty가 실제 오류와 정렬되는지, 분포가 바뀐 데이터에서도 confidence가 과도해지지 않는지까지 확인해야 실제 의사결정에 쓸 수 있다. 원 논문은 첫 층의 설득력이 더 강하고, 두 번째 층은 후속 연구의 여지가 남는다.

## 이후 연구와 연결되는 지점

오늘날 segmentation 모델에서는 uncertainty map을 prompt, sampling, refinement budget에 활용하는 경우가 많다. UGTR은 COD에서 그 흐름을 일찍 보여 준다. 애매한 영역을 단순히 손실 가중치로 키우는 데 그치지 않고, 별도의 관계 추론 단계로 연결한 것이 핵심이다.

또한 어려운 픽셀만 집중적으로 다룬다는 점에서 active computation 관점으로도 읽을 수 있다. 모든 해상도에서 무거운 attention을 수행하는 대신, 정보가 부족한 곳에 전역 추론을 배치한다.

## 한계와 체크 포인트

확률적 모듈은 학습과 추론 비용을 늘리고, 샘플링 방식에 따라 uncertainty가 달라질 수 있다. 데이터셋의 라벨 노이즈를 객체의 본질적 모호함으로 잘못 해석할 가능성도 있다. 후속 모델을 평가할 때는 마스크 점수뿐 아니라 calibration, out-of-distribution 장면, 작은 객체에서 uncertainty의 의미가 유지되는지를 함께 봐야 한다.
