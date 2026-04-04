---
layout: "post"
title: "Enhancing Prompt Generation with Adaptive Refinement for Camouflaged Object Detection"
subtitle: "ARM은 외부 foundation model의 정보를 그대로 끌어오지 않고, COD에 맞게 정제된 prompt와 auxiliary embedding으로 SAM을 보강한다."
summary: "ARM은 외부 foundation model의 정보를 그대로 끌어오지 않고, COD에 맞게 정제된 prompt와 auxiliary embedding으로 SAM을 보강한다."
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

## 서론

이 논문이 짚는 지점은 꽤 중요하다. foundation model을 많이 붙일수록 좋아질 것처럼 보이지만, 실제로는 분포가 다른 정보가 prompt를 흐릴 수 있다. COD는 객체와 배경이 원래 비슷해서, 작은 편향도 최종 마스크 품질에 크게 영향을 준다.

## 본론

ARM의 아이디어는 멀티모달 정보를 그냥 전달하지 않고 refinement 단계를 먼저 거치는 것이다. 즉, prompt engineering이라기보다 prompt filtering에 가깝다. 그리고 intermediate information으로 auxiliary embedding을 만들어 SAM이 richer representation을 가지게 한다.

## 제안방법

논문은 ARM이 멀티모달 feature를 효율적으로 처리하면서 동시에 mask prompt를 refine한다고 설명한다. 또 ARM 내부 중간 정보를 auxiliary embedding으로 구성해 SAM 쪽으로 넘겨 richer feature representation을 만든다. 구조가 과하게 복잡하기보다는, foundation model 정보를 COD 목적에 맞게 다듬는 모듈 설계에 집중한 형태다.

## 실험

아래 표는 COMPrompter와 제안 방법을 dataset별 Sm, M 기준으로 다시 정리한 것이다.

| 데이터셋 | COMPrompter Sm↑ | Ours Sm↑ | COMPrompter M↓ | Ours M↓ |
| --- | ---: | ---: | ---: | ---: |
| CHAMELEON | 0.885 | **0.932** | 0.030 | **0.023** |
| CAMO | 0.853 | **0.887** | 0.054 | **0.046** |
| COD10K | 0.860 | **0.909** | 0.027 | **0.020** |
| NC4K | 0.880 | **0.906** | 0.036 | **0.033** |

특히 structured target segmentation에서 강하다는 초록의 설명과 맞물려, COD10K와 NC4K에서 개선 폭이 꽤 분명하다.

## 결론

이 논문은 SAM을 위한 prompt를 더 많이 만드는 것보다, 더 잘 정제하는 편이 COD에는 유리하다고 말한다. 그 메시지가 수치로도 꽤 설득력 있게 나온다.

## 논의

SAM 기반 COD 논문이 쌓이는 흐름 안에서 보면, ARM은 멀티모달 정보를 '붙이는 방법'보다 '거르는 방법'을 강조한 점이 인상적이다. foundation model integration이 언제나 정답이 아니라는 점을 차분히 보여주는 논문이다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_Enhancing_Prompt_Generation_with_Adaptive_Refinement_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
