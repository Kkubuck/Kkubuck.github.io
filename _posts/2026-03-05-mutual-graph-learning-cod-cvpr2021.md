---
layout: "post"
title: "Mutual Graph Learning for Camouflaged Object Detection"
subtitle: "Mutual Graph Learning은 위장 객체와 배경의 subtle relation을 graph 형태로 모델링하려는 초기 대표 작업입니다. local relation만 보지 않고 상호관계를 구조적으로 학습한다는 점이 포인트입니다."
summary: "Mutual Graph Learning은 위장 객체와 배경의 subtle relation을 graph 형태로 모델링하려는 초기 대표 작업입니다. local relation만 보지 않고 상호관계를 구조적으로 학습한다는 점이 포인트입니다."
description: "Mutual Graph Learning은 위장 객체와 배경의 subtle relation을 graph 형태로 모델링하려는 초기 대표 작업입니다. local relation만 보지 않고 상호관계를 구조적으로 학습한다는 점이 포인트입니다."
date: "2026-03-05 09:00:00 +0900"
slug: "mutual-graph-learning-cod-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "graph"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Zhai_Mutual_Graph_Learning_for_Camouflaged_Object_Detection_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Zhai_Mutual_Graph_Learning_for_Camouflaged_Object_Detection_CVPR_2021_paper.pdf"
---

## 오버뷰

Mutual Graph Learning은 위장 객체와 배경의 subtle relation을 graph 형태로 모델링하려는 초기 대표 작업입니다. local relation만 보지 않고 상호관계를 구조적으로 학습한다는 점이 포인트입니다.

## 핵심 주장

- COD에서는 픽셀이나 feature만 따로 보는 것보다 관계 구조를 그래프로 학습하는 편이 유리하다.
- mutual graph learning이 foreground-background interaction을 더 정교하게 표현한다.
- CVPR 2021 시점 기준 strong COD baseline으로 자리잡으며 이후 graph/transformer reasoning 계열의 출발점이 된다.

## 초록

이 논문은 camouflage detection에서 상호관계 modeling의 중요성을 강조하며, mutual graph learning framework를 제안합니다. 관계 기반 reasoning으로 subtle difference를 더 잘 찾는 방향입니다.

## 서론

2021년 COD 논문들을 다시 보면 relation modeling이 본격화되는 시점이 바로 이 부근입니다. Mutual Graph Learning은 그런 흐름의 대표적인 예입니다.

## 본론

그래프 기반 reasoning은 픽셀 자체보다 관계를 중심으로 본다는 장점이 있습니다. camouflage처럼 절대 차이가 약한 문제에서는 특히 그 장점이 드러납니다.

## 제안방법

저자들은 foreground와 background 간 상호작용을 graph structure로 만들고, mutual learning으로 중요한 relation을 강조합니다. relation-centric decoding이라고 볼 수 있습니다.

## 실험

이 논문은 당시 COD benchmark에서 strong baseline 성능을 보이며, relation modeling의 효과를 정량적으로 보여주는 데 초점을 둡니다.

### 메인 실험 결과

| 모델 | CHAMELEON [47] / Sα ↑ Eφ ↑ F βw ↑ M ↓ | CAMO (Sα↑ Eφ↑ M↓) | COD10K (Sα↑ Eφ↑ M↓) |
| --- | --- | --- | --- |
| 2017 FPN † [27] | 0.794 0.783 0.590 0.075 | 0.684 0.677 0.483 0.131 | 0.697 0.691 0.411 0.075 |
| 2017 MaskRCNN † [13] | 0.643 0.778 0.518 0.099 | 0.574 0.715 0.430 0.151 | 0.613 0.748 0.402 0.080 |
| 2017 PSPNet † [68] | 0.773 0.758 0.555 0.085 | 0.663 0.659 0.455 0.139 | 0.678 0.680 0.377 0.080 |
| 2018 UNet++ † [73] | 0.695 0.762 0.501 0.094 | 0.599 0.653 0.392 0.149 | 0.623 0.672 0.350 0.086 |
| 2018 PiCANet † [31] | 0.769 0.749 0.536 0.085 | 0.609 0.584 0.356 0.156 | 0.649 0.643 0.322 0.090 |
| 2019 MSRCNN † [16] | 0.637 0.686 0.443 0.091 | 0.617 0.669 0.454 0.133 | 0.641 0.706 0.419 0.073 |
| 2019 PoolNet † [30] | 0.776 0.779 0.555 0.081 | 0.702 0.698 0.494 0.129 | 0.705 0.713 0.416 0.074 |
| 2019 BASNet † [45] | 0.687 0.721 0.474 0.118 | 0.618 0.661 0.413 0.159 | 0.634 0.678 0.365 0.105 |
| 2019 PFANet † [70] | 0.679 0.648 0.378 0.144 | 0.659 0.622 0.391 0.172 | 0.636 0.618 0.286 0.128 |
| 2019 CPD † [59] | 0.853 0.866 0.706 0.052 | 0.726 0.729 0.550 0.115 | 0.747 0.770 0.508 0.059 |
| 2019 HTC † [1] | 0.517 0.489 0.204 0.129 | 0.476 0.442 0.174 0.172 | 0.548 0.520 0.221 0.088 |
| 2019 EGNet † [69] | 0.848 0.870 0.702 0.050 | 0.732 0.768 0.583 0.104 | 0.737 0.779 0.509 0.056 |
| 2019 ANet-SRM [20] | ‡ ‡ ‡ ‡ | 0.682 0.685 0.484 0.126 | ‡ ‡ ‡ ‡ |
| 2020 MirrorNet [63] | ‡ ‡ ‡ ‡ | 0.741 0.804 0.652 0.100 | ‡ ‡ ‡ ‡ |
| 2020 PraNet [10] | 0.860 0.898 0.763 0.044 | 0.769 0.833 0.663 0.094 | 0.789 0.839 0.629 0.045 |
| 2020 SINet [9] | 0.869 0.891 0.740 0.044 | 0.751 0.771 0.606 0.100 | 0.771 0.806 0.551 0.051 |
| S-MGL (ours) | 0.892 0.921 0.803 0.032 | 0.772 0.850 0.664 0.089 | 0.811 0.851 0.655 0.037 |
| R-MGL (ours) | 0.893 0.923 0.813 0.030 | 0.775 0.847 0.673 0.088 | 0.814 0.865 0.666 0.035 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

Mutual Graph Learning은 transformer reasoning이 대세가 되기 전, relation modeling이 왜 COD에서 중요한지 보여준 논문입니다.

## 논의

지금 보면 구조는 이전 세대지만, relation을 어떻게 볼 것인가라는 질문은 여전히 남아 있어서 다시 읽을 가치가 있습니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Zhai_Mutual_Graph_Learning_for_Camouflaged_Object_Detection_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Zhai_Mutual_Graph_Learning_for_Camouflaged_Object_Detection_CVPR_2021_paper.pdf
