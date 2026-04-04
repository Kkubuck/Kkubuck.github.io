---
layout: "post"
title: "Rethinking Detecting Salient and Camouflaged Objects in Unconstrained Scenes"
subtitle: "USCNet은 SOD와 COD를 분리된 문제로 보지 않고, 같은 장면 안에서 함께 존재하는 관계까지 모델링해야 한다고 주장한다."
summary: "USCNet은 SOD와 COD를 분리된 문제로 보지 않고, 같은 장면 안에서 함께 존재하는 관계까지 모델링해야 한다고 주장한다."
date: "2026-04-03 09:00:00 +0900"
slug: "uscnet-unconstrained-scenes"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sod"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.pdf"
---

## 오버뷰

이 논문은 SOD와 COD를 따로 푸는 기존 데이터와 모델 설계가 현실 장면을 충분히 반영하지 못한다고 본다. 그래서 USC12K라는 새 데이터셋과, salient object와 camouflaged object의 관계를 함께 다루는 USCNet을 제안한다.

## 핵심 주장

- 실제 장면에서는 salient object와 camouflaged object가 상호 배타적으로만 존재하지 않으므로, 기존 SOD/COD 데이터 가정이 현실과 어긋난다.
- USC12K는 두 유형이 함께 등장하는 장면까지 포함해 더 현실적인 평가 환경을 제공한다.
- USCNet은 inter-sample / intra-sample prompt query와 ARM을 통해 두 대상의 관계를 명시적으로 모델링하고, 전체 장면 지표에서 Spider를 넘어섰다.

## 초록

저자들은 기존 SOD 모델은 위장 객체를 salient로, COD 모델은 salient 객체를 위장 객체로 잘못 해석하는 경향이 있다고 지적한다. 원인은 상호 배타적인 데이터셋 가정과, 두 대상 간 관계를 명시적으로 모델링하지 않는 현재 방법론에 있다고 본다. 이를 해결하기 위해 USC12K 데이터셋, USCNet 모델, 그리고 CSCS 평가 지표를 제안한다.

## 서론

이 논문이 흥미로운 이유는 성능을 조금 더 올리는 수준이 아니라 문제 정의 자체를 다시 세우기 때문이다. 기존 SOD/COD 벤치마크는 한 장면에 salient object만 있거나, camouflaged object만 있는 식의 강한 제약을 두는 경우가 많다. 하지만 실제 환경은 훨씬 복합적이다.

## 본론

USC12K는 이러한 문제의식을 반영해 네 가지 장면 시나리오를 포함하도록 설계되었다. 그리고 USCNet은 단일 객체 검출보다 관계 추론에 가깝게 문제를 푼다. 즉, 어떤 부분이 눈에 띄는지와 어떤 부분이 숨는지를 동시에 보면서 장면 전체의 논리를 맞추려는 방향이다.

## 제안방법

USCNet은 inter-sample prompt query와 intra-sample prompt query를 통해 표본 간 관계와 장면 내부 관계를 각각 모델링한다. 여기에 ARM 모듈을 더해 salient / camouflaged representation을 더 잘 분리한다. 논문은 또 CSCS라는 지표를 제안해, 모델이 두 종류의 대상을 얼마나 잘 구분하는지를 전체 장면 수준에서 평가한다.

## 실험

대표 비교는 overall scenes 기준으로 Spider(ICML 2024)와 USCNet을 나란히 보는 것이 가장 명확하다. USCNet은 mIoU와 mAcc를 끌어올리면서, 구분 실패를 나타내는 CSCS는 더 낮췄다.

| 모델 | mIoU↑ | mAcc↑ | CSCS↓ |
| --- | ---: | ---: | ---: |
| Spider (ICML 2024) | 74.92 | 85.79 | 7.86 |
| USCNet | **78.03** | **87.92** | **7.49** |

이 표는 USCNet의 메시지를 잘 보여준다. 단순 COD 점수만 올린 것이 아니라, 전체 장면 수준에서 salient object와 camouflaged object를 함께 구분하는 능력을 개선했다는 점이 핵심이다.

## 결론

USCNet은 SOD와 COD를 분리된 파이프라인으로 둘 것이 아니라, 같은 장면의 서로 다른 측면으로 함께 다뤄야 한다는 방향을 제시한다. 데이터셋과 모델을 동시에 제안했다는 점에서 영향력이 크다.

## 논의

이 논문은 앞으로 COD를 볼 때 데이터셋 가정부터 다시 확인하게 만든다. 기존 benchmark에만 맞춘 모델은 현실 장면에서 쉽게 흔들릴 수 있고, USCNet은 그 틈을 정확히 짚었다. 논문 리뷰용 관점에서 보면, 이 글은 성능표보다도 문제 정의를 왜 바꿨는지 읽는 게 더 중요하다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.pdf
