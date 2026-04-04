---
layout: "post"
title: "Feature Shrinkage Pyramid for Camouflaged Object Detection With Transformers"
subtitle: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
summary: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
description: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
date: "2026-03-15 09:00:00 +0900"
slug: "fspnet-transformer-cod-cvpr2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "transformer"
  - "cvpr2023"
venue: "CVPR 2023"
source_url: "https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf"
---

## 오버뷰

FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다.

## 핵심 주장

- ViT 계열의 global context만으로는 COD의 subtle local cue를 충분히 살리기 어렵다.
- NL-TEM이 neighboring tokens 간 상호작용과 고차 관계를 통해 locality를 강화한다.
- feature shrinkage pyramid decoder가 transformer feature를 점진적으로 압축하며 더 좋은 decoding을 만든다.

## 초록

이 논문은 transformer 기반 COD에서 locality modeling과 decoder aggregation 부족을 핵심 병목으로 봅니다. 그래서 non-local token enhancement와 feature shrinkage pyramid를 결합해 locality-enhanced neighboring transformer feature를 계층적으로 decode합니다.

## 서론

2023년 시점의 COD에서는 CNN과 transformer의 장단점이 비교적 명확해졌고, FSPNet은 transformer의 빈틈을 메우려는 설계로 읽힙니다.

## 본론

FSPNet은 큰 구조 혁신보다, transformer가 놓치는 local relation을 어떻게 보강할지를 세밀하게 다듬습니다. COD처럼 경계와 미세한 texture가 중요한 문제에서 이런 접근이 잘 맞습니다.

## 제안방법

NL-TEM이 non-local mechanism과 graph-based high-order relation으로 token locality를 높이고, feature shrinkage pyramid가 이를 progressive shrinking으로 decode합니다.

## 실험

실험의 메시지는 transformer backbone을 COD에 맞게 손보면 local cue와 decoding 문제를 줄일 수 있다는 것입니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| 대표 COD benchmarks | transformer 기반 기존 방법보다 더 안정적인 segmentation 성능을 보고한다. |
| transformer ablation | NL-TEM과 shrinkage pyramid가 locality와 aggregation 병목을 줄이는 데 기여한다고 분석한다. |

## 결론

FSPNet은 transformer 기반 COD의 약점을 정면으로 고친 실전형 논문입니다.

## 논의

지금 보면 더 큰 foundation model이 많지만, local cue를 어떻게 붙이느냐는 여전히 남아 있는 문제라서 읽을 가치가 있습니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf
