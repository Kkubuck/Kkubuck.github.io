---
layout: post
title: 'Shift the Lens: Environment-Aware Unsupervised Camouflaged Object Detection'
subtitle: 객체를 직접 찾는 대신 먼저 배경 환경의 prototype을 검색하고, 그 환경 특징을 뒤집어 남는 영역을 위장 객체로 보는 environment-first UCOD 프레임워크 EASE.
summary: EASE는 multimodal·diffusion·vision foundation model로 environment prototype library를 만들고, KDE-AT·G2L·Self-Retrieval로
  장면에 맞는 배경을 찾는다.
description: EASE는 multimodal·diffusion·vision foundation model로 environment prototype library를 만들고, KDE-AT·G2L·Self-Retrieval로
  장면에 맞는 배경을 찾는다.
date: 2026-03-27 09:00:00 +0900
slug: ease-environment-aware-unsupervised-cod
lang: ko
paper: true
categories:
- papers
tags:
- paper
- unsupervised-cod
- retrieval
- environment-modeling
- cvpr-2025
venue: CVPR 2025
paper_year: 2025
paper_authors: Ji Du, Fangwei Hao, Mingyang Yu, Desheng Kong, Jiesheng Wu, Bin Wang, Jing Xu, Ping Li
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2025/html/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2025/papers/Du_Shift_the_Lens_Environment-Aware_Unsupervised_Camouflaged_Object_Detection_CVPR_2025_paper.pdf
code_url: https://github.com/xiaohainku/EASE
takeaways:
- 전경의 약한 공통성을 찾기보다 상대적으로 넓고 반복적인 환경을 먼저 모델링한 뒤 그 complement를 객체로 본다.
- DiffPro가 environment library를 구성하고 세 retrieval scheme이 전역·국소·자기 참조를 결합한다.
- 라벨은 쓰지 않지만 여러 foundation model의 지식을 사용하므로 순수 data-from-scratch 무감독과는 비용·가정이 다르다.
---

## 객체가 안 보이면 배경부터 찾는다

대부분의 COD 모델은 객체 특징을 배경에서 분리하려고 한다. 그러나 위장 객체는 종류가 다양하고 내부가 배경을 닮아, supervision 없이 공통 foreground prototype을 만들기 어렵다. EASE는 시선을 뒤집는다. 장면의 대부분을 차지하고 반복되는 **environment를 먼저 식별한 뒤, 그 환경이 아닌 부분을 객체 후보로 본다.**

negative space를 모델링하는 접근이다. 객체의 모습은 매번 달라도 숲, 모래, 수중, 암석 같은 배경은 데이터셋 수준에서 재사용 가능한 구조를 가진다는 가정이 깔려 있다.

## Environment Prototype Library

EASE의 DiffPro는 large multimodal model, diffusion model, vision foundation model의 지식을 활용해 environment prototype library를 구축한다. 텍스트·생성·시각 표현을 함께 사용하면 단일 이미지의 noisy feature보다 배경 category와 texture를 풍부하게 표현할 수 있다.

이 library는 라벨 mask를 요구하지 않지만 완전히 지식이 없는 것은 아니다. 대형 사전학습 모델이 외부 데이터에서 배운 semantic과 visual prior를 적극적으로 가져온다. 따라서 ‘unsupervised’는 target COD pixel label을 사용하지 않는다는 의미로 읽어야 한다.

## 세 가지 retrieval

**KDE-AT**는 kernel density estimation으로 prototype match의 분포를 보고 장면마다 threshold를 조절한다. 고정 임계값이 밝기·질감이 다른 환경에서 실패하는 문제를 줄인다.

**Global-to-Local retrieval**은 먼저 이미지 전체와 맞는 환경을 찾고, 이후 픽셀 수준으로 내려가 배경 영역을 정교하게 확인한다. **Self-Retrieval**은 외부 library만 믿지 않고 현재 이미지 내부의 반복 특징도 참조해 특수한 환경을 보완한다. 세 경로가 합쳐져 foreground와 background를 뒤바꾸는 오류를 줄인다.

## inversion으로 객체를 얻기

검색된 environment feature와 잘 맞는 픽셀은 배경으로, 맞지 않는 잔여 영역은 camouflaged object 후보로 본다. 이 complement 방식은 foreground category를 미리 알 필요가 없다는 장점이 있다. SAM과 결합하면 environment에서 얻은 mask나 prompt를 범용 segmentation prior로 정제할 수도 있다.

하지만 객체가 배경 면적의 대부분을 차지하거나, 장면 안에 서로 다른 환경이 여러 개 있으면 ‘환경이 더 안정적’이라는 가정이 약해진다. 인공 위장처럼 객체 표면이 배경 texture를 실제로 복제한 경우 library match만으로도 구분이 어렵다.

## 실험에서 따질 것

논문은 unsupervised COD와 prompt-based segmentation을 비교하고 COD10K에서 큰 평균 개선을 보고한다. 수치와 함께 foundation model 호출 비용, library 생성 시간, 저장 크기, target dataset 전체를 미리 보는지 여부를 확인해야 한다. transductive 정보 사용 범위가 baseline과 다르면 단순 정확도 비교가 불공정할 수 있다.

retrieval 세 요소의 절제뿐 아니라 library category 수, 잘못 검색된 환경에서의 민감도, 새로운 domain의 zero-shot 성능이 방법의 가설을 더 직접 검증한다.

## 이 논문에서 가져갈 것

어려운 positive를 직접 모델링하기보다 더 안정적인 negative를 먼저 모델링하는 전략은 anomaly detection과 one-class learning에도 통한다. EASE는 COD를 foreground recognition이 아니라 **environment subtraction**으로 재구성했다는 점에서 신선하다.

한계도 같은 지점에 있다. background가 단일하고 반복적이라는 dataset prior를 활용하므로 복잡한 실내, 여러 재질, salient object와 camouflaged object가 함께 있는 장면에서 재평가가 필요하다.
