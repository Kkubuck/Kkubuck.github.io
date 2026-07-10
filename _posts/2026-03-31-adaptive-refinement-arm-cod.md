---
layout: post
title: Enhancing Prompt Generation with Adaptive Refinement for Camouflaged Object Detection
subtitle: 다른 foundation model이 만든 multimodal prompt를 그대로 SAM에 넣지 않고, domain-shift bias를 걸러 mask prompt와 intermediate embedding을
  함께 정제하는 Adaptive Refinement Module.
summary: ARM은 multimodal 정보와 mask prompt를 동시에 보정하고, refinement 과정의 중간 표현을 auxiliary embedding으로 재사용해 SAM에 더 풍부한 조건을 제공한다.
description: ARM은 multimodal 정보와 mask prompt를 동시에 보정하고, refinement 과정의 중간 표현을 auxiliary embedding으로 재사용해 SAM에 더 풍부한 조건을 제공한다.
date: 2026-03-31 09:00:00 +0900
slug: adaptive-refinement-arm-cod
lang: ko
paper: true
categories:
- papers
tags:
- paper
- sam
- prompt-refinement
- multimodal
- iccv-2025
venue: ICCV 2025
paper_year: 2025
paper_authors: Xuehan Chen, Guangyu Ren, Tianhong Dai, Tania Stathaki, Hengyan Liu
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
pdf_url: https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
takeaways:
- foundation model의 추가 정보도 domain shift로 인한 bias를 가질 수 있으므로 곧바로 prompt로 쓰지 않는다.
- ARM이 multimodal feature를 필터링하며 mask prompt를 갱신하고, intermediate 정보는 auxiliary embedding으로 SAM에 전달한다.
- 개선이 refinement 자체인지 더 많은 foundation model과 파라미터 때문인지 자원 맞춤 비교가 필요하다.
---

## 더 많은 modality가 항상 더 좋은 prompt는 아니다

SAM을 COD에 적용하는 연구는 caption, depth, edge, 다른 vision foundation model의 feature를 자동 prompt로 자주 사용한다. 그러나 이 모델들은 일반 이미지나 다른 task에서 학습되었기 때문에 위장 장면에 그대로 넣으면 domain-shift bias를 전달할 수 있다. 잘못된 semantic이나 거친 mask가 강한 prompt가 되면 SAM은 오히려 자신 있게 틀린다.

이 논문은 문제를 “추가 정보를 얼마나 많이 모을까”가 아니라 **들어온 정보를 어떻게 정제할까**로 바꾼다. Adaptive Refinement Module(ARM)이 외부 multimodal feature와 mask prompt를 함께 처리한다.

## ARM의 두 출력

첫 번째 출력은 refined mask prompt다. 외부 모델이 만든 초기 mask에서 배경으로 번진 부분과 누락된 구조를 multimodal context를 이용해 갱신한다. 장면마다 modality 신뢰도가 다르므로 고정 fusion 대신 adaptive weighting이 필요하다.

두 번째 출력은 refinement 중간에 생긴 **auxiliary embedding**이다. 보통 prompt refinement는 최종 mask만 남기고 내부 정보는 버리지만, 저자들은 그 과정에서 추출된 semantic과 boundary cue를 SAM의 추가 조건으로 전달한다. 최종 prompt가 압축하면서 잃은 정보를 보완한다.

## mask와 embedding을 같이 쓰는 이유

mask prompt는 어디가 객체인지 직접 알려 주지만 오류에도 민감하다. embedding은 위치가 덜 명시적인 대신 어떤 특징을 신뢰해야 하는지 더 풍부하게 담을 수 있다. 둘을 함께 쓰면 하나는 spatial constraint, 다른 하나는 representation guidance 역할을 한다.

ARM은 이 두 출력을 같은 refinement 과정에서 만들므로 서로 불일치할 가능성을 줄인다. 외부 modality를 단순 concat한 뒤 SAM decoder에 맡기는 것보다 prompt 생성 단계에서 bias를 먼저 걸러내는 설계다.

## structured target에서의 의미

논문은 특히 구조가 복잡한 target segmentation에서 강점을 보고한다. 이는 prompt refinement가 넓은 객체 내부보다 가는 부분과 경계 누락을 복원하는 데 도움을 준다는 해석과 맞는다. 평균 지표와 함께 thin structure, multiple components, occlusion subset을 보면 주장이 더 선명해진다.

절제에서는 raw multimodal prompt, refined mask만 사용, auxiliary embedding만 사용, 둘 다 사용하는 설정을 나눠야 한다. 또한 외부 foundation model을 동일하게 둔 baseline과 비교해야 ARM의 순수 기여를 알 수 있다.

## 다른 연구와의 차이

Vision-Language-SAM이 BLIP의 text·visual embedding을 SAM에 넣는 경로를 설계했다면, ARM은 **그 입력이 틀릴 수 있다는 전제**를 더 강하게 둔다. modality 추가가 아니라 domain adaptation과 prompt quality control에 초점을 맞춘다.

이 아이디어는 자동 prompt pipeline 전반에 중요하다. upstream model의 오류를 downstream foundation model이 알아서 고칠 것이라 기대하지 말고, 두 모델 사이에 uncertainty-aware interface를 설계해야 한다.

## 한계

ARM이 어떤 modality를 왜 억제했는지 해석이 어렵고, training domain에서 배운 weighting이 새로운 sensor나 장면에 그대로 맞지 않을 수 있다. 여러 foundation model을 동시에 실행하는 비용도 크다. 실제 배포에서는 prompt 품질 개선이 latency와 memory 증가를 정당화하는지, 모든 modality가 없는 상황에서도 graceful degradation을 보이는지 확인해야 한다.
