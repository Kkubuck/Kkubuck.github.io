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

### 메인 실험 결과

Table 1. Results of the proposed camouflage scores on natural and synthetic datasets.

| 데이터셋 | 유형 | SRf↑ | Sb↑ | Sα↑ | d²F↓ |
| --- | --- | --- | --- | --- | --- |
| CHAMELEON [32] | Image | 0.694 | 0.445 | 0.607 | 0.70 |
| CAMO Train [20] | Image | 0.672 | 0.451 | 0.595 | 1.01 |
| CAMO Test [20] | Image | 0.683 | 0.470 | 0.608 | 1.00 |
| COD10K Train [9] | Image | 0.655 | 0.433 | 0.577 | 0.90 |
| COD10K Test [9] | Image | 0.657 | 0.431 | 0.578 | 0.90 |
| Camouflaged Animals [1] | Video | 0.674 | 0.536 | 0.626 | 1.60 |
| MoCA-Mask Train [5, 19] | Video | 0.850 | 0.443 | 0.707 | 1.14 |
| MoCA-Mask Test [5, 19] | Video | 0.733 | 0.464 | 0.639 | 2.51 |
| Camouflaged cuboids[12, 27] | Multi-view | 0.894 | 0.433 | 0.733 | 6.2 |
| Syn. Camouflage w.o. LF | Image | 0.608 | 0.432 | 0.546 | 1.36 |
| Syn. Camouflage w. LF | Image | 0.679 | 0.447 | 0.598 | 1.13 |
| Syn. Camouflage Video | Video | 0.658 | 0.430 | 0.578 | 1.18 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

이 논문은 COD를 단순 segmentation task가 아니라, camouflage quality 자체를 분석하고 조절하는 문제로 확장합니다.

## 논의

최근 benchmark를 읽을 때도 이 논문이 유용한 이유는, 어떤 데이터가 왜 더 어려운지를 score 관점에서 생각하게 해주기 때문입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2023/html/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2023/papers/Lamdouar_The_Making_and_Breaking_of_Camouflage_ICCV_2023_paper.pdf
