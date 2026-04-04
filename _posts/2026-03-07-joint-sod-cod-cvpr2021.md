---
layout: "post"
title: "Uncertainty-Aware Joint Salient Object and Camouflaged Object Detection"
subtitle: "이 논문은 SOD와 COD를 서로 반대되는 정보로 활용할 수 있다고 봅니다. easy positives와 hard positives를 교차 활용하고, similarity measure와 uncertainty-aware adversarial learning으로 두 문제를 함께 강화합니다."
summary: "이 논문은 SOD와 COD를 서로 반대되는 정보로 활용할 수 있다고 봅니다. easy positives와 hard positives를 교차 활용하고, similarity measure와 uncertainty-aware adversarial learning으로 두 문제를 함께 강화합니다."
description: "이 논문은 SOD와 COD를 서로 반대되는 정보로 활용할 수 있다고 봅니다. easy positives와 hard positives를 교차 활용하고, similarity measure와 uncertainty-aware adversarial learning으로 두 문제를 함께 강화합니다."
date: "2026-03-07 09:00:00 +0900"
slug: "joint-sod-cod-cvpr2021"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sod"
  - "uncertainty"
  - "cvpr2021"
venue: "CVPR 2021"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.pdf"
---

## 오버뷰

이 논문은 SOD와 COD를 서로 반대되는 정보로 활용할 수 있다고 봅니다. easy positives와 hard positives를 교차 활용하고, similarity measure와 uncertainty-aware adversarial learning으로 두 문제를 함께 강화합니다.

## 핵심 주장

- SOD와 COD는 상반된 특성을 갖지만, 서로의 hard/easy sample로 활용할 수 있다.
- similarity measure module이 두 과제의 contradictory attributes를 명시적으로 모델링한다.
- uncertainty-aware adversarial learning으로 두 과제 모두에서 SOTA 성능을 얻는다.

## 초록

저자들은 COD의 easy positives를 SOD의 hard positives로, 반대로도 활용하며 두 과제의 상반성을 학습 신호로 바꿉니다. 여기에 higher-order similarity measure와 confidence estimation을 결합해 joint detection framework를 구성합니다.

## 서론

COD와 SOD를 같이 보는 시도는 지금도 반복되지만, 이 논문은 가장 초기에 그 관계를 구조적으로 다룬 축에 가깝습니다.

## 본론

중요한 포인트는 두 과제를 같은 문제로 합치지 않는다는 점입니다. 서로 반대되는 속성을 이용해 representation을 더 탄탄하게 만드는 방식입니다.

## 제안방법

easy/hard sample transfer, similarity measure module, adversarial learning 기반 confidence estimation을 결합해 joint framework를 설계합니다.

## 실험

논문은 SOD와 COD 두 영역의 benchmark에서 모두 좋은 성능을 내는 점을 강조합니다. joint learning이 한쪽만 희생하지 않는다는 메시지입니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| SOD benchmarks | joint framework가 salient object detection에서도 state-of-the-art 성능을 낸다고 보고한다. |
| COD benchmarks | camouflaged object detection에서도 동시에 강한 성능을 보여 두 과제의 상호이익을 강조한다. |

## 결론

이 논문은 COD를 반대 과제와 함께 읽는 관점을 만든 작업입니다. 이후 generalist 논문을 볼 때도 자주 되짚게 됩니다.

## 논의

최근 USCNet이나 VSCode 같은 논문이 왜 자연스럽게 읽히는지 이해하려면, 이런 초기 joint-task 논문을 같이 보는 편이 좋습니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2021/html/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2021/papers/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.pdf
