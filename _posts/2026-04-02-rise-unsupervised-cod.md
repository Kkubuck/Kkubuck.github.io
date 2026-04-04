---
layout: "post"
title: "Beyond Single Images: Retrieval Self-Augmented Unsupervised Camouflaged Object Detection"
subtitle: "RISE는 한 장의 이미지 안에서만 위장 객체를 찾지 않고, 전체 데이터셋에서 프로토타입을 검색해 pseudo-mask를 만든다."
summary: "RISE는 한 장의 이미지 안에서만 위장 객체를 찾지 않고, 전체 데이터셋에서 프로토타입을 검색해 pseudo-mask를 만든다."
date: "2026-04-02 09:00:00 +0900"
slug: "rise-unsupervised-cod"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "unsupervised"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.pdf"
---

## 오버뷰

RISE는 위장 객체를 한 장의 이미지 안에서만 분리하려는 기존 비지도 접근을 넘어, 데이터셋 전체 정보를 retrieval 형태로 끌어와 pseudo-label을 만든다. 핵심은 이미지 내부 유사도보다 데이터셋 수준의 문맥이 COD에 더 유용하다는 주장이다.

## 핵심 주장

- 비지도 COD의 병목은 단일 이미지 내부 유사도만으로 foreground/background를 나누려는 데 있다.
- RISE는 environment/object prototype library, clustering-then-retrieval, multi-view KNN retrieval을 통해 더 신뢰도 높은 pseudo-mask를 생성한다.
- 대표 비교에서 DiffCut보다 훨씬 낮은 MAE와 높은 Sα를 보여, retrieval 기반 비지도 학습의 효과를 입증한다.

## 초록

논문은 라벨 없이 COD 모델을 학습할 때, 데이터셋 전체에서 얻을 수 있는 문맥 정보를 적극 활용해야 한다고 말한다. RISE는 환경과 객체의 프로토타입 라이브러리를 만들고, 각 이미지에 대해 KNN retrieval을 수행해 pseudo-mask를 생성한다. 이어 clustering-then-retrieval과 multi-view retrieval로 노이즈를 줄인다.

## 서론

기존 비지도 COD는 이미지 한 장만 보고 foreground와 background를 나누려는 경우가 많다. 하지만 위장 객체는 배경과 너무 비슷해서, 단일 이미지 내부 유사도만으로는 쉽게 실패한다. 저자들은 이 한계를 dataset-level retrieval로 돌파한다.

## 본론

RISE의 관점은 COD를 retrieval-augmented pseudo-labeling 문제로 다시 쓰는 데 있다. 같은 데이터셋 안에도 비슷한 환경, 비슷한 위장 패턴이 반복되므로, 그 정보를 묶어 쓰면 한 장에서는 보이지 않던 구조가 드러난다는 것이다.

## 제안방법

RISE는 먼저 training image만으로 environment prototype과 object prototype library를 만든다. 이때 clustering-then-retrieval 전략을 사용해 고신뢰 프로토타입을 정제한다. 이후 KNN retrieval을 통해 각 이미지용 pseudo-mask를 만들고, multi-view KNN retrieval로 feature artifact 영향을 줄인다.

## 실험

논문 표에서 DiffCut과 RISE DINOv2-ViT-L14를 비교하면 차이가 매우 크다. 아래 표는 각 데이터셋의 Sα와 MAE만 뽑아 다시 적은 것이다.

| 데이터셋 | DiffCut Sα↑ | RISE Sα↑ | DiffCut M↓ | RISE M↓ |
| --- | ---: | ---: | ---: | ---: |
| CHAMELEON | 0.574 | **0.822** | 0.220 | **0.050** |
| CAMO | 0.627 | **0.734** | 0.185 | **0.109** |
| COD10K | 0.628 | **0.763** | 0.120 | **0.049** |
| NC4K | 0.693 | **0.805** | 0.122 | **0.061** |

COD10K와 NC4K처럼 더 어려운 데이터셋에서 차이가 특히 크게 난다. retrieval로 pseudo-label 품질을 올리는 전략이 단순 image-level grouping보다 강하다는 점이 잘 드러난다.

## 결론

RISE는 비지도 COD를 retrieval-augmented 학습으로 재정의한 논문이다. 라벨이 없어도 데이터셋 자체를 외부 메모리처럼 쓰면 훨씬 강한 pseudo-label을 만들 수 있다는 메시지가 선명하다.

## 논의

비지도 COD 쪽에서 이 논문은 꽤 중요한 분기점처럼 보인다. 성능 개선 자체도 크지만, 더 중요한 것은 dataset-level information을 적극적으로 쓰는 설계가 이후 방법들의 기본 아이디어가 될 수 있다는 점이다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
