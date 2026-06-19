---
layout: "post"
title: "Enhancing Prompt Generation with Adaptive Refinement for Camouflaged Object Detection"
subtitle: "ARM은 외부 foundation model의 정보를 그대로 끌어오지 않고, COD에 맞게 정제된 prompt와 auxiliary embedding으로 SAM을 보강한다."
summary: "ARM은 외부 foundation model의 정보를 그대로 끌어오지 않고, COD에 맞게 정제된 prompt와 auxiliary embedding으로 SAM을 보강한다."
description: "ARM은 외부 foundation model의 정보를 그대로 끌어오지 않고, COD에 맞게 정제된 prompt와 auxiliary embedding으로 SAM을 보강한다."
date: "2026-03-31 09:00:00 +0900"
slug: "adaptive-refinement-arm-cod"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sam"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf"
---
## 오버뷰

SAM 계열 COD 논문이 많아졌지만, 외부 foundation model의 정보를 그대로 가져오면 domain shift로 오히려 편향이 커질 수 있다. 이 논문은 Adaptive Refinement Module(ARM)로 그 정보를 정제한 뒤 prompt와 auxiliary embedding 형태로 다시 넣는다.

## 핵심 주장

- 외부 foundation model의 멀티모달 정보를 직접 붙이면 COD에서는 오히려 bias가 커질 수 있다.
- ARM은 멀티모달 정보를 COD 친화적으로 정제하면서 mask prompt를 함께 다듬는다.
- COMPrompter와 비교해 네 데이터셋 모두에서 Sm을 개선했고, MAE 성격의 M도 대체로 더 낮췄다.

## 초록

논문은 Segment Anything Model이 일반 분할에는 강하지만 COD 같은 다운스트림 태스크에서는 여전히 한계가 있다고 본다. 기존 연구는 다른 foundation model에서 온 멀티모달 정보를 결합해 성능을 높이려 했지만, 이 논문은 그 정보가 그대로 들어오면 domain shift로 편향이 생길 수 있다고 지적한다. 이를 위해 ARM과 auxiliary embedding을 제안한다.

초록을 조금 더 풀어보면, SAM(Segment Anything Model)과 같은 기초 모델은 주로 대규모 데이터 세트에 대한 교육으로 인해 기존 분할 작업에서 놀라운 성능을 보여왔습니다. 그럼에도 불구하고 COD(위장 물체 탐지)와 같은 특정 다운스트림 작업에는 여전히 과제가 남아 있습니다. 기존 연구는 주로 다른 기초 모델에서 파생된 추가 다중 모드 정보를 통합하여 성능을 향상시키는 것을 목표로 합니다. 그러나 이러한 모델에서 생성된 정보를 직접 활용하면 영역 이동으로 인해 추가적인 편향이 발생할 수 있습니다.

## 서론

이 논문이 짚는 지점은 꽤 중요하다. foundation model을 많이 붙일수록 좋아질 것처럼 보이지만, 실제로는 분포가 다른 정보가 prompt를 흐릴 수 있다. COD는 객체와 배경이 원래 비슷해서, 작은 편향도 최종 마스크 품질에 크게 영향을 준다.

서론에서는 특히, 위장 개체 감지(COD)는 주변 환경과 거의 동일한 개체를 분할하는 까다로운 컴퓨터 비전 작업입니다. 물체 감지, 저고도 경제, 동물학 연구, 의료 영상 분할 등 광범위한 실제 적용으로 인해 해당 분야에서 중요한 역할을 합니다. 또한, 다른 양식의 데이터가 부족하면 모델이 의미 있는 특징을 획득하는 능력이 더욱 제한되어 배경에 매우 민감해지고 위장된 물체를 정확하게 감지할 수 없게 됩니다. 한편, 배경의 시각적 노이즈는 작업의 복잡성을 증가시켜 객체 경계가 모호해지고 특징 학습이 약화됩니다.

## 본론

ARM의 아이디어는 멀티모달 정보를 그냥 전달하지 않고 refinement 단계를 먼저 거치는 것이다. 즉, prompt engineering이라기보다 prompt filtering에 가깝다. 그리고 intermediate information으로 auxiliary embedding을 만들어 SAM이 richer representation을 가지게 한다.

## 제안방법

논문은 ARM이 멀티모달 feature를 효율적으로 처리하면서 동시에 mask prompt를 refine한다고 설명한다. 또 ARM 내부 중간 정보를 auxiliary embedding으로 구성해 SAM 쪽으로 넘겨 richer feature representation을 만든다. 구조가 과하게 복잡하기보다는, foundation model 정보를 COD 목적에 맞게 다듬는 모듈 설계에 집중한 형태다.

방법을 조금 더 자세히 보면, ARM은 처음 생성된 마스크 프롬프트가 객체의 일부만 덮거나 배경을 많이 끌어오는 문제를 먼저 해결하려고 합니다. 이를 위해 어댑터가 모아 둔 멀티모달 정보를 이용해 attention을 다시 조정하고, 초기 프롬프트를 더 넓고 안정적인 형태로 재구성합니다. 동시에 refinement 과정에서 나온 중간 표현을 auxiliary embedding으로 넘겨, SAM 쪽이 더 풍부한 문맥 정보를 가지고 최종 마스크를 예측하도록 만든다는 점이 핵심입니다.

## 실험

아래 표는 COMPrompter와 제안 방법을 dataset별 Sm, M 기준으로 다시 정리한 것이다.

실험 파트를 조금 더 자세히 보면, 최첨단 방법과의 비교 COD 작업의 성과를 효과적으로 평가하기 위해 먼저 현재의 최첨단(SOTA) 모델과 비교 분석을 수행했습니다. 1은 4개의 서로 다른 데이터 세트에 대한 우리 작업과 다른 SOTA 모델의 평가 결과를 비교합니다. 4에서 우리의 방법(빨간색 실선)은 세 가지 데이터 세트 모두에서 뛰어난 성능을 나타내며 특히 COD10K 데이터 세트에서 놀라운 결과를 나타냄이 분명합니다. 2에서 제안된 ARM은 COD 작업에서 SAM의 성능을 크게 향상시켜 세 가지 데이터 세트에 대한 모든 평가 지표에서 상당한 개선을 달성했습니다.

## 결론

이 논문은 SAM을 위한 prompt를 더 많이 만드는 것보다, 더 잘 정제하는 편이 COD에는 유리하다고 말한다. 그 메시지가 수치로도 꽤 설득력 있게 나온다.

## 논의

SAM 기반 COD 논문이 쌓이는 흐름 안에서 보면, ARM은 멀티모달 정보를 '붙이는 방법'보다 '거르는 방법'을 강조한 점이 인상적이다. foundation model integration이 언제나 정답이 아니라는 점을 차분히 보여주는 논문이다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
