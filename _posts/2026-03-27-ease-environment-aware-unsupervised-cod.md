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

초록을 조금 더 풀어보면, 위장 개체 감지(COD)는 매우 유사한 배경에서 개체를 구별하려고 합니다. 기존 작업은 기본적으로 위장된 개체를 환경에서 격리하는 데 중점을 두어 지속적으로 향상된 성능을 보여 주지만 광범위한 주석과 복잡한 최적화가 필요합니다. 본 논문에서 우리는 이러한 패러다임에서 벗어나 위장된 물체로부터 두드러진 환경을 분리하는 렌즈로 전환합니다. 환경 프로토타입 라이브러리를 참조하여 환경을 식별하고 검색된 환경 특징을 반전시켜 위장된 개체를 감지하는 환경 인식 unSupErvised COD 프레임워크인 EASE를 소개합니다.

## 서론

이 논문은 문제를 보는 방향 자체를 바꾼다는 점에서 눈에 띈다. 위장 객체가 잘 안 보이는 이유는 객체가 약해서가 아니라 환경이 너무 강하기 때문이라고 보고, 그러면 환경을 더 잘 모델링하는 쪽이 오히려 낫다는 것이다.

서론에서는 특히, 기능 간 유사성에만 의존하는 대신 EASE는 미리 정의된 환경 프로토타입과 기능을 비교하여 배경 영역을 식별합니다. 기존 COD 방법은 숨겨진 신호를 감지하기 위해 환경 내 숨겨진 단서를 식별하는 데 중점을 둡니다. 광범위한 라벨링에 대한 의존도를 더욱 줄이기 위해 약한 지도 학습은 점, 낙서, 상자 또는 의사 라벨과 같은 희소 주석을 사용하여 모델이 위장된 객체를 배경과 구별하도록 안내합니다.

## 본론

EASE는 environment prototype library를 중심으로 COD를 retrieval 문제로 푼다. 특히 foreground/background confusion을 줄이기 위해 thresholding, global-to-local retrieval, self-retrieval을 조합하는 점이 핵심이다.

## 제안방법

DiffPro 단계에서 large multimodal model, diffusion model, vision foundation model을 활용해 environment prototype library를 만든다. 이후 KDE-based adaptive threshold, global-to-local retrieval, self-retrieval을 통해 각 이미지에 맞는 환경 특징을 찾아내고, 이를 뒤집어 camouflaged object를 추론한다.

방법을 조금 더 자세히 보면, 셋째, 특징 자체가 프로토타입 라이브러리 역할을 하는 특징 간 유사성을 활용하여 G2L 검색을 보완하는 SR을 제안합니다. (Sec. Global-to-Local Retrieval 우리는 환경을 거친 것에서 미세한 것까지 효율적으로 검색하기 위해 G2L을 제안합니다. 이를 완화하기 위해 임베딩 F 자체가 프로토타입 역할을 하는 Self-Retrieval(SR)을 제안합니다. 우리는 하이퍼파라미터를 통해 모든 분포에 대해 고정된 임계값을 설정하는 대신 각 유사성 분포에 대해 적응형 임계값을 제공하는 KDE-AT를 제안합니다. 검색.

## 실험

VoteCut DINO(v2) Ensemble과 EASE DINOv2-ViT-L/14를 비교하면 개선 폭이 꽤 크다. 아래 표는 Sα와 M만 정리한 것이다.

실험 파트를 조금 더 자세히 보면, 데이터 세트 전반에 걸쳐 수행된 결과는 우리의 EASE가 SOTA 비지도 방법보다 훨씬 뛰어난 성능을 보여줍니다. 우리의 기여는 다음과 같이 요약됩니다. • 우리는 COD를 이해하는 새로운 관점, 즉 환경에서 위장된 부분을 찾는 것이 아니라 위장된 환경에서 환경을 제거하는 방법을 소개합니다. 협업 프레임워크의 DiffPro. • 우리는 위장된 개체로부터 환경을 효과적이고 효율적으로 격리하기 위해 다면적인 검색 체계(KDE-AT, G2L 및 SR 포함)를 고안합니다. 광범위한 실험을 통해 우리 방법의 효율성이 입증되었습니다.

## 결론

EASE는 비지도 COD를 object-centric view에서 environment-centric view로 전환한 논문이다. retrieval과 inversion을 결합한 발상이 논문 전체를 관통한다.

## 논의

같은 저자군의 RISE와 함께 보면 더 재미있다. 둘 다 dataset-level retrieval을 적극적으로 쓰지만, RISE가 foreground prototype에 더 가깝다면 EASE는 environment 쪽으로 더 강하게 기운다. 둘을 같이 읽으면 최근 비지도 COD의 방향이 꽤 선명하게 보인다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2025/html/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2025/papers/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.pdf
