---
layout: "post"
title: "Simultaneously Localize, Segment and Rank the Camouflaged Objects"
subtitle: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
summary: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
description: "이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다."
date: "2026-03-06 09:00:00 +0900"
slug: "rank-camouflaged-objects-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "ranking"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf"
---

## 오버뷰

이 논문은 COD가 단순 binary mask 예측만으로는 camouflage의 강도를 충분히 설명하지 못한다고 봅니다. 그래서 localization, segmentation, ranking을 동시에 수행해 detectability까지 모델링합니다.

## 핵심 주장

- camouflaged object는 보이는 정도가 다르므로 ranking까지 포함해야 해석력이 좋아진다.
- 특정 part가 object를 더 눈에 띄게 만든다는 관찰이 localization 모델 설계로 이어진다.
- 대형 COD testing set을 함께 제공해 generalization 평가를 강화한다.

## 초록

저자들은 camouflage conspicuousness를 명시적으로 모델링하면 COD를 더 잘 이해할 수 있다고 주장합니다. 그래서 localization model, segmentation model, ranking model을 함께 둬서 객체 위치, 전체 mask, detectability를 동시에 추론합니다.

## 서론

많은 COD 논문이 segmentation score에만 집중하지만, 실제로는 어떤 객체는 조금만 봐도 드러나고 어떤 객체는 거의 보이지 않습니다. 이 논문은 그 차이를 모델에 넣습니다.

## 본론

ranking이라는 축이 들어가면서, COD는 단순 pixel classification이 아니라 camouflage strength estimation 문제로도 읽히게 됩니다. 이 관점이 이후 dataset discussion에도 영향을 줍니다.

## 제안방법

localization branch가 discriminative region을 찾고, segmentation branch가 full object mask를 예측하며, ranking branch가 detectability를 추정합니다. 세 branch가 함께 camouflage understanding을 구성합니다.

## 실험

실험에서는 새로운 large COD testing set과 함께, 단순 segmentation score뿐 아니라 interpretability 측면의 이점을 강조합니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| large COD testing set | 기존보다 generalization을 더 엄격하게 확인할 수 있는 테스트셋을 함께 제공한다. |
| localize + segment + rank | 단순 binary COD보다 해석력이 높은 multi-branch framework라는 점을 강조한다. |

## 결론

이 논문은 COD를 더 해석 가능하게 만들려는 초창기 중요한 시도입니다.

## 논의

지금 benchmark 글을 읽을 때도 이 논문이 자주 떠오르는 이유는, 단순 점수보다 camouflage 강도 자체를 보려는 관점을 줬기 때문입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf
