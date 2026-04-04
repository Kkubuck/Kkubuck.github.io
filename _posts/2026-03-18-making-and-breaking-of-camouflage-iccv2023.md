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

초록을 조금 더 풀어보면, 모든 위장이 똑같이 효과적인 것은 아닙니다. 부분적으로 보이는 윤곽이나 약간의 색상 차이로 인해 동물이 눈에 띄고 위장이 깨질 수 있습니다. 본 논문에서는 위장의 효과를 자동으로 평가하기 위한 세 가지 점수를 제안함으로써 위장이 성공하는 이유에 대한 질문을 다룹니다. 특히, 우리는 위장이 배경과 전경 특징 사이의 유사성과 경계 가시성에 의해 측정될 수 있음을 보여줍니다. 우리는 이러한 위장 점수를 사용하여 사용 가능한 모든 위장 데이터 세트를 평가하고 비교합니다.

## 서론

이 논문은 detection architecture보다 dataset difficulty와 camouflage quality 자체를 분석 대상으로 삼습니다. 그래서 benchmark 해석에도 도움이 되는 작업입니다.

서론에서는 특히, 위장은 오랫동안 과학계, 특히 위장을 종 적응의 훌륭한 사례로 여기는 진화생물학자들의 관심과 매혹의 대상이었습니다. 포식자를 혼란스럽게 하거나 먹이로부터 숨고 자연 서식지에서 생존 가능성을 높이기 위해 동물은 파괴적인 색상 및 배경 일치와 같은 수많은 위장 메커니즘을 개발했습니다. 이미지 a와 c는 이미지 b보다 더 나은 배경 유사성을 나타내지만 여우 경계는 이미지 c보다 이미지 a에서 더 잘 보입니다. 우리는 배경과 관련하여 위장이 만들어내는 모호함의 정도를 측정하여 위장의 효과를 평가합니다. 의 까다로운 객체 분할 작업입니다.

## 본론

흥미로운 부분은 score를 단순 분석 지표로 두지 않고, 생성 모델 loss로 다시 넣는다는 점입니다. 즉 camouflage를 이해하는 것과 깨뜨리는 것을 하나의 루프로 묶습니다.

## 제안방법

세 가지 camouflage score를 설계하고, 이를 synthetic image/video generation에 보조 loss로 넣습니다. 이후 생성 데이터를 활용해 transformer 기반 video segmentation 모델을 학습합니다.

방법을 조금 더 자세히 보면, 또한 제안된 위장 점수를 생성 모델에 보조 손실로 통합하고 효과적인 위장 이미지 또는 비디오를 확장 가능한 방식으로 합성할 수 있음을 보여줍니다. 위장 비디오 시퀀스 생성 이 섹션에서는 숨겨진 동물이 포함된 이미지를 생성하기 위한 확장 가능한 파이프라인을 제안합니다. 우리의 실험은 제안된 위장 점수에 대한 철저한 분석을 제시하고 훈련 프레임워크에서의 효율성을 보여줍니다. 위장된 객체 분할을 위한 Anabranch 네트워크.

## 실험

대표 결과는 public MoCA-Mask benchmark에서의 state-of-the-art camouflage breaking 성능입니다. score 기반 synthetic data가 실제 benchmark generalization에 도움을 준다는 점이 핵심입니다.

실험 파트를 조금 더 자세히 보면, 결과 이 섹션에서는 점수 기능의 효율성과 훈련 루프에 d2 F를 포함하는 이점을 보여주기 위해 정성적 및 정량적 결과를 제시합니다. 모든 위장 이미지 및 비디오 데이터 세트에 대한 위장 점수를 계산하고 결과를 Tab에 보고합니다. 위장 비디오 비디오 0.658 0.430 0.578 1.18 자연 위장 데이터 세트(상단) 및 합성 생성된 위장 데이터 세트(하단)에 대해 제안된 점수의 결과입니다. LF 손실을 추가하면 탭의 이미지 내 FrÂchet 거리가 있거나 없는 두 데이터 세트에 대해 계산된 Sα에 표시된 것처럼 질적 및 양적으로 배경에서 더 나은 혼합이 포함된 이미지가 생성됩니다.

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
