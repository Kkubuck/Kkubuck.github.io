---
layout: "post"
title: "Camouflaged Object Segmentation With Distraction Mining"
subtitle: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
summary: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
description: "PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다."
date: "2026-03-08 09:00:00 +0900"
slug: "pfnet-distraction-mining-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "pfnet"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf"
---

## 오버뷰

PFNet은 COD 초창기 기준선 가운데 가장 자주 인용되는 모델입니다. predation process를 흉내 내며 positioning과 focus를 나누고, distraction mining으로 배경 잡음을 줄입니다.

## 핵심 주장

- COD는 global positioning과 local focus를 분리해 다루는 편이 효과적이다.
- distraction mining이 background noise를 줄여 estimation 성능을 높인다.
- 72 FPS 실시간 속도와 함께 18개 cutting-edge model을 앞서는 성능을 보고한다.

## 초록

저자들은 COD를 predation process에 비유해, positioning module과 focus module을 갖춘 PFNet을 제안합니다. focus module 내부의 distraction mining이 방해 영역을 발견하고 제거해 segmentation 품질을 높입니다.

## 서론

지금의 복잡한 foundation model 이전 시점에서, PFNet은 COD의 기본 설계 감각을 만든 작업 중 하나입니다. global-local 분해가 특히 중요합니다.

## 본론

PFNet의 강점은 구조가 비교적 단순하지만 문제 정의가 분명하다는 점입니다. 먼저 찾고, 그다음 ambiguous region에 집중한다는 흐름이 명확합니다.

## 제안방법

positioning module이 잠재 영역을 잡고, focus module이 progressive refinement를 수행합니다. 이 안에서 distraction mining이 방해 영역을 제거하는 역할을 맡습니다.

## 실험

논문은 세 개의 challenging benchmark와 네 가지 standard metrics에서 strong baseline 성능을 보이고, 동시에 real-time 속도도 강조합니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| 3 challenging benchmark datasets | 18개 cutting-edge models보다 강한 정량 성능을 보고한다. |
| 72 FPS | 실시간 처리 속도를 갖춘 효율적인 COS/COD baseline이라는 점을 함께 강조한다. |

## 결론

PFNet은 COD 초창기 대표 기준선으로, 지금 봐도 문제를 어떻게 나누어 볼지 감을 주는 논문입니다.

## 논의

초기 COD 논문들을 다시 읽을 때 PFNet을 함께 보면, 이후 모델들이 무엇을 더 세밀하게 고치려 했는지가 잘 보입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf
