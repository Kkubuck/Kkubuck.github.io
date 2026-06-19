---
layout: "post"
title: "Beyond Single Images: Retrieval Self-Augmented Unsupervised Camouflaged Object Detection"
subtitle: "RISE는 한 장의 이미지 안에서만 위장 객체를 찾지 않고, 전체 데이터셋에서 프로토타입을 검색해 pseudo-mask를 만든다."
summary: "RISE는 한 장의 이미지 안에서만 위장 객체를 찾지 않고, 전체 데이터셋에서 프로토타입을 검색해 pseudo-mask를 만든다."
description: "RISE는 한 장의 이미지 안에서만 위장 객체를 찾지 않고, 전체 데이터셋에서 프로토타입을 검색해 pseudo-mask를 만든다."
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

초록을 조금 더 풀어보면, 위장 개체 탐지(COD)의 핵심은 매우 유사한 주변 환경에서 개체를 분할하는 것입니다. 이전의 노력은 주로 이미지 수준 모델링 또는 주석 기반 최적화를 통해 이 문제를 해결했습니다. 상당히 발전했음에도 불구하고 이러한 일반적인 관행은 귀중한 데이터세트 수준의 상황별 정보를 거의 활용하지 않거나 힘든 주석에 의존하지 않습니다. 본 논문에서는 전체 훈련 데이터 세트를 활용하여 COD 모델을 훈련하는 데 사용할 수 있는 단일 이미지에 대한 의사 레이블을 생성하는 RetrIeval SElf 확장 패러다임인 RISE를 제안합니다.

## 서론

기존 비지도 COD는 이미지 한 장만 보고 foreground와 background를 나누려는 경우가 많다. 하지만 위장 객체는 배경과 너무 비슷해서, 단일 이미지 내부 유사도만으로는 쉽게 실패한다. 저자들은 이 한계를 dataset-level retrieval로 돌파한다.

서론에서는 특히, 위장 개체 감지(COD)는 주변 환경에 꼼꼼하게 숨겨진 개체를 분할하는 데 사용됩니다. 기존 연구 노력은 시각적으로 동질적인 배경에서 위장된 개체를 정확하게 묘사하고 추출하기 위해 개별 이미지 내의 상황 정보를 활용하는 데 주로 집중되었습니다. 개별 이미지의 특징에 의존하는 기존 방법과 달리, 우리의 접근 방식은 데이터 세트 수준에서 전체 정보를 활용하여 위장된 개체와 배경 간의 미묘한 차이를 보다 정확하게 캡처할 수 있습니다. • 우리는 COD 데이터세트에서 환경 및 위장 개체 프로토타입을 추출하기 위한 CR을 제안합니다. 프로토타입 라이브러리를 기반으로 환경에서 위장된 객체를 분할하기 위한 다중 뷰 KNN 검색을 제안합니다. • 우리의 광범위한 실험은 제안된 방법의 효율성을 검증합니다.

## 본론

RISE의 관점은 COD를 retrieval-augmented pseudo-labeling 문제로 다시 쓰는 데 있다. 같은 데이터셋 안에도 비슷한 환경, 비슷한 위장 패턴이 반복되므로, 그 정보를 묶어 쓰면 한 장에서는 보이지 않던 구조가 드러난다는 것이다.

## 제안방법

RISE는 먼저 training image만으로 environment prototype과 object prototype library를 만든다. 이때 clustering-then-retrieval 전략을 사용해 고신뢰 프로토타입을 정제한다. 이후 KNN retrieval을 통해 각 이미지용 pseudo-mask를 만들고, multi-view KNN retrieval로 feature artifact 영향을 줄인다.

방법을 조금 더 자세히 보면, 이러한 방법은 주로 단일 이미지 내의 특징 유사성에 중점을 두는 반면, 제안된 검색 기반 접근 방식은 데이터 세트 수준 정보를 활용하여 위장된 개체를 효과적으로 분할합니다. 이를 위해 우리는 데이터 세트에서 고품질 프로토타입을 마이닝하는 CR을 제안합니다. 잘못된 군집화로 인해 전경과 배경의 차이가 감소하여 전역 특징 간의 유사성이 증가한다는 점을 고려하여 유사성이 높은 이미지를 필터링하는 히스토그램 기반 적응형 임계값 방법을 제안합니다. 이러한 아티팩트의 위치는 이미지의 시점에 따라 달라지므로 미세 조정이 필요하지 않은 MVKR(Multi-View KNN Retrieval) 방법을 제안합니다.

## 실험

논문 표에서 DiffCut과 RISE DINOv2-ViT-L14를 비교하면 차이가 매우 크다. 아래 표는 각 데이터셋의 Sα와 MAE만 뽑아 다시 적은 것이다.

실험 파트를 조금 더 자세히 보면, 실험 설정 데이터 세트 및 평가 지표 이전 작업에 따라 훈련 데이터 세트는 COD10K의 3,040개 이미지와 CAMO의 1,000개 이미지로 구성됩니다. 최첨단 비교 방법과의 비교 우리는 우리의 방법을 비지도 기반 분할 접근 방식과 프롬프트 기반 분할 접근 방식과 비교합니다. COD10K 데이터 세트에서 우리의 방법은 메트릭 Eψ 및 F Ω β에서 각각 8% 및 9%의 최소 개선을 달성했습니다. 2, 우리의 방법은 모든 데이터 세트와 지표에서 평균적으로 기준보다 10% 이상 더 뛰어납니다.

## 결론

RISE는 비지도 COD를 retrieval-augmented 학습으로 재정의한 논문이다. 라벨이 없어도 데이터셋 자체를 외부 메모리처럼 쓰면 훨씬 강한 pseudo-label을 만들 수 있다는 메시지가 선명하다.

## 논의

비지도 COD 쪽에서 이 논문은 꽤 중요한 분기점처럼 보인다. 성능 개선 자체도 크지만, 더 중요한 것은 dataset-level information을 적극적으로 쓰는 설계가 이후 방법들의 기본 아이디어가 될 수 있다는 점이다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
