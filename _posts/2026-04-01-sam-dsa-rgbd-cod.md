---
layout: "post"
title: "Improving SAM for Camouflaged Object Detection via Dual Stream Adapters"
subtitle: "SAM-DSA는 RGB와 depth를 병렬 어댑터로 받아 SAM 내부 표현을 교정하고, RGB-D COD에서 기존 SAM 기반 방법을 앞선다."
summary: "SAM-DSA는 RGB와 depth를 병렬 어댑터로 받아 SAM 내부 표현을 교정하고, RGB-D COD에서 기존 SAM 기반 방법을 앞선다."
description: "SAM-DSA는 RGB와 depth를 병렬 어댑터로 받아 SAM 내부 표현을 교정하고, RGB-D COD에서 기존 SAM 기반 방법을 앞선다."
date: "2026-04-01 09:00:00 +0900"
slug: "sam-dsa-rgbd-cod"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sam"
  - "rgbd"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.pdf"
---

## 오버뷰

이 논문은 범용 분할 모델인 SAM을 위장 객체 탐지, 그것도 RGB-D 입력으로 제대로 쓰려면 내부 표현을 더 섬세하게 조정해야 한다고 본다. SAM-DSA는 SAM 본체를 유지하면서 dual-stream adapter와 양방향 distillation으로 그 문제를 해결한다.

## 핵심 주장

- RGB-D COD에서는 RGB와 depth를 단순 병합하는 것보다, 각 스트림을 병렬 어댑터로 정교하게 조정하는 편이 낫다.
- dual stream adapter와 bidirectional knowledge distillation이 서로 다른 modality 간 채널 불일치를 줄인다.
- COMPrompter 기반 설정과 비교해 네 데이터셋 모두에서 Sm을 올리고 M을 낮췄다.

## 초록

논문은 자연 이미지에서 강한 SAM이 COD에서는 만족스러운 성능을 내지 못한다고 지적한다. 이를 보완하기 위해 image encoder에 dual stream adapters를 붙이고, RGB와 depth attention을 함께 고려하는 mask decoder 업데이트 전략을 제안한다. 또 model distiller와 modal distiller를 포함하는 양방향 knowledge distillation으로 두 스트림의 불일치를 줄인다.

## 서론

RGB-D 위장 객체 탐지는 단순 RGB COD보다도 더 까다롭다. 깊이 정보가 도움이 되기도 하지만, 잘못 쓰면 오히려 noisy cue가 될 수 있기 때문이다. 이 논문은 바로 그 지점에서, SAM의 general segmentation prior를 유지하면서 depth 정보를 보조축으로 정교하게 끌어들이는 데 초점을 둔다.

## 본론

핵심은 SAM을 새로 만드는 것이 아니라, SAM 내부 attention block에 dual stream adapter를 병렬 삽입해 RGB와 depth가 서로를 보정하도록 만드는 것이다. 여기에 prompt 업데이트와 distillation을 함께 넣어, 두 modality가 따로 놀지 않게 한다.

## 제안방법

SAM-DSA는 image encoder에 dual stream adapter를 삽입해 RGB 이미지와 depth 이미지의 잠재 보완 정보를 학습한다. 이후 mask decoder와 depth-aware replica를 fine-tune해 dual-stream mask prediction을 수행한다. 동시에 bidirectional knowledge distillation로 modality gap을 줄이고, prompt embedding까지 함께 갱신해 최종 분할 일관성을 맞춘다.

## 실험

논문 표에서 SAM 기반 강한 baseline인 COMPrompter†와 SAM-DSA†를 비교하면, 네 데이터셋에서 Sm은 모두 올라가고 M은 거의 모두 개선된다. 아래 표는 dataset별 Sm과 M만 따로 뽑은 것이다.

| 데이터셋 | COMPrompter† Sm↑ | SAM-DSA† Sm↑ | COMPrompter† M↓ | SAM-DSA† M↓ |
| --- | ---: | ---: | ---: | ---: |
| CAMO | 0.853 | **0.866** | 0.054 | **0.047** |
| CHAMELEON | 0.884 | **0.888** | **0.030** | 0.031 |
| COD10K | 0.861 | **0.881** | 0.026 | **0.023** |
| NC4K | 0.880 | **0.889** | 0.036 | **0.032** |

CHAMELEON의 M만 아주 근소하게 비슷하지만, 전체적으로 보면 SAM-DSA가 더 안정적인 RGB-D COD 성능을 보인다.

## 결론

SAM-DSA는 SAM을 RGB-D COD에 맞게 고치는 현실적인 방법이다. backbone을 갈아엎지 않고도 adapter와 distillation만으로 큰 개선을 만든다는 점이 실용적이다.

## 논의

SAM 활용 논문 중에서도 이 글은 'foundation model을 downstream에 붙이는 법'을 비교적 정직하게 보여준다. SAM을 그대로 믿지 않고, 어디를 얼마나 수정해야 위장 장면에서 성능이 나는지를 모듈 수준으로 설명한다는 점이 좋다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.pdf
