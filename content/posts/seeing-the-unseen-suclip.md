---
title: 'Seeing the Unseen: A Semantic Alignment and Context-Aware Prompt Framework for Open-Vocabulary Camouflaged Object Segmentation'
description: 위장 장면에서 개방 어휘 분할 모델이 겪는 의미 혼동을, 맥락 인식 프롬프트와 클래스 인식 특징 선택, 의미 일관성 손실로 줄이는 SuCLIP.
pubDate: 2026-04-04 09:00:00 +0900
category: paper-review
tags: [cod, open-vocabulary, clip]
takeaways:
  - 개방 어휘 분할 모델은 위장 장면에서 의미 혼동을 겪어, 객체를 덜 분할하거나 엉뚱한 클래스로 분류한다.
  - CLIP 시각 인코더의 내부 지식으로 텍스트 프롬프트를 보강하고, 클래스 인식 특징 선택으로 텍스트·시각 임베딩을 위장 객체에 맞게 조정한다.
  - 의미 일관성 손실과 텍스트 쿼리 디코더로 텍스트 의미와 픽셀 결과를 맞춰, OVCamo에서 OVCoser를 크게 앞섰다.
paper:
  title: 'Seeing the Unseen: A Semantic Alignment and Context-Aware Prompt Framework for Open-Vocabulary Camouflaged Object Segmentation'
  authors: Peng Ren, Tian Bai, Jing Sun, Fuming Sun
  venue: ICCV 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.pdf
---

## 문제

개방 어휘 위장 객체 분할(OVCOS)은 텍스트 설명을 바탕으로 어떤 클래스의 위장 객체든 분할하는 작업이다. 기존 개방 어휘 방법들은 분할 능력이 강하지만, 위장 장면에서는 큰 한계가 있다. 바로 **의미 혼동**(semantic confusion)이다. 이 때문에 객체를 일부만 분할하거나(불완전 분할), 다른 클래스로 잘못 분류한다(클래스 이동).

## 방법

SuCLIP은 텍스트와 시각 정보의 의미를 위장 객체에 맞게 정렬하는 네 가지 장치로 이루어진다.

### 맥락 인식 프롬프트

CLIP 시각 인코더 **내부의 지식**을 이용해 텍스트 프롬프트를 풍부하게 만들고, 지역 시각 특징과 정렬한다. "개구리" 같은 클래스 이름만으로는 부족한 맥락을 이미지에서 끌어와 프롬프트를 강화하는 것이다.

### 클래스 인식 특징 선택

시각 의미 공간과 텍스트 의미 공간을 더 잘 맞추기 위해, 텍스트와 시각 임베딩을 위장 객체에 더 잘 맞도록 **동적으로** 조정한다.

### 의미 일관성 손실

텍스트 프롬프트와 시각 특징 사이의 의미 차이를 줄여, 분할 결과가 텍스트 프롬프트와 의미적으로 일치하도록 만든다.

### 텍스트 쿼리 디코더

텍스트의 의미를 픽셀 단위 분할 결과로 정확하게 옮겨, 의미와 공간이 일관된 디코딩을 한다.

## 실험

OVCamo 데이터셋에서 기존 기준 모델 OVCoser를 크게 앞섰다.

## 정리

[OVCoser](/posts/ovcos-ovcoser-eccv2024/)가 경계·깊이 같은 **구조 단서**로 위장 객체를 보완했다면, SuCLIP은 텍스트와 시각 사이의 **의미 정렬**을 정교하게 만드는 쪽에 집중했다. 두 논문을 나란히 놓으면 OVCOS의 오류가 "어디인지 못 찾는 문제"와 "이름을 잘못 붙이는 문제"로 나뉜다는 것이 잘 보인다.

의미 정렬 장치가 여러 개 들어가는 만큼, 어떤 장치가 불완전 분할을 줄이고 어떤 장치가 클래스 혼동을 줄이는지는 절제 실험으로 나눠 확인할 필요가 있다.
