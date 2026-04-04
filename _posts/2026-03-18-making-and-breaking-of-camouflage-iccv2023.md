---
layout: "post"
title: "The Making and Breaking of Camouflage"
subtitle: "이 논문은 단순히 위장 객체를 찾는 모델을 제안하는 데서 멈추지 않고, 무엇이 camouflage를 성공하게 만들고 무엇이 그것을 깨뜨리는지를 score로 정의합니다. 그 score를 synthetic data generation과 video segmentation에 다시 연결한 점이 인상적입니다."
summary: "이 논문은 단순히 위장 객체를 찾는 모델을 제안하는 데서 멈추지 않고, 무엇이 camouflage를 성공하게 만들고 무엇이 그것을 깨뜨리는지를 score로 정의합니다. 그 score를 synthetic data generation과 video segmentation에 다시 연결한 점이 인상적입니다."
description: "이 논문은 단순히 위장 객체를 찾는 모델을 제안하는 데서 멈추지 않고, 무엇이 camouflage를 성공하게 만들고 무엇이 그것을 깨뜨리는지를 score로 정의합니다. 그 score를 synthetic data generation과 video segmentation에 다시 연결한 점이 인상적입니다."
date: "2026-03-18 09:00:00 +0900"
slug: "making-and-breaking-of-camouflage-iccv2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "vcod"
  - "iccv2023"
venue: "ICCV 2023"
source_url: "https://openaccess.thecvf.com/content/ICCV2023/html/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2023/papers/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.pdf"
---

## 오버뷰

이 논문은 단순히 위장 객체를 찾는 모델을 제안하는 데서 멈추지 않고, 무엇이 camouflage를 성공하게 만들고 무엇이 그것을 깨뜨리는지를 score로 정의합니다. 그 score를 synthetic data generation과 video segmentation에 다시 연결한 점이 인상적입니다.

## 핵심 주장

- camouflage effectiveness는 foreground-background feature similarity와 boundary visibility로 자동 측정할 수 있다.
- 제안한 score를 generative model auxiliary loss로 써서 더 어려운 camouflage 데이터를 합성할 수 있다.
- 합성 데이터를 학습에 활용해 MoCA-Mask에서 state-of-the-art camouflage breaking 성능을 달성한다.

## 초록

저자들은 모든 camouflage가 같은 난도를 갖지 않는다는 점에서 출발합니다. foreground와 background의 feature similarity, boundary visibility를 기반으로 camouflage score를 만들고, 이를 통해 기존 데이터셋을 평가하며 synthetic camouflage 데이터도 생성합니다.

## 서론

이 논문은 detection architecture보다 dataset difficulty와 camouflage quality 자체를 분석 대상으로 삼습니다. 그래서 benchmark 해석에도 도움이 되는 작업입니다.

## 본론

흥미로운 부분은 score를 단순 분석 지표로 두지 않고, 생성 모델 loss로 다시 넣는다는 점입니다. 즉 camouflage를 이해하는 것과 깨뜨리는 것을 하나의 루프로 묶습니다.

## 제안방법

세 가지 camouflage score를 설계하고, 이를 synthetic image/video generation에 보조 loss로 넣습니다. 이후 생성 데이터를 활용해 transformer 기반 video segmentation 모델을 학습합니다.

## 실험

대표 결과는 public MoCA-Mask benchmark에서의 state-of-the-art camouflage breaking 성능입니다. score 기반 synthetic data가 실제 benchmark generalization에 도움을 준다는 점이 핵심입니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| MoCA-Mask | synthetic camouflage generation을 활용한 학습으로 public video camouflage benchmark에서 SOTA를 달성한다고 보고한다. |
| camouflage dataset comparison | 제안한 score로 기존 camouflage datasets의 난도와 camouflage quality를 정량 비교한다. |

## 결론

이 논문은 COD를 단순 segmentation task가 아니라, camouflage quality 자체를 분석하고 조절하는 문제로 확장합니다.

## 논의

최근 benchmark를 읽을 때도 이 논문이 유용한 이유는, 어떤 데이터가 왜 더 어려운지를 score 관점에서 생각하게 해주기 때문입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2023/html/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2023/papers/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.pdf
