---
layout: "post"
title: "Shift the Lens: Environment-Aware Unsupervised Camouflaged Object Detection"
subtitle: "EASE는 위장 객체를 직접 찾기보다 환경을 먼저 식별한 뒤 반전시키는 방식으로 비지도 COD를 다시 정의한다."
summary: "EASE는 위장 객체를 직접 찾기보다 환경을 먼저 식별한 뒤 반전시키는 방식으로 비지도 COD를 다시 정의한다."
description: "EASE는 위장 객체를 직접 찾기보다 환경을 먼저 식별한 뒤 반전시키는 방식으로 비지도 COD를 다시 정의한다."
date: "2026-03-27 09:00:00 +0900"
slug: "ease-environment-aware-unsupervised-cod"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "unsupervised"
  - "cvpr2025"
venue: "CVPR 2025"
source_url: "https://openaccess.thecvf.com/content/CVPR2025/html/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2025/papers/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.pdf"
---

## 오버뷰

EASE는 비지도 COD의 시선을 객체에서 환경으로 돌린다. 위장 객체를 직접 꺼내려 하기보다, 먼저 salient environment를 안정적으로 찾고 그 반전으로 camouflaged object를 얻겠다는 발상이다.

## 핵심 주장

- 비지도 COD에서 foreground를 직접 찾는 접근은 위장 장면에서 쉽게 흔들린다.
- EASE는 environment prototype library와 retrieval schemes(KDE-AT, G2L, SR)를 통해 환경을 먼저 식별한다.
- VoteCut 계열 baseline과 비교해 네 데이터셋 모두에서 Sα를 끌어올리고 M을 크게 낮췄다.

## 초록

논문은 기존 비지도 COD가 extensive annotation 없이도 성능을 높이려 했지만 여전히 객체 중심 분리에 머문다고 본다. 그래서 EASE는 environment-aware unsupervised framework를 제안하고, environment prototype library를 참조한 뒤 environmental feature를 invert해 camouflaged object를 검출한다. 또한 SAM과 결합했을 때 prompt-based segmentation보다 강하고 일부 fully-supervised 방법과도 경쟁력이 있다고 말한다.

## 서론

이 논문은 문제를 보는 방향 자체를 바꾼다는 점에서 눈에 띈다. 위장 객체가 잘 안 보이는 이유는 객체가 약해서가 아니라 환경이 너무 강하기 때문이라고 보고, 그러면 환경을 더 잘 모델링하는 쪽이 오히려 낫다는 것이다.

## 본론

EASE는 environment prototype library를 중심으로 COD를 retrieval 문제로 푼다. 특히 foreground/background confusion을 줄이기 위해 thresholding, global-to-local retrieval, self-retrieval을 조합하는 점이 핵심이다.

## 제안방법

DiffPro 단계에서 large multimodal model, diffusion model, vision foundation model을 활용해 environment prototype library를 만든다. 이후 KDE-based adaptive threshold, global-to-local retrieval, self-retrieval을 통해 각 이미지에 맞는 환경 특징을 찾아내고, 이를 뒤집어 camouflaged object를 추론한다.

## 실험

VoteCut DINO(v2) Ensemble과 EASE DINOv2-ViT-L/14를 비교하면 개선 폭이 꽤 크다. 아래 표는 Sα와 M만 정리한 것이다.

| 데이터셋 | VoteCut Sα↑ | EASE Sα↑ | VoteCut M↓ | EASE M↓ |
| --- | ---: | ---: | ---: | ---: |
| CHAMELEON | 0.674 | **0.819** | 0.145 | **0.044** |
| CAMO | 0.637 | **0.749** | 0.170 | **0.098** |
| COD10K | 0.690 | **0.773** | 0.092 | **0.040** |
| NC4K | 0.739 | **0.800** | 0.097 | **0.056** |

특히 CHAMELEON과 COD10K에서의 개선 폭이 크다. 환경을 먼저 식별한다는 문제 재정의가 정량 성능에도 꽤 직접적으로 반영된다.

## 결론

EASE는 비지도 COD를 object-centric view에서 environment-centric view로 전환한 논문이다. retrieval과 inversion을 결합한 발상이 논문 전체를 관통한다.

## 논의

같은 저자군의 RISE와 함께 보면 더 재미있다. 둘 다 dataset-level retrieval을 적극적으로 쓰지만, RISE가 foreground prototype에 더 가깝다면 EASE는 environment 쪽으로 더 강하게 기운다. 둘을 같이 읽으면 최근 비지도 COD의 방향이 꽤 선명하게 보인다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2025/html/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2025/papers/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.pdf
