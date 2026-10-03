---
title: Enhancing Prompt Generation with Adaptive Refinement for Camouflaged Object Detection
description: 다른 기반 모델이 만든 멀티모달 정보를 SAM에 그대로 넣지 않고, 적응형 정제 모듈(ARM)로 도메인 편향을 걸러 마스크 프롬프트와 보조 임베딩을 함께 만든다.
pubDate: 2026-03-31 09:00:00 +0900
category: paper-review
tags: [cod, sam, multimodal]
takeaways:
  - SAM 같은 기반 모델을 COD에 쓸 때 다른 기반 모델의 멀티모달 정보를 더하는 연구가 많지만, 그 정보에는 도메인 차이로 인한 편향이 섞인다.
  - Adaptive Refinement Module(ARM)이 멀티모달 정보를 처리하면서 마스크 프롬프트를 함께 정제한다.
  - ARM의 중간 정보로 만든 보조 임베딩을 SAM에 더 줘서, 구조가 복잡한 대상의 분할에서 특히 좋은 성능을 냈다.
paper:
  title: Enhancing Prompt Generation with Adaptive Refinement for Camouflaged Object Detection
  authors: Xuehan Chen, Guangyu Ren, Tianhong Dai, Tania Stathaki, Hengyan Liu
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
---

## 문제

SAM 같은 기반 모델은 대규모 데이터로 학습한 덕분에 일반적인 분할에서는 뛰어나지만, COD 같은 특정 작업에서는 여전히 어려움을 겪는다. 그래서 기존 연구는 주로 **다른 기반 모델이 만든 멀티모달 정보**(캡션, 시각 임베딩 등)를 더해 성능을 높였다.

문제는 그 정보를 **그대로** 쓰는 데 있다. 다른 기반 모델은 일반 이미지로 학습했기 때문에, 위장 장면에서는 도메인 차이로 인한 편향이 섞인 정보를 줄 수 있다. 틀린 정보가 강한 프롬프트가 되면 SAM은 오히려 자신 있게 틀린다.

## 방법

### Adaptive Refinement Module (ARM)

외부 멀티모달 정보를 효율적으로 처리하면서 **마스크 프롬프트를 동시에 정제**한다. 들어온 정보를 얼마나 믿을지 적응적으로 조절해, 도메인 편향을 프롬프트 단계에서 먼저 걸러 내는 역할이다.

### 보조 임베딩

보통 프롬프트를 정제하고 나면 최종 마스크만 남기고 중간 정보는 버린다. 이 논문은 ARM 과정에서 생긴 **중간 정보로 보조 임베딩**(auxiliary embedding)을 만들어 SAM에 함께 넣는다. SAM이 더 풍부한 특징 표현을 받게 된다.

## 실험

COD 작업에서 대부분의 최신 모델을 앞섰고, 특히 **구조가 복잡한 대상**(structured target)의 분할에서 강점을 보였다.

## 정리

같은 연구 그룹의 [MM-SAM](/posts/mm-sam-camouflaged-scene-segmentation/)이 BLIP의 텍스트·시각 임베딩을 SAM에 넣는 경로를 설계했다면, ARM은 **그 입력이 틀릴 수 있다**는 전제에서 출발한다. 자동 프롬프트 파이프라인 전반에 적용할 수 있는 관점이다. 앞단 모델의 오류를 뒷단 기반 모델이 알아서 고쳐 주길 기대하기보다, 두 모델 사이에 정보를 거르는 장치를 두는 것이다.

여러 기반 모델을 함께 돌리는 만큼 계산 비용이 크다. 성능 향상이 정제 과정 덕분인지, 더 많은 모델과 파라미터 덕분인지는 같은 외부 모델을 쓴 기준선과 비교해야 분명해진다.
